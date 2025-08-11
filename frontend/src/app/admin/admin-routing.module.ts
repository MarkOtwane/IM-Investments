import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'products', component: DashboardComponent },
  { path: 'product-form', component: ProductFormComponent },
  // { path: 'product-form/:id', component: ProductFormComponent },

  // 👇 Add edit route
  { path: 'products/:id/edit', component: ProductFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
