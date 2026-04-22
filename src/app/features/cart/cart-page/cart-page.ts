import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { Services } from '../../../core/services/services';
import { CartProduct } from '../../../models/cart-modals';
import { Product } from '../../../models/product.modals';
import { catchError, of, switchMap } from 'rxjs';

export interface CartItemView {
  productId: string;
  quantity: number;
  pricePerQuantity: number;
  beforeDiscountPrice: number;
  title: string;
  thumbnail: string;
  stock: number;
}

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage implements OnInit {
  private cartService = inject(CartService);
  private svc = inject(Services);
  private router = inject(Router);

  cart = this.cartService.cart;
  cartItems = signal<CartItemView[]>([]);
  allProducts = signal<Product[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
  checkoutLoading = signal(false);
  checkoutSuccess = signal(false);

  ngOnInit() {
    this.svc.productsAll().pipe(
      catchError(() => {
        this.hasError.set(true);
        this.isLoading.set(false);
        return of(null);
      }),
      switchMap(productsRes => {
        if (!productsRes) return of(null);
        this.allProducts.set(productsRes.products);
        return this.cartService.getCart().pipe(
          catchError(() => {
            this.hasError.set(true);
            this.isLoading.set(false);
            return of(null);
          })
        );
      })
    ).subscribe(cart => {
      this.isLoading.set(false);
      if (cart) this.buildCartItems(cart.products, this.allProducts());
    });
  }

  buildCartItems(cartProducts: CartProduct[], products: Product[]) {
    const items: CartItemView[] = cartProducts.map(cp => {
      const found = products.find(p => p._id === cp.productId);
      return {
        productId: cp.productId,
        quantity: cp.quantity,
        pricePerQuantity: cp.pricePerQuantity,
        beforeDiscountPrice: cp.beforeDiscountPrice,
        title: found?.title || 'Unknown Product',
        thumbnail: found?.thumbnail || '',
        stock: found?.stock || 0,
      };
    });
    this.cartItems.set(items);
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;

    const item = this.cartItems().find(i => i.productId === productId);
    if (item && quantity > item.stock) return;

    this.cartService.updateProduct(productId, quantity).pipe(
      catchError(() => of(null))
    ).subscribe(cart => {
      if (cart) {
        this.buildCartItems(cart.products, this.allProducts());
      }
    });
  }

  removeProduct(productId: string) {
    this.cartService.removeProduct(productId).pipe(
      catchError(() => of(null))
    ).subscribe(cart => {
      if (cart) {
        this.buildCartItems(cart.products, this.allProducts());
      }
    });
  }

  clearCart() {
    this.cartService.clearCart().pipe(
      catchError(() => of(null))
    ).subscribe(() => {
      this.cartItems.set([]);
    });
  }

  checkout() {
    this.checkoutLoading.set(true);
    this.cartService.checkout().pipe(
      catchError(() => {
        this.checkoutLoading.set(false);
        return of(null);
      })
    ).subscribe(() => {
      this.checkoutLoading.set(false);
      this.checkoutSuccess.set(true);
      this.cartService.cart.set(null);
      this.cartItems.set([]);
    });
  }

  goShopping() {
    this.router.navigate(['/']);
  }
}
