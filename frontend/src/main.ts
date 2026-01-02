import { bootstrapApplication } from '@angular/platform-browser';
import 'reflect-metadata';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ThemeService } from './app/core/services/theme.service';

// Initialize theme service
const themeService = new ThemeService();

bootstrapApplication(AppComponent, appConfig);
