import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse, Category } from '../../models/product.modals';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Services {
  public http = inject(HttpClient);
  private readonly BASE = 'https://api.everrest.educata.dev/shop/products';

  productsAll() {
    return this.http.get<ProductsResponse>(`${this.BASE}/all?page_size=38`);
  }

  getCategories() {
    return this.http.get<Category[]>(`${this.BASE}/categories`);
  }

  getBrands() {
    return this.http.get<string[]>(`${this.BASE}/brands`);
  }

 
}
