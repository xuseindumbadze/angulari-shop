import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UpdateUserRequest, ChangePasswordRequest } from '../../../models/auth.models';

export type ProfileTab = 'info' | 'edit' | 'password' | 'token' | 'danger';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);

  activeTab = signal<ProfileTab>('info');

  // ─── Edit Form ────────────────────────────────────────────────────────────
  editForm: UpdateUserRequest = {
    firstName: '',
    lastName: '',
    age: 0,
    address: '',
    phone: '',
    zipcode: '',
    gender: 'MALE',
    avatar: '',
  };

  // ─── Password Form ────────────────────────────────────────────────────────
  passwordForm: ChangePasswordRequest = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  // ─── Token ────────────────────────────────────────────────────────────────
  manualToken = '';
  showToken = signal(false);

  // ─── Danger ───────────────────────────────────────────────────────────────
  deleteConfirmText = '';

  // ─── UI State ─────────────────────────────────────────────────────────────
  isUpdating = signal(false);
  isChangingPw = signal(false);
  isDeleting = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  ngOnInit() {
    if (!this.auth.currentUser()) {
      this.auth.getMe().subscribe(() => this.populateEditForm());
    } else {
      this.populateEditForm();
    }
  }

  setTab(tab: ProfileTab) {
    this.activeTab.set(tab);
    this.clearMessages();
  }

  private populateEditForm() {
    const u = this.auth.currentUser();
    if (!u) return;
    this.editForm = {
      firstName: u.firstName,
      lastName: u.lastName,
      age: u.age,
      address: u.address,
      phone: u.phone,
      zipcode: u.zipcode,
      gender: u.gender,
      avatar: u.avatar,
    };
  }

  private clearMessages() {
    this.successMsg.set('');
    this.errorMsg.set('');
  }

  private showSuccess(msg: string) {
    this.successMsg.set(msg);
    this.errorMsg.set('');
    setTimeout(() => this.successMsg.set(''), 4000);
  }

  private showError(msg: string) {
    this.errorMsg.set(msg);
    this.successMsg.set('');
  }

  // ─── Update Profile ───────────────────────────────────────────────────────

  saveProfile() {
    this.isUpdating.set(true);
    this.clearMessages();
    this.auth.updateProfile(this.editForm).subscribe({
      next: () => {
        this.isUpdating.set(false);
        this.showSuccess('პროფილი წარმატებით განახლდა!');
        this.setTab('info');
      },
      error: () => {
        this.isUpdating.set(false);
        this.showError('განახლება ვერ მოხერხდა. სცადეთ თავიდან.');
      },
    });
  }

  // ─── Change Password ──────────────────────────────────────────────────────

  changePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.showError('ახალი პაროლები არ ემთხვევა.');
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.showError('პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს.');
      return;
    }
    this.isChangingPw.set(true);
    this.clearMessages();
    this.auth.changePassword(this.passwordForm).subscribe({
      next: () => {
        this.isChangingPw.set(false);
        this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
        this.showSuccess('პაროლი წარმატებით შეიცვალა!');
      },
      error: () => {
        this.isChangingPw.set(false);
        this.showError('პაროლის შეცვლა ვერ მოხერხდა. შეამოწმეთ ძველი პაროლი.');
      },
    });
  }

  // ─── Token ────────────────────────────────────────────────────────────────

  get currentToken(): string {
    return this.auth.token ?? '';
  }

  copyToken() {
    navigator.clipboard.writeText(this.currentToken).then(() => {
      this.showSuccess('ტოკენი კოპირებულია!');
    });
  }

  applyManualToken() {
    if (!this.manualToken.trim()) {
      this.showError('ტოკენი ცარიელია.');
      return;
    }
    this.auth.setTokenManually(this.manualToken.trim());
    this.auth.getMe().subscribe({
      next: (user) => {
        if (user) {
          this.showSuccess('ტოკენი გამოყენებულია, პროფილი განახლდა!');
          this.manualToken = '';
        } else {
          this.showError('ტოკენი არასწორია ან ვადაგასულია.');
        }
      },
      error: () => this.showError('ტოკენი არასწორია ან ვადაგასულია.'),
    });
  }

  refreshToken() {
    this.auth.refreshToken().subscribe({
      next: () => this.showSuccess('ტოკენი განახლდა!'),
      error: () => this.showError('ტოკენის განახლება ვერ მოხერხდა.'),
    });
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  get deleteReady(): boolean {
    return this.deleteConfirmText === 'DELETE';
  }

  deleteAccount() {
    if (!this.deleteReady) return;
    this.isDeleting.set(true);
    this.auth.deleteAccount().subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.isDeleting.set(false);
        this.showError('ანგარიშის წაშლა ვერ მოხერხდა.');
      },
    });
  }

  signOut() {
    this.auth.signOut().subscribe();
  }
}
