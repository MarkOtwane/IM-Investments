import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products) => (this.products = products),
      error: (err) => console.error('Failed to load products', err),
    });
  }

  deleteProduct(id: number): void {
    this.productService.delete(id).subscribe({
      next: () =>
        this.productService
          .getAll()
          .subscribe((products) => (this.products = products)),
      error: (err) => console.error('Failed to delete product', err),
    });
  }
}
