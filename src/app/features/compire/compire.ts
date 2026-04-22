import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CompareService } from '../../../app/core/services/compire';
import { CartService } from '../../../app/core/services/cart';
import { Product } from '../../../app/models/product.modals';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-compire',
  imports: [CommonModule, RouterLink],
  templateUrl: './compire.html',
  styleUrl: './compire.scss',
})
export class ComparePage {
  compareService = inject(CompareService);
  private cartService = inject(CartService);
  private router = inject(Router);

  addingToCart: string | null = null;
  addedToCart: string | null = null;

  get products() {
    return this.compareService.list();
  }

  get emptySlots(): number[] {
    return Array(4 - this.products.length).fill(0);
  }

  remove(id: string) {
    this.compareService.remove(id);
  }

  clear() {
    if (confirm('გამოსუფთავდეს შედარების სია?')) {
      this.compareService.clear();
    }
  }

  addToCart(id: string, stock: number) {
    if (stock <= 0) return;
    this.addingToCart = id;
    this.cartService.addProduct(id).pipe(
      catchError(() => of(null))
    ).subscribe(() => {
      this.addingToCart = null;
      this.addedToCart = id;
      setTimeout(() => this.addedToCart = null, 2000);
    });
  }

  goToProduct(id: string) {
    this.router.navigate(['/product', id]);
  }

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  getBestIndex(key: 'price' | 'rating' | 'stock', mode: 'min' | 'max'): number {
    if (this.products.length < 2) return -1;
    const vals = this.products.map(p => {
      if (key === 'price') return p.price.current;
      if (key === 'rating') return p.rating;
      return p.stock;
    });
    const best = mode === 'min' ? Math.min(...vals) : Math.max(...vals);
    return vals.indexOf(best);
  }
}
