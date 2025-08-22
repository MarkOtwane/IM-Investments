import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './core/services/auth.service';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FooterComponent,
    HeaderComponent,
    NotificationComponent,
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
        const isCustomerRoute = url.startsWith('/customer/');
        
        // Hide header/footer for admin routes, auth pages, and customer routes
        const shouldHide = isAdminRoute || isAuthPage || isCustomerRoute;
        this.showHeader = !shouldHide;
        this.showFooter = !shouldHide;
      });
  }
}
