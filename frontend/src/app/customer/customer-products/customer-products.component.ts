import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Location } from '@angular/common';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-customer-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './customer-products.component.html',
  styleUrls: ['./customer-products.component.css'],
})
export class CustomerProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private productService: ProductService, private cartService: CartService, private location: Location) {}

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
    this.location.back();
  }

  onAddToCart(productId: number): void {
    this.cartService.addToCart(productId, 1).subscribe({
      next: (cartItem) => {
        console.log('Added to cart:', cartItem);
        // TODO: Show success message or update cart count
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        // TODO: Show error message
      },
    });
  }
}
