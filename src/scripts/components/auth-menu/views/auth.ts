import { TemplateManager } from '../../../constprograms/templatizer/templatizer.js';
import { AuthViewInterface } from '../types/types.js';

const defaultPath = '/src/scripts/components/auth-menu/views/auth.hbs';
const defaultRootId = 'main';


export default class AuthView implements AuthViewInterface {
  private config: {};
  private readonly rootId: string = defaultRootId;
  private tmpPath: string;

  constructor(config: {}, rootId: string = defaultRootId, tmpPath: string = defaultPath) {
    this.rootId = rootId;
    this.tmpPath = tmpPath;
    this.config = config;
  }

  render = (): Promise<void> => {
    const rootElement = document.getElementById(this.rootId);

    if (!rootElement) {
      return Promise.reject(new Error(`Элемент ID =  ${this.rootId} не найден`));
    }

    return TemplateManager.templatize(rootElement, this.tmpPath, this.config)
      .then(() => {
        document.querySelectorAll('.toggle-password')
          .forEach((item) => {
            item.addEventListener('click', this.togglePassword as EventListener);
          });
      })
      .then(err => {
        console.error('[AuthView.render] ', err);
      });
  };

  update = (userName: string): void => {
    const avatarElement = document.getElementById('avatar');
    const nameElement = document.getElementById('name');

    if (avatarElement) {
      // Обновляем ссылки в блоке avatar
      avatarElement.innerHTML = `
      <a href="#" router="stability-active" class="catalog-link">Личный кабинет</a>
      <a href="/logout" router="stability-active" id="logout" class="catalog-link">Выход</a>
    `;
    }

    if (nameElement) {
      // Обновляем отображение имени
      nameElement.textContent = userName;
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

// let s = new SignUpView('main', '123', menuSignUp);
