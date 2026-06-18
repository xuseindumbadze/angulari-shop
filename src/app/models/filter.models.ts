// ─── Server-side /search query parameters (EverREST Swagger contract) ──────────
// GET https://api.everrest.educata.dev/shop/products/search
// მხარს უჭერს ფილტრს + დახარისხებას + პაგინაციას ერთდროულად სერვერის მხარეს.

export type ProductSortBy = 'price' | 'rating' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface ProductSearchParams {
  page_index: number;
  page_size: number;
  keywords?: string;
  category_id?: string;
  brand?: string;
  rating?: number;
  price_min?: number;
  price_max?: number;
  // sort_by და sort_direction ურთიერთდამოკიდებულია — იგზავნება ერთად ან საერთოდ არა.
  sort_by?: ProductSortBy;
  sort_direction?: SortDirection;
}

// ─── ძველი მოდელები (შენარჩუნებულია თავსებადობისთვის) ─────────────────────────
export interface FilterParams {
  page_index: number;
  page_size: number;
  keywords?: string;
  category_id?: string;
  brand?: string;
  rating?: number;
  price_min?: number;
  price_max?: number;
}

export interface CategoryModel {
  id: string;
  name: string;
  image: string;
}

export interface BrandModel {
  name: string;
}
