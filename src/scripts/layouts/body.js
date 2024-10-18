import { TemplateManager } from '../constprograms/templatizer/templatizer.js';

/**
 * Функция для рендеринга основного содержимого страницы.
 *
 * Использует функцию `templatize` для вставки шаблона в элемент body на странице.
 *
 * @function
 * @param {Object} data - Данные, которые будут переданы в шаблон для рендеринга.
 * @returns {Promise<void>} Возвращает промис, который разрешается после завершения рендеринга.
 */
export function buildBody(data) {
  return TemplateManager.templatize(document.body, '/src/scripts/layouts/body.hbs', data)
    .then(() => {
      console.log('успешно');
    })
    .catch((err) => {
      console.log(err);
    });
}
