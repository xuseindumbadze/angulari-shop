import { Injectable, signal } from '@angular/core';
import { Product } from '../../models/product.modals';

@Injectable({ providedIn: 'root' })
export class CompareService {
  private readonly KEY = 'compare';
  private readonly MAX = 4;

  list = signal<Product[]>(this.load());

  private load(): Product[] {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch {
      return [];
    }
  }

  private save() {
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
    localStorage.removeItem(this.KEY);
  }
}