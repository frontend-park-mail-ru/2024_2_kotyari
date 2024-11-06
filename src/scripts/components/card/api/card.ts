import { CARD_URLS } from './config.js';

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
    return fetch(this.backUrl + this.config.CATALOG.route, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Ошибка при получении карточек');
        }

        return res.json();
      })
      .then(data => {
        if (data.status === 200) {
          console.log('1123124',data.body)
          return data.body;
        } else {
          throw new Error('Непредвиденный статус ответа');
        }
      })
      .catch(err => {
        console.error('Ошибка при запросе:', err.message);
        throw err;
      });
  }
}
