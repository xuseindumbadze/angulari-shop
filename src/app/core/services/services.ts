import { inject, Injectable, signal } from '@angular/core';
import { Product, ProductsResponse, Category } from '../../models/product.modals';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Services {
  public http = inject(HttpClient);
  private readonly BASE = 'https://api.everrest.educata.dev/shop/products';

  private _products = signal<Product[]>([]);
  private _productsLoaded = false;
  private _products$: Observable<ProductsResponse> | null = null;

  products = this._products.asReadonly();

  productsAll(): Observable<ProductsResponse> {
    if (!this._products$) {
      this._products$ = this.http.get<ProductsResponse>(`${this.BASE}/all?page_size=38`).pipe(
        tap(res => {
          this._products.set(res.products);
          this._productsLoaded = true;
        }),
        shareReplay(1)
      );
    }
    return this._products$;
  }

  getCategories() {
    return this.http.get<Category[]>(`${this.BASE}/categories`);
  }

  getBrands() {
    return this.http.get<string[]>(`${this.BASE}/brands`);
  }
}
