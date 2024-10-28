import { CARD_URLS } from './config.js';

export interface CardApiInterface {
  fetchCards(): Promise<any>;
}

export default class CardAPI implements CardApiInterface {
  private backUrl: string;
  private config = CARD_URLS;

  constructor(backUrl: string) {
    this.backUrl = backUrl;
  }

  fetchCards(): Promise<any> {
    return fetch(this.backUrl + this.config.CATALOG.route, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при получении карточек');
        }
        return res.json();
      })
      .catch((err) => {
        console.error('Ошибка при запросе:', err.message);
        throw err;
      });
  }
}
