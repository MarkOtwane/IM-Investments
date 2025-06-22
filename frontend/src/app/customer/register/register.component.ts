import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../register/register.component.html',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
