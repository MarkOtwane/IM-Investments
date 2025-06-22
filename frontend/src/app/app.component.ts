import { Component } from '@angular/core';
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';
import { CustomerModule } from './customer/customer.module';

@Component({
  selector: 'app-root',
  imports: [AdminModule, CoreModule, CustomerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
