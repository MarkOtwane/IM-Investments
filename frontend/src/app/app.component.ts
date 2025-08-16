import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'IM Investments';
  showHeader = true;
  showFooter = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide header and footer for login, register, admin, and customer pages
        const hiddenRoutes = [
          '/customer/login',
          '/customer/register',
          '/admin',
          '/customer/dashboard',
          '/customer/cart',
          '/customer/orders',
          '/customer/marketplace',
          '/customer/order-history',
        ];
        this.showHeader = !hiddenRoutes.some((route) =>
          event.url.includes(route)
        );
        this.showFooter = !hiddenRoutes.some((route) =>
          event.url.includes(route)
        );
      });
  }
}
