import card from './card.hbs?raw';
import { contentRenderId } from '@/services/app/config';
import Handlebars from 'handlebars';

export interface CardViewInterface {
  render(data: { products: any[] }): void;
}

export class CardView implements CardViewInterface {
  private readonly compiled: any;

  constructor() {
    this.compiled = Handlebars.compile(card);
  }

  private _render = (data: { products: any[] }): void => {
    const rootElement = document.getElementById(contentRenderId);
    if (!rootElement) {
      console.log(`ошибка rooElement ${rootElement} -- rootId ${contentRenderId}`);
      return;
    }

    console.log('123', data);

    rootElement.innerHTML = '';
    const templateElement = document.createElement('div');
    templateElement.innerHTML = this.compiled(data);
    rootElement.appendChild(templateElement);
  };

  render = (data: { products: any[] }): void => {
    this._render(data);
  };
}
