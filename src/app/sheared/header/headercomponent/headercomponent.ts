import { Component, inject, OnInit, signal, HostListener, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { SearchService } from '../../../core/services/search';
import { Product } from '../../../models/product.modals';
import { SigninModalsComponent } from '../../modals/signin-modals/signin-modals';
import { SignupModalsComponent } from '../../modals/signup-modals/signup-modals';
import { CompareService } from '../../../core/services/compire';

@Component({
  selector: 'app-headercomponent',
  imports: [CommonModule, FormsModule, RouterLink, SigninModalsComponent, SignupModalsComponent],
  templateUrl: './headercomponent.html',
  styleUrl: './headercomponent.scss',
})
export class Headercomponent implements OnInit {
  auth = inject(AuthService);
  searchService = inject(SearchService);
  router = inject(Router);
  elRef = inject(ElementRef);



  compareService = inject(CompareService);
  searchQuery = '';
  searchResults = signal<Product[]>([]);
  showResults = signal(false);
  menuOpen = signal(false);
  showSignIn = signal(false);
  showSignUp = signal(false);

  private search$ = new Subject<string>();
  private isFirstClick = true;

  ngOnInit() {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => q.length >= 3 ? this.searchService.search(q) : of(null))
    ).subscribe(res => {
      const products = res ? res.products : [];
      this.searchResults.set(products);
      this.showResults.set(products.length > 0);
    });

    if (this.auth.token) {
      this.auth.getMe().subscribe();
    }
  }

  onSearch(value: string) {
    this.searchQuery = value;
    if (value.length < 3) this.showResults.set(false);
    this.search$.next(value);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults.set([]);
    this.showResults.set(false);
  }

  goToProduct(id: string) {
    this.router.navigate(['/product', id]);
    this.clearSearch();
  }

  goToProfile() { this.router.navigate(['/profile']); }
  goToCart() { this.router.navigate(['/cart']); }
  signOut() { this.auth.signOut().subscribe(); }
  toggleMenu() { this.menuOpen.update(v => !v); }

  openSignIn() {
    this.showSignIn.set(true);
    this.showSignUp.set(false);
    this.menuOpen.set(false);
  }

  openSignUp() {
    this.showSignUp.set(true);
    this.showSignIn.set(false);
    this.menuOpen.set(false);
  }

  closeModals() {
    this.showSignIn.set(false);
    this.showSignUp.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(e: Event) {
    if (this.isFirstClick) { this.isFirstClick = false; return; }
    const target = e.target as HTMLElement;
    if (this.elRef && !this.elRef.nativeElement.contains(target)) {
      this.showResults.set(false);
      this.menuOpen.set(false);
    }
  }
}
