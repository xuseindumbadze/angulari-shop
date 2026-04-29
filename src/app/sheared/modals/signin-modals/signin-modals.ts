import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

export type SignInMode = 'credentials' | 'token';

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

  activeMode = signal<SignInMode>('credentials');

  email = '';
  password = '';
  manualToken = '';

  isLoading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

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
      },
    });
  }

  loginWithToken() {
    const token = this.manualToken.trim();
    if (!token) {
      this.errorMsg.set('ტოკენი ცარიელია.');
      return;
    }
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.auth.setTokenManually(token);
    this.auth.getMe().subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (user) {
          this.successMsg.set(`მოგესალმებით, ${user.firstName}!`);
          setTimeout(() => this.close.emit(), 1200);
        } else {
          this.auth.setTokenManually('');
          this.errorMsg.set('ტოკენი არასწორია ან ვადაგასულია.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.auth.setTokenManually('');
        this.errorMsg.set('ტოკენი არასწორია ან ვადაგასულია.');
      },
    });
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
