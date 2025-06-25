import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe } from "../../pipes/currency.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  imports: [CurrencyPipe, CommonModule],
})
export class ProductCardComponent {
  @Input() product!: Product; // Required input
  @Input() isAdmin: boolean = false; // Toggle admin-specific actions
  @Output() addToCart = new EventEmitter<number>(); // Emits productId
  @Output() editProduct = new EventEmitter<number>(); // Emits productId
  @Output() deleteProduct = new EventEmitter<number>(); // Emits productId

  onAddToCart(): void {
    this.addToCart.emit(this.product.id);
  }

  onEditProduct(): void {
    this.editProduct.emit(this.product.id);
  }

  onDeleteProduct(): void {
    this.deleteProduct.emit(this.product.id);
  }
}
