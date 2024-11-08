import { CARD_URLS } from './config.js';
import { get } from '../../../../services/api/without-csrf';

interface Response {
  status: number;
  body: Product[] | ResponseErr;
}

interface ResponseErr {
  error_message: string;
}

interface Product {
  id: number;
  description: string;
  count: number;
  name: string;
  price: number;
  original_price: number;
  discount: number;
  rating: number;
  image_url: string;
}

export interface CardApiInterface {
  fetchCards(): Promise<Product[]>;
}

export default class CardAPI implements CardApiInterface {
  private backUrl: string;
  private config = CARD_URLS;

  constructor(backUrl: string) {
    this.backUrl = backUrl;
  }

  fetchCards(): Promise<Product[]> {
    return get(this.backUrl + this.config.CATALOG.route)
      .then(response => {
        if (response.status === 200) {
          return response.body as Product[];
        }

        throw new Error(`Ошибка при получении карточек ${response.status} - ${response.body.error_message}`);
      })
  }
}
