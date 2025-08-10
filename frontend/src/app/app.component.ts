import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FooterComponent, HeaderComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Shopie';
  showHeader = true;
  showFooter = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide header and footer for login, register, and admin pages
        const hiddenRoutes = ['/customer/login', '/customer/register', '/admin'];
        this.showHeader = !hiddenRoutes.some(route => event.url.includes(route));
        this.showFooter = !hiddenRoutes.some(route => event.url.includes(route));
      });
  }
}
