import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  AuthUser,
  UpdateUserRequest,
  ChangePasswordRequest,
  RecoveryRequest,
  VerifyEmailRequest,
  RefreshResponse,
} from '../../models/auth.models';
import { tap, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private readonly BASE = 'https://api.everrest.educata.dev/auth';
  private readonly TOKEN_KEY = 'access_token';

  currentUser = signal<AuthUser | null>(null);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get token(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  // ─── Auth Core ────────────────────────────────────────────────────────────

  signUp(body: SignUpRequest) {
    return this.http.post<AuthResponse>(`${this.BASE}/sign_up`, body);
  }

  signIn(body: SignInRequest) {
    return this.http.post<AuthResponse>(`${this.BASE}/sign_in`, body).pipe(
      tap((res) => {
        if (this.isBrowser) localStorage.setItem(this.TOKEN_KEY, res.access_token);
        this.currentUser.set(res.user);
      })
    );
  }

  signOut() {
    return this.http.post(`${this.BASE}/sign_out`, {}).pipe(
      tap({
        next: () => this.clearSession(),
        error: () => this.clearSession(),
      })
    );
  }

  // ─── Token ────────────────────────────────────────────────────────────────

  setTokenManually(token: string) {
    if (this.isBrowser) localStorage.setItem(this.TOKEN_KEY, token);
  }

  refreshToken() {
    return this.http.get<RefreshResponse>(`${this.BASE}/refresh`).pipe(
      tap((res) => {
        if (this.isBrowser) localStorage.setItem(this.TOKEN_KEY, res.access_token);
      })
    );
  }

  // ─── Profile ──────────────────────────────────────────────────────────────

  getMe() {
    return this.http.get<AuthUser>(`${this.BASE}`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => of(null))
    );
  }

  getUserById(id: string) {
    return this.http.get<AuthUser>(`${this.BASE}/id/${id}`);
  }

  getAllUsers() {
    return this.http.get<AuthUser[]>(`${this.BASE}/all`);
  }

  updateProfile(body: UpdateUserRequest) {
    return this.http.patch<AuthUser>(`${this.BASE}/update`, body).pipe(
      tap((updated) => this.currentUser.set(updated))
    );
  }

  changePassword(body: ChangePasswordRequest) {
    return this.http.patch<void>(`${this.BASE}/change_password`, body);
  }

  deleteAccount() {
    return this.http.delete<void>(`${this.BASE}/delete`).pipe(
      tap(() => this.clearSession())
    );
  }

  // ─── Email & Recovery ─────────────────────────────────────────────────────

  verifyEmail(body: VerifyEmailRequest) {
    return this.http.post<void>(`${this.BASE}/verify_email`, body);
  }

  sendRecovery(body: RecoveryRequest) {
    return this.http.post<void>(`${this.BASE}/recovery`, body);
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private clearSession() {
    if (this.isBrowser) localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
}
