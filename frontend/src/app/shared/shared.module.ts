import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { CurrencyPipe } from './pipes/currency.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ProductCardComponent,
    HeaderComponent,
    FooterComponent,
    CurrencyPipe,
  ],
  exports: [
    ProductCardComponent,
    HeaderComponent,
    FooterComponent,
    CurrencyPipe,
  ],
})
export class SharedModule {}
