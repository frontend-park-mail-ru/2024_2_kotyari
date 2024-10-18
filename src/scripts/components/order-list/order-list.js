import {TemplateManager} from "/dist/scripts/constprograms/templatizer/templatize.js";

const orderListTemplateURL = 'src/scripts/components/order-list/order-list.hbs';

/**
 * Функция для рендеринга списка заказов.
 *
 * @async
 * @param {Object} data - Данные для рендеринга списка заказов.
 */
export async function buildOrderList(data) {
  return TemplateManager.templatize(document.getElementById('main'), orderListTemplateURL, data);
}
