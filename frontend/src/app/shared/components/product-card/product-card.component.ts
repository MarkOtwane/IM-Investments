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
  @Input() product!: Product; 
  @Input() isAdmin: boolean = false;
  @Output() addToCart = new EventEmitter<number>(); 
  @Output() editProduct = new EventEmitter<number>(); 
  @Output() deleteProduct = new EventEmitter<number>(); 

  onAddToCart(): void {
    alert('button is clicked');
    this.addToCart.emit(this.product.id);
  }

  onEditProduct(): void {
    this.editProduct.emit(this.product.id);
  }

  onDeleteProduct(): void {
    this.deleteProduct.emit(this.product.id);
  }
}
