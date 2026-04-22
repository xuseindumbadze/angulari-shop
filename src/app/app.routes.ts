import { Routes } from '@angular/router';
import { Products } from './features/product-page/products/products';
import { Profile } from './features/profile/profile/profile';
import { ProductDetailPage } from './features/product-page/product-detail-page/product-detail-page';
import { CartPage } from './features/cart/cart-page/cart-page';
import { authGuard } from './core/guard/auth-guard';
import { ComparePage } from './features/compire/compire';

export const routes: Routes = [
  { path: '', component: Products },
  { path: 'product/:id', component: ProductDetailPage },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'cart', component: CartPage, canActivate: [authGuard] },
  { path: 'compare', component: ComparePage },
];



