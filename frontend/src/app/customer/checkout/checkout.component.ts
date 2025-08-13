import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder, private paymentService: PaymentService) {
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
      },
      error: (err) => {
        this.error = err.error.message || 'Payment failed';
      },
    });
  }
}
