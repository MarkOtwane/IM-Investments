import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';
import { CustomerFooterComponent } from './customer-footer/customer-footer.component';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomerHeaderComponent,
    CustomerFooterComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <app-customer-header></app-customer-header>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      <app-customer-footer></app-customer-footer>
    </div>
  `
})
export class CustomerLayoutComponent {}
