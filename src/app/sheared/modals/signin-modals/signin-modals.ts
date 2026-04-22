import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-signin-modals',
  imports: [CommonModule, FormsModule],
  templateUrl: './signin-modals.html',
  styleUrl: './signin-modals.scss',
})
export class SigninModalsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignUp = new EventEmitter<void>();

  auth = inject(AuthService);

  email = '';
  password = '';
  isLoading = signal(false);
  errorMsg = signal('');

  submit() {
    if (!this.email || !this.password) {
      this.errorMsg.set('Please fill in all fields.');
      return;
    }
    this.isLoading.set(true);
    this.errorMsg.set('');

    this.auth.signIn({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.close.emit();
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMsg.set('Invalid email or password.');
      }
    });
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
