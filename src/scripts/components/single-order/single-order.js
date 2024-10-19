import { templatize } from '../../constprograms/templatizer/templatizer.js';

const singleOrderTemplateURL = 'src/scripts/components/single-order/single-order.hbs';

/**
 * Функция для рендеринга страницы одного заказа.
 *
 * @async
 * @param {Object} data - Данные для рендеринга страницы заказа.
 */
export async function buildSingleOrderPage(data) {
  return templatize(document.getElementById('main'), singleOrderTemplateURL, data);
}
