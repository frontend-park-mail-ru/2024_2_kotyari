export interface OrderProduct {
  id: number;
  image_url: string;
  title: string;
}

export interface Order {
  id: string;
  delivery_date: string;
  order_date: string;
  total_price: number;
  status: string;
  delivery_date_req: string;
  products: OrderProduct[];
}