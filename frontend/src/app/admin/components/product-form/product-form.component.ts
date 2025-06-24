import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  product: Omit<Product, 'id' | 'createdAt'> = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stock: 0,
  };
  isEdit: boolean = false;
  productId: number | null = null;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    if (this.productId) {
      this.isEdit = true;
      this.productService.getById(this.productId).subscribe({
        next: (product) =>
          (this.product = {
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            stock: product.stock,
          }),
        error: (err) => console.error('Failed to load product', err),
      });
    }
  }

  onSubmit(): void {
    if (this.isEdit && this.productId) {
      this.productService.update(this.productId, this.product).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err) => (this.error = 'Failed to update product'),
      });
    } else {
      this.productService.create(this.product).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err) => (this.error = 'Failed to create product'),
      });
    }
  }
}
