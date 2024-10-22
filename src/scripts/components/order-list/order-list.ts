import orders from './order-list.hbs?raw';
import { contentRenderId } from '../../../services/app/config';
import Handlebars from 'handlebars';

const compiled = Handlebars.compile(orders);
/**
 * Функция для рендеринга списка заказов.
 *
 * @async
 * @param {Object} data - Данные для рендеринга списка заказов.
 */
export async function buildOrderList(data) {
  const rootElement = document.getElementById(contentRenderId) as HTMLElement;
  if (!rootElement) {
    console.error(`Элемент root ${contentRenderId} -- ${rootElement}`);
  }

  rootElement.innerHTML = '';
  const templateElement = document.createElement('div');
  templateElement.innerHTML = compiled(data);
  rootElement.appendChild(templateElement);
}
