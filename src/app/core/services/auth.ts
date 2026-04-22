import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignUpRequest, SignInRequest, AuthResponse, AuthUser } from '../../models/auth.models';
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
        next: () => {
          if (this.isBrowser) localStorage.removeItem(this.TOKEN_KEY);
          this.currentUser.set(null);
          this.router.navigate(['/']);
        },
        error: () => {
          if (this.isBrowser) localStorage.removeItem(this.TOKEN_KEY);
          this.currentUser.set(null);
          this.router.navigate(['/']);
        }
      })
    );
  }

  getMe() {
    return this.http.get<AuthUser>(`${this.BASE}`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => of(null))
    );
  }
}
