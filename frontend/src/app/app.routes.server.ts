import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // All parameterized routes should use Server-Side Rendering
  { path: 'admin/products/:id/edit', renderMode: RenderMode.Server },
  { path: 'home/products/:id', renderMode: RenderMode.Server },
  { path: 'customer/products/:id', renderMode: RenderMode.Server },
  { path: 'products/:id', renderMode: RenderMode.Server },

  // Everything else stays prerendered
  { path: '**', renderMode: RenderMode.Prerender },
];
