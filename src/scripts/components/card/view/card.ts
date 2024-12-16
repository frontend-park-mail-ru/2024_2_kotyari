import card from './card.hbs?raw';
import { rootId } from '@/services/app/config';
import Handlebars from 'handlebars';
import {b} from "vite/dist/node/types.d-aGj9QkWt";

export interface CardViewInterface {
  render(data: { products: any[], page_title?: string  }, title?: string, newRootId?: string, sorting?: boolean, flag?: boolean, url?: string): void;
}

export class CardView implements CardViewInterface {
  private readonly compiled: any;

  constructor() {
    this.compiled = Handlebars.compile(card);
  }

  render = (data: { products: any[], page_title?: string }, title?: string, newRootId: string = rootId, sorting: boolean = true, flag: boolean = false, url: string = ''): void => {

    data.sorting = sorting;

    const rootElement = document.getElementById(newRootId);

    if (!rootElement) {
      return;
    }

    rootElement.innerHTML = '';

    const templateElement = document.createElement('div');

    if (data.page_title!= undefined ) {
      data.page_title += title;
    }else {
      data.page_title = 'Каталог';
    }

    templateElement.innerHTML = this.compiled(data);
    rootElement.appendChild(templateElement);

    if (flag) {
      this.initButton(flag, url);
    }
  };

  initButton = (flag: boolean, url: string) => {
    const button = document.getElementById('show-more')

    if (flag && button) {
      button.setAttribute('href', url);
      button.setAttribute('router', 'changed-active');
    }
  };
}
