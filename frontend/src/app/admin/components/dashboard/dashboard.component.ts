import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/products.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [ProductCardComponent],
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => (this.products = products),
      error: (err: any) => console.error('Failed to load products', err),
    });
  }

  editProduct(productId: number): void {
    this.router.navigate([`/admin/products/${productId}/edit`]);
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId.toString()).subscribe({
        next: () =>
          this.productService
            .getAllProducts()
            .subscribe((products: Product[]) => (this.products = products)),
        error: (err: any) => console.error('Failed to delete product', err),
      });
    }
  }

  createProduct(): void {
    alert('Create button clicked');
    this.router.navigate(['/admin/product-form']);
  }
}
