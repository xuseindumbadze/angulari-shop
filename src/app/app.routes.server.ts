import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // კონკრეტული მარშრუტები — catch-all-მდე, თორემ '**' მათ „გადაფარავს“.
  { path: 'profile', renderMode: RenderMode.Server },
  { path: 'cart', renderMode: RenderMode.Server },
  { path: 'product/:id', renderMode: RenderMode.Server },
  { path: 'compare', renderMode: RenderMode.Prerender },
  // catch-all ბოლოს
  { path: '**', renderMode: RenderMode.Prerender },
];
