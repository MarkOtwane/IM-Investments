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
        const isLoggedIn = this.authService.isLoggedIn();
        const isAdminRoute = url.startsWith('/admin');
        const isCustomerRoute = url.startsWith('/customer');

        const hideForAdmin = isAdminRoute;
        const hideForAuthPages = url.startsWith('/customer/login') || url.startsWith('/customer/register');
        const hideForCustomer = isCustomerRoute && isLoggedIn;

        const shouldHide = hideForAdmin || hideForCustomer || hideForAuthPages;
        this.showHeader = !shouldHide;
        this.showFooter = !shouldHide;
      });
  }
}
