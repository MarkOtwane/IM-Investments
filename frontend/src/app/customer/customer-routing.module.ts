import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { CartComponent } from './cart/cart.component';
import { CustomerDashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ProductDetailComponent } from './product-details/product-details.component';
import { RegisterComponent } from './register/register.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CustomerOrdersComponent } from './orders/orders.component';
import { CustomerProfileComponent } from './profile/profile.component';
import { CustomerLayoutComponent } from './layout/customer-layout.component';
import { CustomerMarketplaceComponent } from './customer-marketplace/customer-marketplace.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CustomerDashboardComponent, canActivate: [AuthGuard] },
      { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
      { path: 'orders', component: CustomerOrdersComponent, canActivate: [AuthGuard] },
      { path: 'marketplace', component: CustomerMarketplaceComponent },
      { path: 'order-history', component: CustomerOrdersComponent, canActivate: [AuthGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: CustomerProfileComponent, canActivate: [AuthGuard] },
      { path: 'wishlist', component: CustomerOrdersComponent, canActivate: [AuthGuard] }, // Placeholder
      { path: 'products/:id', component: ProductDetailComponent },
    ]
  },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: HomeComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'password-reset', component: PasswordResetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
