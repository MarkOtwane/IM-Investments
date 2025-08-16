import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-white border-t mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">IM Investments</h3>
            <p class="text-gray-600 text-sm">
              Your trusted e-commerce platform for quality products and excellent service.
            </p>
          </div>

          <!-- Customer Links -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-4">Customer</h4>
            <ul class="space-y-2">
              <li>
                <a routerLink="/customer/home" class="text-gray-600 hover:text-blue-600 text-sm">
                  Home
                </a>
              </li>
              <li>
                <a routerLink="/customer/marketplace" class="text-gray-600 hover:text-blue-600 text-sm">
                  Marketplace
                </a>
              </li>
              <li>
                <a routerLink="/customer/cart" class="text-gray-600 hover:text-blue-600 text-sm">
                  My Cart
                </a>
              </li>
              <li>
                <a routerLink="/customer/orders" class="text-gray-600 hover:text-blue-600 text-sm">
                  Orders
                </a>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-4">Support</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-600 hover:text-blue-600 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-blue-600 text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-blue-600 text-sm">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-blue-600 text-sm">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-4">Legal</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-600 hover:text-blue-600 text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-blue-600 text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t mt-8 pt-8 text-center">
          <p class="text-gray-600 text-sm">
            © 2024 IM Investments. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `
})
export class CustomerFooterComponent {}
