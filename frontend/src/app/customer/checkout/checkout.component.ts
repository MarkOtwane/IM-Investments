import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  message: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private paymentService: PaymentService, private cartService: CartService, private router: Router) {
    this.checkoutForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^2547\d{8}$/)]],
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      return;
    }
    this.message = null;
    this.error = null;

    const phoneNumber = this.checkoutForm.value.phoneNumber;
    this.paymentService.initiatePayment(phoneNumber).subscribe({
      next: (res) => {
        this.message = res.message;
        // Ensure cart is cleared on success
        this.cartService.clearCart().subscribe({
          next: () => {
            // Navigate to orders page after successful payment
            this.router.navigate(['/customer/orders']);
          },
          error: () => {
            // Even if clearing fails, navigate to orders
            this.router.navigate(['/customer/orders']);
          }
        });
      },
      error: (err) => {
        this.error = err.error.message || 'Payment failed';
      },
    });
  }
}
