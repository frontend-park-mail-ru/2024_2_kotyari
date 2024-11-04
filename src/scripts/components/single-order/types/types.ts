export interface Product {
  id: number;
  cost: number;
  name: string;
  count: number;
  image_url: string;
}

export interface SingleOrder {
  id: string;
  recipient: string;
  order_status: string;
  delivery_date: string;
  address: string;
  totalItems: number;
  totalPrice: number;
  products: Product[]
}