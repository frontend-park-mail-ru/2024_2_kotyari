import { TemplateManager } from '../../constprograms/templatizer/templatizer.js';

const orderListTemplateURL = '/src/scripts/components/order-list/order-list.hbs';

/**
 * Функция для рендеринга списка заказов.
 *
 * @async
 * @param {Object} data - Данные для рендеринга списка заказов.
 */
export async function buildOrderList(data:any):Promise<void> {
  const main = document.getElementById('main') as HTMLElement;
  if (main)
    return TemplateManager.templatize(main, orderListTemplateURL, data).finally();

  return Promise.resolve().finally();
}
