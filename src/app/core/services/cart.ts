import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../../models/cart-modals';
import { tap, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private readonly BASE = 'https://api.everrest.educata.dev/shop/cart';

  cart = signal<Cart | null>(null);

  getCart() {
    return this.http.get<Cart>(this.BASE).pipe(
      tap((cart: Cart) => this.cart.set(cart))
    );
  }

  addProduct(id: string, quantity: number = 1) {
    return this.http.post<Cart>(`${this.BASE}/product`, { id, quantity }).pipe(
      catchError(() => {
        return this.http.patch<Cart>(`${this.BASE}/product`, { id, quantity });
      }),
      tap((cart: Cart) => this.cart.set(cart))
    );
  }

  updateProduct(id: string, quantity: number) {
    return this.http.patch<Cart>(`${this.BASE}/product`, { id, quantity }).pipe(
      tap((cart: Cart) => this.cart.set(cart))
    );
  }

  removeProduct(id: string) {
    return this.http.delete<Cart>(`${this.BASE}/product`, { body: { id } }).pipe(
      tap((cart: Cart) => this.cart.set(cart))
    );
  }

  clearCart() {
    return this.http.delete<void>(this.BASE).pipe(
      tap(() => this.cart.set(null))
    );
  }

  checkout() {
    return this.http.post<void>(`${this.BASE}/checkout`, {});
  }
}
