import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { ProductFormComponent } from './admin/components/product-form/product-form.component';
import { CartComponent } from './customer/cart/cart.component';
import { HomeComponent } from './customer/home/home.component';
import { LoginComponent } from './customer/login/login.component';
import { RegisterComponent } from './customer/register/register.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: RegisterComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'footer', component: FooterComponent },
  {
    path: 'admin',
    children: [
      { path: '', component: DashboardComponent }, // /admin
      { path: 'product-form', component: ProductFormComponent }, // /admin/product-form
    ],
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
