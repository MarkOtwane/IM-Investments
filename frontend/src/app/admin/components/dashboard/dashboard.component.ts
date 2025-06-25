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
    this.productService.getAll().subscribe({
      next: (products: Product[]) => (this.products = products),
      error: (err: any) => console.error('Failed to load products', err),
    });
  }

  editProduct(productId: number): void {
    this.router.navigate([`/admin/products/${productId}/edit`]);
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(productId).subscribe({
        next: () =>
          this.productService
            .getAll()
            .subscribe((products: Product[]) => (this.products = products)),
        error: (err: any) => console.error('Failed to delete product', err),
      });
    }
  }

  createProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }
}
