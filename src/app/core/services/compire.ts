import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../models/product.modals';

@Injectable({ providedIn: 'root' })
export class CompareService {
  private readonly KEY = 'compare';
  private readonly MAX = 4;
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  list = signal<Product[]>(this.load());

  private load(): Product[] {
    if (!this.isBrowser) return [];
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch {
      return [];
    }
  }

  private save() {
    if (!this.isBrowser) return;
    localStorage.setItem(this.KEY, JSON.stringify(this.list()));
  }

  add(product: Product) {
    if (this.list().length >= this.MAX) return;
    if (this.has(product._id)) return;
    this.list.update(l => [...l, product]);
    this.save();
  }

  remove(id: string) {
    this.list.update(l => l.filter(p => p._id !== id));
    this.save();
  }

  has(id: string): boolean {
    return this.list().some(p => p._id === id);
  }

  clear() {
    this.list.set([]);
    if (this.isBrowser) localStorage.removeItem(this.KEY);
  }
}
