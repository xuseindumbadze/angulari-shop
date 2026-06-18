import { inject, Injectable, signal } from '@angular/core';
import { Product, ProductsResponse, Category } from '../../models/product.modals';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProductSearchParams } from '../../models/filter.models';

@Injectable({ providedIn: 'root' })
export class Services {
  public http = inject(HttpClient);
  private readonly BASE = 'https://api.everrest.educata.dev/shop/products';

  private _products = signal<Product[]>([]);
  products = this._products.asReadonly();

  /**
   * სერვერის მხარეს ფილტრაცია + დახარისხება + პაგინაცია ერთ მოთხოვნაში.
   * total ბრუნდება *გაფილტრული* შედეგისთვის — ამიტომ პაგინაცია ყოველთვის ემთხვევა
   * ნაჩვენებ პროდუქტებს (ეს ასწორებს price ფილტრის არევას პაგინაციისას).
   */
  searchProducts(query: ProductSearchParams): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page_index', query.page_index)
      .set('page_size', query.page_size);

    if (query.keywords) params = params.set('keywords', query.keywords);
    if (query.category_id) params = params.set('category_id', query.category_id);
    if (query.brand) params = params.set('brand', query.brand);
    if (query.rating !== undefined && query.rating !== null) {
      params = params.set('rating', query.rating);
    }
    if (query.price_min !== undefined && query.price_min !== null) {
      params = params.set('price_min', query.price_min);
    }
    if (query.price_max !== undefined && query.price_max !== null) {
      params = params.set('price_max', query.price_max);
    }
    // sort_by და sort_direction იგზავნება მხოლოდ ერთად (API-ის მოთხოვნა).
    if (query.sort_by && query.sort_direction) {
      params = params
        .set('sort_by', query.sort_by)
        .set('sort_direction', query.sort_direction);
    }

    return this.http
      .get<ProductsResponse>(`${this.BASE}/search`, { params })
      .pipe(tap((res) => this._products.set(res.products)));
  }

  /** /all — პაგინაცია ფილტრის გარეშე (იყენებს cart-page სრული კატალოგის ასაშენებლად). */
  productsAll(pageIndex: number = 1, pageSize: number = 38): Observable<ProductsResponse> {
    return this.http
      .get<ProductsResponse>(`${this.BASE}/all?page_index=${pageIndex}&page_size=${pageSize}`)
      .pipe(tap((res) => this._products.set(res.products)));
  }

  /**
   * ცალკეული პროდუქტი Swagger-ის სწორი endpoint-ით (/id/{id}).
   * ძველი ვერსია მხოლოდ პირველ 38 პროდუქტში ეძებდა → ვერ პოულობდა დანარჩენებს.
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.BASE}/id/${id}`);
  }

  getCategories() {
    return this.http.get<Category[]>(`${this.BASE}/categories`);
  }

  getBrands() {
    return this.http.get<string[]>(`${this.BASE}/brands`);
  }
}
