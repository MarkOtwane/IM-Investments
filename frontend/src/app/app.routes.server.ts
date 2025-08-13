import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Admin edit page → SSR (dynamic)
  { path: 'admin/products/:id/edit', renderMode: RenderMode.Server },

  // If you have other dynamic product pages:
  { path: 'home/products/:id', renderMode: RenderMode.Server },
  { path: 'customer/products/:id', renderMode: RenderMode.Server },

  // Everything else stays prerendered
  { path: '**', renderMode: RenderMode.Prerender },
];
