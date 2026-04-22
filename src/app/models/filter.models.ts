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
