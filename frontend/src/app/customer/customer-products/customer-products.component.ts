import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/products.service';

@Component({
  selector: 'app-customer-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-products.component.html',
  styleUrls: ['./customer-products.component.css'],
})
export class CustomerProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.loading = false;
      },
    });
  }

  goBackToDashboard(): void {
    window.history.back();
  }
}
