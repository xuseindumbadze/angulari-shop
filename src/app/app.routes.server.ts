import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'profile', renderMode: RenderMode.Server },
  { path: 'cart', renderMode: RenderMode.Server },
  { path: 'product/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender },
  { path: 'compare', renderMode: RenderMode.Prerender },
];
