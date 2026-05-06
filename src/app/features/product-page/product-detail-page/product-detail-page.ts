import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Services } from '../../../core/services/services';
import { CartService } from '../../../core/services/cart';
import { Product } from '../../../models/product.modals';
import { catchError, of } from 'rxjs';
import { CompareService } from '../../../core/services/compire';
import { AuthService } from '../../../core/services/auth';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-product-detail-page',
  imports: [CommonModule],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.scss',
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(Services);
  private cartService = inject(CartService);

  compareService = inject(CompareService);
  auth = inject(AuthService);
  translation = inject(TranslationService);

  product = signal<Product | null>(null);
  hasError = signal(false);
  selectedImage = signal<string>('');
  addedToCart = signal(false);
  cartLoading = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.svc.getProductById(id).pipe(
        catchError(() => { this.hasError.set(true); return of(null); })
      ).subscribe(product => {
        if (product) {
          const allImages = [product.thumbnail, ...product.images];
          product.images = allImages;
          this.product.set(product);
          this.selectedImage.set(product.thumbnail);
        } else {
          this.hasError.set(true);
        }
      });
    }
  }

  addToCart(productId: string) {
    if (!this.auth.isLoggedIn) return;
    this.cartLoading.set(true);
    this.cartService.addProduct(productId).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      this.cartLoading.set(false);
      if (res) {
        this.addedToCart.set(true);
        setTimeout(() => this.addedToCart.set(false), 2000);
      }
    });
  }

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  goBack() { this.router.navigate(['/']); }

  toggleCompare(product: Product) {
    this.compareService.has(product._id)
      ? this.compareService.remove(product._id)
      : this.compareService.add(product);
  }
}
