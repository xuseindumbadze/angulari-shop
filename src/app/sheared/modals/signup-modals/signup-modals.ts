import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-signup-modals',
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-modals.html',
  styleUrl: './signup-modals.scss',
})
export class SignupModalsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignIn = new EventEmitter<void>();

  auth = inject(AuthService);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  age: number | null = null;
  phone = '+995';
  zipcode = '';
  address = '';
  gender: 'MALE' | 'FEMALE' = 'MALE';
  isLoading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  submit() {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.age || !this.phone || !this.zipcode || !this.address) {
      this.errorMsg.set('Please fill in all fields.');
      return;
    }
    this.isLoading.set(true);
    this.errorMsg.set('');

    this.auth.signUp({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      age: this.age,
      phone: this.phone,
      zipcode: this.zipcode,
      address: this.address,
      gender: this.gender,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${this.firstName}`
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMsg.set('Registration successful! Please check your email to verify your account.');
        setTimeout(() => this.switchToSignIn.emit(), 2500);
         },
      error: () => {
        this.isLoading.set(false);
        this.errorMsg.set('Registration failed. Email may already be in use.');
      }
    });
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
