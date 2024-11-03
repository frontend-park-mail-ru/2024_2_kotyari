import card from './card.hbs?raw';
import { rootId } from '@/services/app/config';
import Handlebars from 'handlebars';

export interface CardViewInterface {
  render(data: { products: any[], page_title?: string  }, title?: string): void;
}

export class CardView implements CardViewInterface {
  private readonly compiled: any;

  constructor() {
    this.compiled = Handlebars.compile(card);
  }

  render = (data: { products: any[], page_title?: string }, title?: string): void => {
    const rootElement = document.getElementById(rootId);
    if (!rootElement) {
      console.log(`ошибка rootElement ${rootElement} -- rootId ${rootId}`);
      return;
    }

    rootElement.innerHTML = '';
    const templateElement = document.createElement('div');
    data.page_title = 'Каталог'
    if (title !== '' && title != undefined) {
      data.page_title = 'Категория: ' + title;
    }
    templateElement.innerHTML = this.compiled(data);
    rootElement.appendChild(templateElement);
  };
}
