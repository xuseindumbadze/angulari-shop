import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductsResponse } from '../../models/product.modals';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  private readonly BASE = 'https://api.everrest.educata.dev/shop/products/search';

  isSearchActive = signal(false);
  searchResults = signal<Product[]>([]);

  search(keywords: string) {
    // page_size ზღუდავს header-ის dropdown-ის შედეგებს (UX).
    return this.http.get<ProductsResponse>(this.BASE, {
      params: { keywords, page_size: '8' },
    });
  }

  clearSearch() {
    this.isSearchActive.set(false);
    this.searchResults.set([]);
  }
}
