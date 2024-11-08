import Handlebars from 'handlebars';
import singleOrderTemplate from './single-order.hbs';
import { SingleOrder } from '../types/types';
import { router } from '../../../../services/app/init';

export class SingleOrderView {
  private readonly rootId: string;
  private readonly compiledTemplate: HandlebarsTemplateDelegate;
  private rootElement: HTMLElement | null;

  constructor(rootId:string) {
    this.rootId = rootId;
    this.compiledTemplate = Handlebars.compile(singleOrderTemplate);
    this.setupListeners();
  }

  public render(data: SingleOrder) {
    this.rootElement = document.getElementById(this.rootId);

    if (!this.rootElement) {
      console.error(`Root element with id ${this.rootId} not found`);
      return;
    }

    this.rootElement.innerHTML = this.compiledTemplate(data);
  }

  private setupListeners() {
    this.rootElement = document.getElementById(this.rootId);
    if (!this.rootElement){
      console.error(this.rootElement, 'not found');
      return;
    }

    const orderElements = this.rootElement.querySelectorAll('.order__details__item');
    orderElements.forEach(orderElement => {
      orderElement.addEventListener('click', (event) => {
        event.preventDefault();
        const productId = orderElement.getAttribute('data-product-id');

        if (productId) {
          router.navigate(`/product/${productId}`);
        } else {
          console.error('Product ID не найден');
        }
      });
    });
  }
}