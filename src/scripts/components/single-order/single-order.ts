import order from './single-order.hbs?raw';
import { contentRenderId } from '../../../services/app/config';
import Handlebars from 'handlebars';

const compiled = Handlebars.compile(order);

/**
 * Функция для рендеринга страницы одного заказа.
 *
 * @async
 * @param {Object} data - Данные для рендеринга страницы заказа.
 */
export const buildSingleOrderPage = (data: any): void => {
  const rootElement = document.getElementById(contentRenderId) as HTMLElement;
  if (!rootElement) {
    console.error(`Элемент root ${contentRenderId} -- ${rootElement}`);
  }

  rootElement.innerHTML = '';
  const templateElement = document.createElement('div');
  templateElement.innerHTML = compiled(data);
  rootElement.appendChild(templateElement);
};
