
export interface Price {
  current: number;
  currency: string;
  beforeDiscount: number;
  discountPercentage: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  brand: string;
  rating: number;
  stock: number;
  warranty: number;
  issueDate: string;
  price: Price;
  category: Category;
}


export interface ProductsResponse {
  total: number;
  limit: number;
  page: number;
  skip: number;
  products: Product[];
}
