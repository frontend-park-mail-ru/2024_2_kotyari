import {TemplateManager} from "/dist/scripts/constprograms/templatizer/templatize.js";
import {logoutUpdate} from "./header/header.js";
import {backurl} from "../../services/router/settings.js";
import {deleteCookie} from "../../services/cookie/cookie.js";
import {Router} from "../../services/router/router.js";

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
    return TemplateManager.templatize(document.body, '/src/scripts/layouts/body.hbs', data);
}

/**
 * Обрабатывает процесс выхода пользователя из системы.
 *
 * Отправляет POST-запрос на сервер для выполнения выхода, удаляет cookie пользователя,
 * перенаправляет на главную страницу и вызывает обновление интерфейса.
 *
 * @async
 * @function
 * @returns {Promise<void>} Возвращает промис, который разрешается после выполнения операции выхода.
 */
export async function handleLogout() {
  try {
    const response = await fetch(backurl + 'logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      Router.navigate('/'); // Перенаправление на главную страницу при успешном выходе
    } else {
      alert('Не удалось выполнить выход. Попробуйте снова.');
    }
  } catch (error) {
    console.log(error);
  }

  deleteCookie('user'); // Удаление cookie с именем 'user'

  logoutUpdate(); // Обновление интерфейса после выхода
}
