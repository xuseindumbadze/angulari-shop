import { Component, inject, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { Product, Category } from '../../../models/product.modals';
import { ProductSearchParams } from '../../../models/filter.models';
import { Services } from '../../../core/services/services';
import { CartService } from '../../../core/services/cart';
import { catchError, of, Subject, takeUntil, tap, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompareService } from '../../../core/services/compire';
import { AuthService } from '../../../core/services/auth';
import { TranslationService } from '../../../core/services/translation.service';

type PageItem = number | 'gap';

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

  // ─── მონაცემები ────────────────────────────────────────────────────────────
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  brands = signal<string[]>([]);
  loading = signal(true);
  hasError = signal(false);
  addingToCart = signal<string | null>(null);
  addedToCart = signal<string | null>(null);

  // ─── პაგინაცია ─────────────────────────────────────────────────────────────
  pageIndex = signal(1);
  pageSize = signal(6);
  total = signal(0);
  pageSizeOptions = [6, 9, 18, 36];

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  displayStart = computed(() =>
    this.total() === 0 ? 0 : (this.pageIndex() - 1) * this.pageSize() + 1
  );
  displayEnd = computed(() => Math.min(this.pageIndex() * this.pageSize(), this.total()));

  visiblePages = computed<PageItem[]>(() => {
    const total = this.totalPages();
    const current = this.pageIndex();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: PageItem[] = [1];
    if (current > 3) pages.push('gap');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('gap');
    pages.push(total);
    return pages;
  });

  // ─── ფილტრები ──────────────────────────────────────────────────────────────
  selectedCategory = signal<string | null>(null);
  selectedBrand = signal<string | null>(null);
  selectedRating = signal<number | null>(null);

  priceMin = signal<number | null>(null);
  priceMax = signal<number | null>(null);

  categoryOpen = signal(false);
  brandOpen = signal(false);
  ratingOpen = signal(false);
  priceOpen = signal(false);


  tempPriceMin: number | null = null;
  tempPriceMax: number | null = null;

  ngOnInit() {
    this.load();

    forkJoin({
      categories: this.svc.getCategories(),
      brands: this.svc.getBrands(),
    })
      .pipe(
        takeUntil(this.destroyed$),
        tap(({ categories, brands }) => {
          this.categories.set(categories);
          this.brands.set(brands);
        }),
        catchError(() => of(null))
      )
      .subscribe();
  }


  load() {
    this.loading.set(true);
    this.hasError.set(false);

    const params: ProductSearchParams = {
      page_index: this.pageIndex(),
      page_size: this.pageSize(),
    };

    const cat = this.selectedCategory();
    if (cat) params.category_id = cat;

    const brand = this.selectedBrand();
    if (brand) params.brand = brand;

    const rating = this.selectedRating();
    if (rating !== null) params.rating = rating;

    const min = this.priceMin();
    if (min !== null) params.price_min = min;

    const max = this.priceMax();
    if (max !== null) params.price_max = max;

    this.svc
      .searchProducts(params)
      .pipe(
        takeUntil(this.destroyed$),
        tap((res) => {
          this.products.set(res.products);
          this.total.set(res.total);
          this.loading.set(false);
        }),
        catchError(() => {
          this.hasError.set(true);
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }


  private applyFilters() {
    this.pageIndex.set(1);
    this.load();
  }

  // ─── ფილტრის ჰენდლერები ────────────────────────────────────────────────────
  selectCategory(id: string) {
    this.selectedCategory.set(this.selectedCategory() === id ? null : id);
    this.applyFilters();
  }

  selectBrand(brand: string) {
    this.selectedBrand.set(this.selectedBrand() === brand ? null : brand);
    this.applyFilters();
  }

  selectRating(r: number) {
    this.selectedRating.set(this.selectedRating() === r ? null : r);
    this.applyFilters();
  }

  applyPrice() {
    let min = this.tempPriceMin;
    let max = this.tempPriceMax;
    if (min !== null && max !== null && min > max) {
      [min, max] = [max, min];
      this.tempPriceMin = min;
      this.tempPriceMax = max;
    }
    this.priceMin.set(min);
    this.priceMax.set(max);
    this.applyFilters();
  }

  resetAll() {
    this.selectedCategory.set(null);
    this.selectedBrand.set(null);
    this.selectedRating.set(null);
    this.priceMin.set(null);
    this.priceMax.set(null);
    this.tempPriceMin = null;
    this.tempPriceMax = null;
    this.pageIndex.set(1);
    this.load();
  }

  // ─── პაგინაცია ─────────────────────────────────────────────────────────────
  changePage(page: number) {
    if (page < 1 || page > this.totalPages() || page === this.pageIndex()) return;
    this.pageIndex.set(page);
    this.load();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  changePageSize(size: number) {
    this.pageSize.set(+size);
    this.pageIndex.set(1);
    this.load();
  }

  // ─── კალათა / შედარება / რეიტინგი ──────────────────────────────────────────
  addToCart(event: Event, productId: string) {
    event.stopPropagation();
    if (!this.auth.isLoggedIn) return;
    this.addingToCart.set(productId);
    const cart = this.cartService.cart();
    const existing = cart?.products.find((p) => p.productId === productId);
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

  toggleCompare(event: Event, product: Product) {
    event.stopPropagation();
    this.compareService.has(product._id)
      ? this.compareService.remove(product._id)
      : this.compareService.add(product);
  }

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
