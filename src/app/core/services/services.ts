import { inject, Injectable, signal } from '@angular/core';
import { Product, ProductsResponse, Category } from '../../models/product.modals';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Services {
  public http = inject(HttpClient);
  private readonly BASE = 'https://api.everrest.educata.dev/shop/products';

  private _products = signal<Product[]>([]);
  private _productsLoaded = false;
  private _products$: Observable<ProductsResponse> | null = null;

  products = this._products.asReadonly();

  productsAll(pageIndex: number = 1, pageSize: number = 38): Observable<ProductsResponse> {
    if (!this._products$) {
      this._products$ = this.http.get<ProductsResponse>(
        `${this.BASE}/all?page_index=${pageIndex}&page_size=${pageSize}`
      ).pipe(
        tap(res => {
          this._products.set(res.products);
          this._productsLoaded = true;
        }),
        shareReplay(1)
      );
    }
    return this._products$;
  }

  getProductById(id: string): Observable<Product | null> {
    return this.productsAll().pipe(
      map(res => res.products.find(p => p._id === id) ?? null)
    );
  }

  getCategories() {
    return this.http.get<Category[]>(`${this.BASE}/categories`);
  }

  getBrands() {
    return this.http.get<string[]>(`${this.BASE}/brands`);
  }
}
