import Handlebars from 'handlebars';
import searchMenu from './searcher.hbs?raw';
import { rootId } from '../../../../services/app/config';
import { Product } from '../../card/api/card';
import { CardViewInterface } from '../../card/view/card';

export interface SearcherViewInterface {
  render(): void;

  renderProducts(data: { products: Product[] }, query: string): void;

  displaySuggestions(suggestions: Array<any>): void;
}

export class SearcherView implements SearcherViewInterface {
  private firstRender:boolean = true;
  private compiled: any;
  private readonly cardView: CardViewInterface;

  constructor(cardView: CardViewInterface) {
    this.cardView = cardView;
  }

  public render = () => {
    if (this.firstRender) {
      this.firstRender = false;
      this.compiled = Handlebars.compile(searchMenu);
    }

    const rootElement = document.getElementById(rootId);
    if (!rootElement) {
      return console.error(`Элемент ID =  ${rootId} не найден`);
    }

    rootElement.innerHTML = '';
    const templateElement = document.createElement('div');
    templateElement.innerHTML = this.compiled();
    rootElement.appendChild(templateElement);
  }

  public renderProducts = (data: { products: Product[] , page_title?: string}, query: string) => {

    data.page_title = 'Результаты поиска: '

    this.cardView.render(data, query);
  };

  displaySuggestions = (suggestions: Array<any>) => {
    const suggestionsList = document.getElementById('suggestions') as HTMLUListElement;

    if (!suggestionsList) return;

    suggestionsList.innerHTML = '';
    suggestionsList.classList.add('suggestions--active');

    suggestions.slice(0, 7).forEach(item => {
      const li = document.createElement('li');
      li.classList.add('suggestions__item');

      const link = document.createElement('a');
      link.textContent = item;
      link.classList.add('suggestions__item--link')

      const param = new URLSearchParams({ q: item });
      link.setAttribute('href', `/search/catalog?${param.toString()}`);
      link.setAttribute('router', 'changed-active');

      li.appendChild(link);
      suggestionsList.appendChild(li);
    });
  };
}