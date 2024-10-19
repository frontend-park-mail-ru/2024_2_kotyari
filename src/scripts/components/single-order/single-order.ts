import { TemplateManager} from '../../constprograms/templatizer/templatizer.js';

const singleOrderTemplateURL = 'src/scripts/components/single-order/single-order.hbs';

/**
 * Функция для рендеринга страницы одного заказа.
 *
 * @async
 * @param {Object} data - Данные для рендеринга страницы заказа.
 */
export async function buildSingleOrderPage(data:any) : Promise<void> {
  const main = document.getElementById('main') as HTMLElement;
  if (main)
    return TemplateManager.templatize(main, singleOrderTemplateURL, data).finally();

  return Promise.reject().finally();
}
