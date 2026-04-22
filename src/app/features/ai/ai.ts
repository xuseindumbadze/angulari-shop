import { Component, inject, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiService, AIMessage } from '../../../app/core/services/ai';
import { Services } from '../../../app/core/services/services';
import { CartService } from '../../../app/core/services/cart';
import { CompareService } from '../../../app/core/services/compire';
import { Product } from '../../../app/models/product.modals';
import { catchError, of } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  products?: Product[];
  loading?: boolean;
}

@Component({
  selector: 'app-ai-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai.html',
  styleUrl: './ai.scss',
})
export class AiChatComponent implements OnInit {
  private aiService = inject(AiService);
  private svc = inject(Services);
  private cartService = inject(CartService);
  compareService = inject(CompareService);
  private router = inject(Router);

  @ViewChild('messagesBox') messagesBox!: ElementRef;

  isOpen = signal(false);
  isLoading = signal(false);
  input = '';
  messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'გამარჯობა! 👋 მე ვარ TechBot — TechZone-ის AI კონსულტანტი. დაგეხმარები საუკეთესო ტექნიკის არჩევაში! რა გაინტერესებს? 😊'
    }
  ]);

  allProducts: Product[] = [];
  addingToCart: string | null = null;
  addedToCart: string | null = null;

  ngOnInit() {
    this.svc.productsAll().pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res) this.allProducts = res.products;
    });
  }

  toggle() {
    this.isOpen.update(v => !v);
  }

  async send() {
    const text = this.input.trim();
    if (!text || this.isLoading()) return;

    this.input = '';
    this.messages.update(m => [...m, { role: 'user', text }]);
    this.messages.update(m => [...m, { role: 'assistant', text: '', loading: true }]);
    this.isLoading.set(true);
    this.scrollToBottom();

    const history: AIMessage[] = this.messages()
      .filter(m => !m.loading && m.text)
      .map(m => ({ role: m.role, content: m.text }));

    this.aiService.chat(history, this.allProducts).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      this.isLoading.set(false);

      console.log('AI response:', res);

      if (!res || !res.content || !res.content[0]) {
        this.replaceLoading('შეცდომა მოხდა. სცადეთ თავიდან. 😔', []);
        return;
      }

      const fullText: string = res.content[0].text;
      const filterMatch = fullText.match(/FILTER_JSON:\s*(\{.*?\})/s);
      const displayText = fullText.replace(/FILTER_JSON:.*$/s, '').trim();

      let products: Product[] = [];
      if (filterMatch) {
        try {
          const parsed = JSON.parse(filterMatch[1]);
          if (parsed.ids?.length) {
            products = this.allProducts.filter(p => parsed.ids.includes(p._id));

            if (parsed.action === 'cart') {
              products.forEach(p => this.addToCart(p._id));
            } else if (parsed.action === 'compare') {
              products.forEach(p => this.compareService.add(p));
            }
          }
        } catch { }
      }

      this.replaceLoading(displayText, products);
      this.scrollToBottom();
    });
  }

  replaceLoading(text: string, products: Product[]) {
    this.messages.update(msgs => {
      const copy = [...msgs];
      let idx = -1;
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].loading) { idx = i; break; }
      }
      if (idx !== -1) copy[idx] = { role: 'assistant', text, products };
      return copy;
    });
  }

  addToCart(id: string) {
    this.addingToCart = id;
    this.cartService.addProduct(id).pipe(
      catchError(() => of(null))
    ).subscribe(() => {
      this.addingToCart = null;
      this.addedToCart = id;
      setTimeout(() => this.addedToCart = null, 2000);
    });
  }

  toggleCompare(product: Product) {
    this.compareService.has(product._id)
      ? this.compareService.remove(product._id)
      : this.compareService.add(product);
  }

  goToProduct(id: string) {
    this.router.navigate(['/product', id]);
    this.isOpen.set(false);
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesBox) {
        this.messagesBox.nativeElement.scrollTop = this.messagesBox.nativeElement.scrollHeight;
      }
    }, 50);
  }

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }
}
