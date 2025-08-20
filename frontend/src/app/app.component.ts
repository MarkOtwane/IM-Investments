import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './core/services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.url;
        const isAdminRoute = url.startsWith('/admin');
        const isAuthPage = url.startsWith('/customer/login') || 
                          url.startsWith('/customer/register') || 
                          url.startsWith('/customer/password-reset');
        const isCustomerDashboard = url.startsWith('/customer/dashboard') || 
                                   url.startsWith('/customer/cart') || 
                                   url.startsWith('/customer/orders') || 
                                   url.startsWith('/customer/marketplace') || 
                                   url.startsWith('/customer/profile') || 
                                   url.startsWith('/customer/checkout');
        
        // Hide header/footer for admin routes, auth pages, and customer dashboard
        const shouldHide = isAdminRoute || isAuthPage || isCustomerDashboard;
        this.showHeader = !shouldHide;
        this.showFooter = !shouldHide;
      });
  }
}
