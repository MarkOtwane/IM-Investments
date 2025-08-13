import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Fetch product IDs at build time for prerendering.
 * Adjust the API URL to match your backend.
 */
export async function getPrerenderParams() {
  const response = await fetch('https://api.example.com/products');
  if (!response.ok) {
    console.warn('⚠️ Failed to fetch product list for prerendering.');
    return [];
  }

  const products = await response.json();
  return products.map((product: any) => ({ id: product.id }));
}

export const serverRoutes: ServerRoute[] = [
  // Public product detail pages — prerender with known IDs
  {
    path: 'home/products/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams,
  },
  {
    path: 'customer/products/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams,
  },

  // Admin product editing — render dynamically (no prerender)
  {
    path: 'admin/products/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/products/products/:id/edit',
    renderMode: RenderMode.Server,
  },

  // Fallback: prerender everything else
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
