import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    data: { prerender: false }
  },
  {
    path: 'home/products',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    data: { prerender: false }
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    data: { prerender: false }
  },
  {
    path: 'customer/products',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    data: { prerender: false }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: { prerender: false }
  },
  {
    path: 'admin/products',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: { prerender: false }
  },
  { path: '**', redirectTo: 'home' },
];
