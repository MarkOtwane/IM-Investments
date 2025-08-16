import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
      <app-customer-header *ngIf="showCustomerChrome"></app-customer-header>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      <app-customer-footer *ngIf="showCustomerChrome"></app-customer-footer>
    </div>
  `
})
export class CustomerLayoutComponent {
  constructor(private router: Router) {}

  get showCustomerChrome(): boolean {
    // Hide customer header/footer on dashboard route which has its own full layout
    return !this.router.url.startsWith('/customer/dashboard');
  }
}
