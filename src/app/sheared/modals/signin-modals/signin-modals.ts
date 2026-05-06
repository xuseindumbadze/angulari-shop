import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { TranslationService } from '../../../core/services/translation.service';

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
  translation = inject(TranslationService);

  activeMode = signal<SignInMode>('credentials');

  email = '';
  password = '';
  manualToken = '';

  isLoading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  submit() {
    if (!this.email || !this.password) {
      this.errorMsg.set(this.translation.t('Please fill in all fields.'));
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
        this.errorMsg.set(this.translation.t('Invalid email or password.'));
      },
    });
  }

  loginWithToken() {
    const token = this.manualToken.trim();
    if (!token) {
      this.errorMsg.set(this.translation.t('Token is empty.'));
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
          this.successMsg.set(`${this.translation.t('Welcome')}, ${user.firstName}!`);
          setTimeout(() => this.close.emit(), 1200);
        } else {
          this.auth.setTokenManually('');
          this.errorMsg.set(this.translation.t('Token is invalid or expired.'));
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.auth.setTokenManually('');
        this.errorMsg.set(this.translation.t('Token is invalid or expired.'));
      },
    });
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
