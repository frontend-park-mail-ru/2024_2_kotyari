import { errorsDescriptions } from './errors.js';
import { templatize } from '../../../constprograms/templatizer/new-templatizer.js';

const returnPage = '/';

/**
 * Отображает страницу ошибки с указанным именем.
 *
 * Эта функция генерирует страницу ошибки на основе предоставленного имени.
 * Если имя присутствует в объекте `errorsDescriptions`, используется соответствующее описание ошибки.
 * В противном случае отображается ошибка 404 по умолчанию.
 *
 * @param {string} name - Имя ошибки для отображения.
 * @returns {Promise} Промис, который разрешается после успешного отображения страницы ошибки.
 */
export function errorPage(name) {
  let config = {
    name: name,
    description: errorsDescriptions[name],
    return: returnPage,
  };

  if (name in errorsDescriptions) {
    config = {
      name: name,
      description: errorsDescriptions[name],
      return: returnPage,
    };
  }

  return templatize(document.getElementById('main'), '/src/scripts/components/custom-messages/error/error.hbs', config);
}
