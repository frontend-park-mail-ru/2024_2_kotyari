
/**
 * Обновляет интерфейс после выхода пользователя из системы.
 *
 * Заменяет содержимое элементов с идентификаторами 'avatar' и 'name',
 * показывая ссылки на вход и регистрацию. Затем перенаправляет на страницу авторизации без перезагрузки страницы.
 *
 * @function
 */
export function logoutUpdate() {
  document.getElementById('avatar').innerHTML =
    `<a href="/login" router="stability-active" class="catalog-link">Вход</a>
     <a href="/signup" router="stability-active" class="catalog-link">Регистрация</a>`;
  document.getElementById('name').innerHTML = '<span class="icon-label-hidden catalog-link" id="name">Вход</span>';
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
  document.getElementById('avatar').innerHTML =
    `<a href="#" router="stability-active" class="catalog-link">Личный кабинет</a>
    <a href="/logout" router="stability-active" id="logout" class="catalog-link">Выход</a>`;
  document.getElementById('name').innerHTML = `<span class="icon-label-hidden catalog-link" id="name">${name}</span>`;
}

/**
 * Добавляет функциональность выпадающего меню для иконки аватара.
 *
 * Функция обеспечивает открытие/закрытие выпадающего меню при клике на иконку аватара,
 * скрытие меню при клике вне области меню, а также добавляет задержку перед скрытием меню
 * при наведении курсора мыши вне иконки.
 *
 * Функциональность:
 * - Выпадающее меню открывается и закрывается по клику на иконку аватара.
 * - Когда меню открыто, надпись под иконкой (label) скрывается.
 * - Меню закрывается при клике вне иконки или меню.
 * - Закрытие меню с небольшой задержкой при уходе курсора с иконки.
 *
 * @function AddDropDown
 *
 * @example
 * // Пример использования
 * document.addEventListener("DOMContentLoaded", function() {
 *   AddDropDown();
 * });
 */
export function AddDropDown() {
  const avatarIcon = document.getElementById('avatar-icon');
  const dropdown = avatarIcon.querySelector('.icon-dropdown');

  // Открытие и закрытие по клику
  avatarIcon.addEventListener('click', function (event) {
    dropdown.classList.toggle('show');
    avatarIcon.classList.toggle('show'); // Добавляем или убираем класс для иконки
    event.stopPropagation();
  });

  // Закрытие при клике вне элемента
  document.addEventListener('click', function () {
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
      avatarIcon.classList.remove('show'); // Убираем класс для иконки
    }
  });

  // Оставляем задержку перед скрытием при наведении
  avatarIcon.addEventListener('mouseleave', function () {
    setTimeout(() => {
      if (!dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        avatarIcon.classList.remove('show'); // Убираем класс для иконки
      }
    }, 500); // Задержка исчезновения
  });
}
