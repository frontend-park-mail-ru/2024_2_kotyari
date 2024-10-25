import { errorsDescriptions } from './errors.js';
import { rootId } from '../../../../services/app/config';
import errorTmp from './error.hbs?raw';
import Handlebars from 'handlebars';

const returnPage = '/catalog';
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
export function errorPage(name: string): void {
  let config = {
    name: name,
    description: errorsDescriptions[name],
    return: returnPage,
  };

  const compiled = Handlebars.compile(errorTmp);

  console.log(config);

  const rootElement = document.getElementById(rootId) as HTMLElement;
  if (!rootElement) {
    console.error(`Element ID = ${rootId} not found`);
  }

  rootElement.innerHTML = '';
  const templateElement = document.createElement('div');
  templateElement.innerHTML = compiled(config);
  rootElement.appendChild(templateElement);
}
