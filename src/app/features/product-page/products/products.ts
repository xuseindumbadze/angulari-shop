import { Component, inject, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { Product, Category } from '../../../models/product.modals';
import { Services } from '../../../core/services/services';
import { CartService } from '../../../core/services/cart';
import { catchError, of, Subject, takeUntil, tap, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompareService } from '../../../core/services/compire';
import { AuthService } from '../../../core/services/auth';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit, OnDestroy {
  private svc = inject(Services);
  private cartService = inject(CartService);
  private destroyed$ = new Subject<void>();

  compareService = inject(CompareService);
  auth = inject(AuthService);
  translation = inject(TranslationService);

  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  brands = signal<string[]>([]);
  hasError = signal(false);
  addingToCart = signal<string | null>(null);
  addedToCart = signal<string | null>(null);

  pageIndex = signal(1);
  pageSize = signal(6);
  total = signal(0);
  pageSizeOptions = [6, 9, 18, 36];

  totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.pageIndex();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1) as (number | 'gap')[];

    const pages: (number | 'gap')[] = [1];
    if (current > 3) pages.push('gap');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('gap');
    pages.push(total);
    return pages;
  });

  selectedCategory = signal<string | null>(null);
  selectedBrand = signal<string | null>(null);
  selectedRating = signal<number | null>(null);
  priceMin = signal<number>(0);
  priceMax = signal<number>(8000);

  categoryOpen = signal(false);
  brandOpen = signal(false);
  ratingOpen = signal(false);
  priceOpen = signal(false);

  tempPriceMin = 0;
  tempPriceMax = 8000;

  products = computed(() => {
    let list = this.allProducts();
    const cat = this.selectedCategory();
    if (cat) list = list.filter(p => p.category.id === cat);
    const brand = this.selectedBrand();
    if (brand) list = list.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    const rating = this.selectedRating();
    if (rating !== null) list = list.filter(p => p.rating >= rating);
    const min = this.priceMin();
    const max = this.priceMax();
    list = list.filter(p => p.price.current >= min && p.price.current <= max);
    return list;
  });

  ngOnInit() {
    this.loadProducts();
    forkJoin({
      categories: this.svc.getCategories(),
      brands: this.svc.getBrands(),
    }).pipe(
      takeUntil(this.destroyed$),
      tap(({ categories, brands }) => {
        this.categories.set(categories);
        this.brands.set(brands);
      }),
      catchError(() => { this.hasError.set(true); return of(null); })
    ).subscribe();
  }

  loadProducts() {
    this.svc.productsAll(this.pageIndex(), this.pageSize()).pipe(
      takeUntil(this.destroyed$),
      tap(res => {
        this.allProducts.set(res.products);
        this.total.set(res.total);
      }),
      catchError(() => { this.hasError.set(true); return of(null); })
    ).subscribe();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageIndex.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  changePageSize(size: number) {
    this.pageSize.set(+size);
    this.pageIndex.set(1);
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addToCart(event: Event, productId: string) {
    event.stopPropagation();
    if (!this.auth.isLoggedIn) return;
    this.addingToCart.set(productId);
    const cart = this.cartService.cart();
    const existing = cart?.products.find(p => p.productId === productId);
    const newQuantity = existing ? existing.quantity + 1 : 1;
    const request$ = existing
      ? this.cartService.updateProduct(productId, newQuantity)
      : this.cartService.addProduct(productId, 1);
    request$.pipe(catchError(() => of(null))).subscribe(() => {
      this.addingToCart.set(null);
      this.addedToCart.set(productId);
      setTimeout(() => this.addedToCart.set(null), 2000);
    });
  }

  selectCategory(id: string) { this.selectedCategory.set(this.selectedCategory() === id ? null : id); }
  selectBrand(brand: string) { this.selectedBrand.set(this.selectedBrand() === brand ? null : brand); }
  selectRating(r: number) { this.selectedRating.set(this.selectedRating() === r ? null : r); }

  applyPrice() {
    this.priceMin.set(this.tempPriceMin);
    this.priceMax.set(this.tempPriceMax);
  }

  resetAll() {
    this.selectedCategory.set(null);
    this.selectedBrand.set(null);
    this.selectedRating.set(null);
    this.priceMin.set(0);
    this.priceMax.set(8000);
    this.tempPriceMin = 0;
    this.tempPriceMax = 8000;
  }

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  toggleCompare(event: Event, product: Product) {
    event.stopPropagation();
    this.compareService.has(product._id)
      ? this.compareService.remove(product._id)
      : this.compareService.add(product);
  }
}
