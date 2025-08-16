import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';

import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ProductDetailComponent } from './product-details/product-details.component';
import { RegisterComponent } from './register/register.component';
import { CustomerLayoutComponent } from './layout/customer-layout.component';
import { CustomerMarketplaceComponent } from './customer-marketplace/customer-marketplace.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    SharedModule,
    RouterModule,
    // Standalone components
    HomeComponent,
    CartComponent,
    LoginComponent,
    RegisterComponent,
    PasswordResetComponent,
    ProductDetailComponent,
    CustomerLayoutComponent,
    CustomerMarketplaceComponent,
  ],
  exports: [],
})
export class CustomerModule {}
