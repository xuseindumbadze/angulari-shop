import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UpdateUserRequest, ChangePasswordRequest } from '../../../models/auth.models';
import { TranslationService } from '../../../core/services/translation.service';

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
  translation = inject(TranslationService);

  activeTab = signal<ProfileTab>('info');

  editForm: UpdateUserRequest = {
    firstName: '', lastName: '', age: 0,
    address: '', phone: '', zipcode: '',
    gender: 'MALE', avatar: '',
  };

  passwordForm: ChangePasswordRequest = {
    oldPassword: '', newPassword: '', confirmPassword: '',
  };

  manualToken = '';
  showToken = signal(false);
  deleteConfirmText = '';
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

  setTab(tab: ProfileTab) { this.activeTab.set(tab); this.clearMessages(); }

  private populateEditForm() {
    const u = this.auth.currentUser();
    if (!u) return;
    this.editForm = {
      firstName: u.firstName, lastName: u.lastName, age: u.age,
      address: u.address, phone: u.phone, zipcode: u.zipcode,
      gender: u.gender, avatar: u.avatar,
    };
  }

  private clearMessages() { this.successMsg.set(''); this.errorMsg.set(''); }

  private showSuccess(msg: string) {
    this.successMsg.set(msg);
    this.errorMsg.set('');
    setTimeout(() => this.successMsg.set(''), 4000);
  }

  private showError(msg: string) { this.errorMsg.set(msg); this.successMsg.set(''); }

  saveProfile() {
    this.isUpdating.set(true);
    this.clearMessages();
    this.auth.updateProfile(this.editForm).subscribe({
      next: () => {
        this.isUpdating.set(false);
        this.showSuccess(this.translation.t('Profile updated successfully!'));
        this.setTab('info');
      },
      error: () => {
        this.isUpdating.set(false);
        this.showError(this.translation.t('Update failed. Please try again.'));
      },
    });
  }

  changePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.showError(this.translation.t('Passwords do not match.'));
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.showError(this.translation.t('Password must be at least 6 characters.'));
      return;
    }
    this.isChangingPw.set(true);
    this.clearMessages();
    this.auth.changePassword(this.passwordForm).subscribe({
      next: () => {
        this.isChangingPw.set(false);
        this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
        this.showSuccess(this.translation.t('Password changed successfully!'));
      },
      error: () => {
        this.isChangingPw.set(false);
        this.showError(this.translation.t('Password change failed. Check your old password.'));
      },
    });
  }

  get deleteReady(): boolean { return this.deleteConfirmText === 'DELETE'; }

  deleteAccount() {
    if (!this.deleteReady) return;
    this.isDeleting.set(true);
    this.auth.deleteAccount().subscribe({
      next: () => { this.isDeleting.set(false); this.router.navigate(['/']); },
      error: () => { this.isDeleting.set(false); this.showError(this.translation.t('Account deletion failed.')); },
    });
  }

  signOut() { this.auth.signOut().subscribe(); }
}
