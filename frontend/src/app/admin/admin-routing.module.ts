import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { AdminGuard } from '../core/guards/admin.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'products/new', 
    component: ProductFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'products/:id/edit', 
    component: ProductFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
