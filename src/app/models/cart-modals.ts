export interface CartProduct {
  quantity: number;
  pricePerQuantity: number;
  beforeDiscountPrice: number;
  productId: string;
}

export interface CartTotal {
  price: {
    current: number;
    beforeDiscount: number;
  };
  quantity: number;
  products: number;
}

export interface Cart {
  _id: string;
  userId: string;
  createdAt: string;
  products: CartProduct[];
  total: CartTotal;
}
