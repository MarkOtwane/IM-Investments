import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
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
    component: DashboardComponent,
    // children: [
    //   { path: 'view-products', component: ViewProductsComponent },
    //   { path: 'edit-product/:id', component: EditProductComponent },
    //   { path: 'add-product', component: AddProductComponent },
    //   { path: 'product-list', component: ProductListComponent },
    //   { path: 'view-users', component: ViewUsersComponent },
    //   { path: '', redirectTo: 'view-products', pathMatch: 'full' },
    // ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
