import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../app/core/services/products.service';
import { Product } from '../../../app/core/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products) => (this.products = products),
      error: (err) => console.error('Failed to load products', err),
    });
  }
}
