import {handler, Router} from "../../../services/router/router.js";

/**
 * Обновляет интерфейс после выхода пользователя из системы.
 *
 * Заменяет содержимое элементов с идентификаторами 'avatar' и 'name',
 * показывая ссылки на вход и регистрацию. Затем перенаправляет на страницу авторизации без перезагрузки страницы.
 *
 * @function
 */
export function logoutUpdate() {
    document.getElementById('avatar').innerHTML = `<a href="/login" router="stability-active" class="catalog-link">Вход</a>
                        <a href="/signup" router="stability-active" class="catalog-link">Регистрация</a>`;
    document.getElementById('name').innerHTML = `<span class="icon-label-hidden catalog-link" id="name">Аватар</span>`;

    // Переходим на страницу авторизации без перезагрузки
    Router.navigate('/');
}

/**
 * Обновляет интерфейс после входа пользователя в систему.
 *
 * Заменяет содержимое элементов с идентификаторами 'avatar' и 'name', показывая ссылки на личный кабинет и выход.
 * Также добавляет обработчик на кнопку выхода и перенаправляет на страницу без перезагрузки.
 *
 * @function
 * @param {string} name - Имя пользователя для отображения в интерфейсе.
 */
export function signInUpdate(name) {
    document.getElementById('avatar').innerHTML = `<a href="#" router="stability-active" class="catalog-link">Личный кабинет</a>
                        <a href="/logout" router="stability-active" id="logout" class="catalog-link">Выход</a>`;
    document.getElementById('name').innerHTML = `<span class="icon-label-hidden catalog-link" id="name">${name}</span>`;

    document.getElementById('logout').onclick = handler;

    // Переходим на страницу авторизации без перезагрузки
    Router.navigate('/');
}
