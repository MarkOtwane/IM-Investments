import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Product detail pages → SSR (no prerender)
  { path: 'home/products/:id', renderMode: RenderMode.Server },
  { path: 'home/products/products/:id', renderMode: RenderMode.Server },
  { path: 'customer/products/:id', renderMode: RenderMode.Server },
  { path: 'customer/products/products/:id', renderMode: RenderMode.Server },
  { path: 'admin/products/products/:id/edit', renderMode: RenderMode.Server },

  // All other pages → prerender
  { path: '**', renderMode: RenderMode.Prerender },
];
