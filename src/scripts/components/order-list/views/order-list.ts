import Handlebars from 'handlebars';
import orderListTemplate from './order-list.hbs'
import { Order } from '../types/types';
import { router } from '../../../../services/app/init';

export class OrderListView {
  private readonly rootId: string;
  private readonly compiledTemplate: HandlebarsTemplateDelegate;
  private rootElement: HTMLElement | null;

  constructor(rootId:string) {
    this.rootId = rootId;

    this.compiledTemplate = Handlebars.compile(orderListTemplate);
  }

  public render(data: Order[]) {
    this.rootElement = document.getElementById(this.rootId);
    if (!this.rootElement) {
      // console.error(`Root element with id ${this.rootId} not found`);
      return;
    }

    this.rootElement.innerHTML = this.compiledTemplate({ orders: data });
  }
}