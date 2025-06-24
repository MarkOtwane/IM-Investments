import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/products.service';
import { CurrencyPipe } from "../../shared/pipes/currency.pipe";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CurrencyPipe],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(productId).subscribe({
      next: (product) => (this.product = product),
      error: (err) => {
        this.error = 'Product not found';
        console.error('Failed to load product', err);
      },
    });
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/customer/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
    if (
      this.product &&
      this.quantity > 0 &&
      this.quantity <= this.product.stock
    ) {
      this.cartService.addToCart(this.product.id, this.quantity).subscribe({
        next: () => {
          alert('Added to cart!');
          this.router.navigate(['/customer/cart']);
        },
        error: (err) => {
          this.error =
            err.status === 400 ? 'Insufficient stock' : 'Failed to add to cart';
          console.error('Add to cart error', err);
        },
      });
    } else {
      this.error = 'Invalid quantity or product unavailable';
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
