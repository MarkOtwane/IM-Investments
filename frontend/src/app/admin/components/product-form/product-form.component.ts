import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  imports:[FormsModule]
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
      this.productService.getProductById(this.productId!.toString()).subscribe({
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
      const updatedProduct: Product = {
        ...(this.product as Product),
        id: this.productId,
        createdAt: new Date().toISOString(), // or fetch the original createdAt if available
      };
      this.productService.updateProduct(this.productId.toString(), updatedProduct).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err: any) => (this.error = 'Failed to update product'),
      });
    } else {
      const newProduct: Product = {
        ...this.product,
        id: 0, // or use a temporary value, backend should assign the real id
        createdAt: new Date().toISOString(),
      };
      this.productService.createProduct(newProduct).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err: any) => (this.error = 'Failed to create product'),
      });
    }
  }
}
