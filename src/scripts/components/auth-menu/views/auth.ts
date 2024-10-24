import { AuthViewInterface, UserInfo } from '../types/types.js';
import form from './auth.hbs?raw';
import Handlebars from 'handlebars';
import { rootId } from '@/services/app/config';

export default class AuthView implements AuthViewInterface {
  private readonly config: {};
  private compiled: any = null;

  constructor(config: {}) {
    this.config = config;
    this.compiled = null;
  }

  private _render = () => {
    if (this.compiled === null) this.compiled = Handlebars.compile(form);

    const rootElement = document.getElementById(rootId);
    if (!rootElement) {
      return console.error(`Элемент ID =  ${rootId} не найден`);
    }

    rootElement.innerHTML = '';
    const templateElement = document.createElement('div');
    templateElement.innerHTML = this.compiled(this.config);
    rootElement.appendChild(templateElement);
  };

  render = (): void => {
    this._render();

    document.querySelectorAll('.input-container__toggle-password').forEach((item) => {
      item.addEventListener('click', this.togglePassword as EventListener);
    });
  };

  updateAfterAuth = (user: UserInfo): void => {
    const avatarElement = document.getElementById('avatar');
    const nameElement = document.getElementById('name');
    const cityElement = document.getElementById('city');

    if (avatarElement) {
      avatarElement.innerHTML = `
      <a href="/account" router="stability-active" class="catalog-link">Личный кабинет</a>
      <a href="/logout" router="stability-active" id="logout" class="catalog-link">Выход</a>
    `;
    }

    if (nameElement) {
      nameElement.textContent = user.username;
      nameElement.classList.add('icon-label-hidden', 'catalog-link');
    }

    if (cityElement) {
      cityElement.textContent = user.city;
    }
  };

  updateAfterLogout = (): void => {
    const avatarElement = document.getElementById('avatar');
    const nameElement = document.getElementById('name');

    if (avatarElement) {
      avatarElement.innerHTML = `<a href="/login" router="stability-active" class="catalog-link">Вход</a>
                        <a href="/signup" router="stability-active" class="catalog-link">Регистрация</a>`;
    }

    if (nameElement) {
      nameElement.textContent = 'Вход';
      nameElement.classList.add('icon-label-hidden', 'catalog-link');
    }
  };

  displayBackError = (message: string) => {
    const errorElement = document.getElementById('global_error');
    const globalErrorMessage = document.getElementById('global_error_message');

    if (errorElement && globalErrorMessage) {
      globalErrorMessage.innerText = message;
      errorElement.style.display = 'block';
    }
  };

  /**
   * Removes error message from the input field and resets its style.
   *
   * @param {HTMLElement} element - The input element to clear error from.
   * @param {HTMLElement} errorElement - The element where the error message is displayed.
   */
  removeInputError = (element: HTMLElement, errorElement: HTMLElement) => {
    errorElement.textContent = '';
    element.classList.remove('invalid__input');
  };

  /**
   * Adds an error message to the input field and applies invalid input styling.
   *
   * @param {HTMLElement} element - The input element to apply the error message to.
   * @param {HTMLElement} errorElement - The element where the error message will be displayed.
   * @param {string} msg - The error message to display.
   */
  addInputError = (element: HTMLElement, errorElement: HTMLElement, msg: string) => {
    errorElement.textContent = msg;
    element.classList.add('invalid__input');
  };

  /**
   * Функция для переключения типа поля ввода пароля и состояния иконки.
   *
   * @param {Event} event - Событие клика по иконке для переключения пароля.
   */
  private togglePassword = (event: MouseEvent): void => {
    const icon = event.currentTarget as HTMLElement;
    const fieldId = icon.getAttribute('data-field-id');
    const passwordInput = document.getElementById(fieldId!);

    if (passwordInput) {
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
  };
}
