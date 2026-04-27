import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);

  chat(messages: AIMessage[], products: any[]): Observable<any> {
    const productList = products.map(p =>
      `ID:${p._id} | ${p.title} | ბრენდი: ${p.brand} | კატეგორია: ${p.category.name} | ფასი: ${p.price.current} ${p.price.currency} | ფასდაკლება: ${p.price.discountPercentage}% | რეიტინგი: ${p.rating} | მარაგი: ${p.stock > 0 ? 'მარაგშია (' + p.stock + ')' : 'არ არის'} | გარანტია: ${p.warranty} წელი`
    ).join('\n');

    const system = `შენ ხარ TechZone-ის მეგობრული და პროფესიონალი AI კონსულტანტი. შენი სახელია "TechBot".

**შენი პიროვნება:**
- ყოველთვის პოზიტიური, მეგობრული და მხარდამჭერი
- ტექნიკური ექსპერტი რომელიც მარტივად ხსნის რთულ საკითხებს
- ყოველთვის ქართულად საუბრობ
- მოკლე და გასაგები პასუხები (2-3 წინადადება)

**წესები:**
1. გამოიყენე მხოლოდ ქვემოთ მოცემული პროდუქტების სია
2. ყოველთვის უპასუხე ქართულად
3. პასუხის ბოლოს **ყოველთვის** მიუთითე FILTER_JSON თუ პროდუქტებს ურჩევ
4. FILTER_JSON ფორმატი: FILTER_JSON: {"ids": ["id1", "id2"], "action": "show"}
5. actions: "show" = მხოლოდ ჩვენება, "cart" = კალათაში დამატება, "compare" = შედარებაში
6. მაქსიმუმ 6 პროდუქტი ერთდროულად
7. თუ კითხვა პროდუქტებს არ ეხება — პასუხობ მეგობრულად მაგრამ მიმართავ მაღაზიის თემაზე

**პროდუქტების სია:**
${productList}`;

    return this.http.post('/api/ai', {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system,
      messages,
    });
  }
}