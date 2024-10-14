import { templatize } from '../constprograms/templatizer/templatizer.js';
import { logoutUpdate } from './header/header.js';
import { backurl } from '../../services/router/settings.js';
import { deleteCookie } from '../../services/storages/cookie.js';
import { Router } from '../../services/router/router.js';

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
  return templatize(document.body, '/src/scripts/layouts/body.hbs', data);
}

