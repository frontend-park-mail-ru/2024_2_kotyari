import { BaseModal } from './base-modal';
import { changePasswordConfig, ModalControllerParams } from '../views/types';
import { ModalRenderer } from '../views/modal-render';
import { backurl } from '../../../../services/app/config';
import { csrf } from '../../../../services/api/CSRFService';

export class ChangePasswordModal extends BaseModal {
  private readonly onSubmitCallback: () => void;

  constructor(
    config: ModalControllerParams,
    onSubmit: () => void,
  ) {
    super(config, changePasswordConfig, {});
    this.onSubmitCallback = onSubmit;
  }

  protected renderContent(): void {
    changePasswordConfig.fields.forEach((field) => {
      field.value = '';
    });

    this.modalElement = ModalRenderer.render(this.config.rootId, changePasswordConfig);
    this.setupListeners();
  }

  protected setupListeners() {
    if (!this.modalElement) return;
    const form = this.modalElement.querySelector(`#${changePasswordConfig.formId}`) as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!this.validateForm()) {
        return;
      }

      const formData = new FormData(form);
      const updatedPassword: Record<string, string> = {};

      formData.forEach((value, key) => {
        updatedPassword[key] = value as string;
      });

      // Отправка данных на сервер для смены пароля
      return csrf.put(`${backurl}/change_password`, updatedPassword)
        .then(res => {
          switch (res.status) {
            case 200:
              this.onSubmitCallback();
              this.close();
              return;
            case 403:
              csrf.refreshToken();
              throw new Error('протух csrf токен, попробуйте еще раз');
            default:
              throw new Error(`${res.status} - ${res.body.error_message}`);
          }
        })
        .catch((err) => {
          // console.error('Ошибка смены пароля:', err);
        });
    });

    if (!this.modalElement) {
      return;
    }

    const closeButton = this.modalElement.querySelector('.btn__close');
    closeButton?.addEventListener('click', this.close.bind(this));
  }

  private validateForm(): boolean {
    let isValid = true;

    changePasswordConfig.fields.forEach((field) => {
      const inputElement = this.modalElement?.querySelector(`[name="${field.name}"]`) as HTMLInputElement;

      const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/u;
      this.removeInputError(inputElement);
      isValid = true;

      if (inputElement && !inputElement.value.trim()) {
        this.addInputError(inputElement, `Поле "${field.label}" не должно быть пустым`);
        isValid = false;
      } else if (field.name === 'repeatPassword' && inputElement && inputElement.value !== this.modalElement?.querySelector('[name="new-password"]')?.value) {
        this.addInputError(inputElement, 'Пароли не совпадают');
        isValid = false;
      } else if (!regex.test(inputElement.value)) {
        this.addInputError(inputElement, 'Пароль должен содержать только допустимые символы');
        isValid = false;
      }
    });

    return isValid;
  }

  private addInputError(element: HTMLElement, message: string) {
    const errorId = element.getAttribute('data-error-id') || `${element.name}Error`;
    let errorElement = document.getElementById(errorId);

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'form__error';
      element.parentElement?.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
    element.classList.add('form__input_invalid');
    element.style.backgroundColor = '#ffe6e6';
    element.style.borderColor = 'red';
  }

  private removeInputError(element: HTMLElement) {
    const errorId = element.getAttribute('data-error-id') || `${element.name}Error`;
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.style.display = 'none';
      errorElement.textContent = '';
      element.classList.remove('form__input_invalid');
      element.style.borderColor = '';
      element.style.backgroundColor = '';
    }
  }

  public open() {
    this.renderContent();
    super.open();
  }
}
