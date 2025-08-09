import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadChildren: () => import('./customer/customer-routing.module').then(m => m.CustomerRoutingModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer-routing.module').then(m => m.CustomerRoutingModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule)
  },
  { path: '**', redirectTo: 'home' },
];
