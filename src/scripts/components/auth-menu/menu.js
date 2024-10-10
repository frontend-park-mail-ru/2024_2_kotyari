import { templatize } from "../../constprograms/templatizer/templatizer.js";

const tmpURL = 'src/scripts/components/auth-menu/menu.hbs';

/**
 * Функция для переключения типа поля ввода пароля и состояния иконки.
 *
 * @param {Event} event - Событие клика по иконке для переключения пароля.
 */
function togglePassword(event) {
    const icon = event.currentTarget;
    const fieldId = icon.getAttribute('data-field-id');
    const passwordInput = document.getElementById(fieldId);

    // Переключаем тип input (password <-> text)
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Меняем класс иконки (добавляем или убираем зачеркивание)
    if (type === 'text') {
        icon.classList.remove('eye-open');
        icon.classList.add('eye-closed');
    } else {
        icon.classList.remove('eye-closed');
        icon.classList.add('eye-open');
    }
}

/**
 * Функция для построения меню авторизации с динамическим рендерингом данных
 * и установкой обработчиков событий для переключения видимости пароля.
 *
 * @async
 * @function
 * @param {Object} data - Данные для рендеринга шаблона меню авторизации.
 * @returns {Promise<void>} Возвращает промис, который разрешается после рендеринга и назначения обработчиков событий.
 *
 * Пример использования:
 *
 * ```js
 * buildAuthMenu({ userName: 'John Doe', isLoggedIn: true });
 * ```
 */
export async function buildAuthMenu(data) {
    return templatize(document.getElementById('main'), tmpURL, data).then(() => {
        // Назначаем обработчик события для всех иконок с классом 'toggle-password'
        document.querySelectorAll('.toggle-password').forEach(item => {
            item.addEventListener('click', togglePassword);
        });
    });
}
