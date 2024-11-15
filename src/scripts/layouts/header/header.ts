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
 *   handleHeaderScroll();
 * });
 */
export function AddDropDown(): void {
  const avatarIcon = document.getElementById('avatar-icon') as HTMLElement | null;
  if (!avatarIcon) return;

  const dropdown = avatarIcon.querySelector('.icon-dropdown') as HTMLElement | null;
  if (!dropdown) return;

  // Открытие и закрытие по клику
  avatarIcon.addEventListener('click', async function (event) {
    await new Promise((resolve) => {
      dropdown.classList.toggle('show');
      avatarIcon.classList.toggle('show'); // Добавляем или убираем класс для иконки
      event.stopPropagation();
      resolve(true);
    });
  });

  // Закрытие при клике вне элемента
  document.addEventListener('click', async function () {
    if (dropdown.classList.contains('show')) {
      await new Promise((resolve) => {
        dropdown.classList.remove('show');
        avatarIcon.classList.remove('show'); // Убираем класс для иконки
        resolve(true);
      });
    }
  });

  // Закрытие меню при уходе курсора с иконки
  avatarIcon.addEventListener('mouseleave', async function () {
    if (!dropdown.classList.contains('show')) {
      await new Promise((resolve) => {
        dropdown.classList.remove('show');
        avatarIcon.classList.remove('show'); // Убираем класс для иконки
        resolve(true);
      });
    }
  });
}

/**
 * Добавляет функциональность скрытия и показа хедера при скролле.
 *
 * Хедер скрывается при скролле вниз и показывается при скролле вверх.
 *
 * @function handleHeaderScroll
 */
export function handleHeaderScroll(): void {
  const header = document.querySelector('header') as HTMLElement | null;
  if (!header) return;

  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      // Скролл вниз, скрываем хедер
      header.classList.add('hidden');
    } else {
      // Скролл вверх, показываем хедер
      header.classList.remove('hidden');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
}
