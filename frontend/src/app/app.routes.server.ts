import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';

// Static list of product IDs for prerendering
// In a real application, this should be dynamically fetched from your API
const productIds = ['1', '2', '3', '4', '5'];

// Function to generate prerender params for product routes
const getProductPrerenderParams = async (): Promise<Record<string, string>[]> => {
  return productIds.map(id => ({ id }));
};

export const serverRoutes: ServerRoute[] = [
  // All parameterized routes should use Server-Side Rendering with prerender params
  {
    path: 'admin/products/:id/edit',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getProductPrerenderParams,
    fallback: PrerenderFallback.Server
  },
  {
    path: 'home/products/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getProductPrerenderParams,
    fallback: PrerenderFallback.Server
  },
  {
    path: 'customer/products/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getProductPrerenderParams,
    fallback: PrerenderFallback.Server
  },

  // Everything else stays prerendered
  { path: '**', renderMode: RenderMode.Prerender },
];
