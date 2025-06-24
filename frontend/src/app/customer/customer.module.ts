import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductCardComponent } from '../shared/components/product-card/product-card.component';
import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './cart/cart.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ProductDetailComponent } from './product-details/product-details.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CustomerRoutingModule,
    ProductDetailComponent,
    HomeComponent,
    CartComponent,
    LoginComponent,
    RegisterComponent,
    PasswordResetComponent,
  ],
  exports: [ProductCardComponent],
})
export class CustomerModule {}
