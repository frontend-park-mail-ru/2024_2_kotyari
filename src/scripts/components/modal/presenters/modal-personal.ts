import { editNameGenderEmailConfig, ModalControllerParams, ModalField } from '../views/types';
import { BaseModal } from './base-modal';
import { ModalRenderer } from '../views/modal-render';
import { backurl } from '../../../../services/app/config';
import { csrf } from '../../../../services/api/CSRFService';

export class PersonalDataModal extends BaseModal {
  private readonly onSubmitCallback: (updatedUser: Record<string, string>) => void;

  constructor(config: ModalControllerParams, userData: Record<string, string>, onSubmit: (updatedUser: Record<string, string>) => void) {
    super(config, editNameGenderEmailConfig, userData);
    this.onSubmitCallback = onSubmit;
  }

  protected renderContent(): void {
    editNameGenderEmailConfig.fields.forEach((field: ModalField) => {
      if (field.name in this.user) {
        field.value = this.user[field.name];
      }
      if (field.name === 'gender' && field.options) {
        field.selected = this.user.gender;
      }
    });

    this.modalElement = ModalRenderer.render(this.config.rootId, editNameGenderEmailConfig);
    this.setupListeners();
  }

  protected setupListeners() {
    if (!this.modalElement) return;
    const form = this.modalElement.querySelector(`#${editNameGenderEmailConfig.formId}`) as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const updatedUser: Record<string, string> = {};

      formData.forEach((value, key) => {
        updatedUser[key] = value as string;
      });

      this.handleSubmit(updatedUser).finally()
        // .then(() => console.log("Submit successful"))
        // .catch((error) => console.error("Submit failed:", error));
    });

    const inputs = form.querySelectorAll('input, select') as HTMLInputElement[];
    inputs.forEach((input) => {
      input.addEventListener('focusout', () => this.handleFieldValidation(input));
    });

    const closeButton = this.modalElement.querySelector('.btn__close');
    closeButton?.addEventListener('click', this.close.bind(this));
  }

  private handleFieldValidation(input: HTMLInputElement | HTMLSelectElement) {
    const name = input.name;

    switch (name) {
      case 'email':
        this.validateEmail(input as HTMLInputElement);
        break;
      case 'username':
        this.validateUsername(input as HTMLInputElement);
        break;
      default:
        break;
    }
  }

  private async handleSubmit(updatedData: Record<string, string>) {
    // Make sure to validate data before sending
    if (!this.validateForm()) {
      return;
    }

    return csrf.put(`${backurl}/account`, updatedData)
      .then(res => {
        switch (res.status) {
          case 200:
            this.onSubmitCallback(updatedData);
            this.close();
            return;
          case 403:
            csrf.refreshToken();
            throw new Error('попробуйте еще раз');
            return;
          default:
            throw new Error(`${res.status} - ${res.body.error_message}`);
        }
      })
      .catch(err => {
        // console.error('Error updating profile:', err);
        this.displayBackError(err || 'ошибка, попробуйте еще раз');
      });
  }

  private displayBackError(message: string) {
    const errorElement = this.modalElement && this.modalElement.querySelector('#global_error') as HTMLElement | null;
    const globalErrorMessage = this.modalElement && this.modalElement.querySelector('#global_error_message') as HTMLElement | null;

    if (errorElement && globalErrorMessage) {
      globalErrorMessage.innerText = message;
      errorElement.style.display = 'block';
    } else {
      // console.error('Error elements not found in the modal.');
    }
  }

  private validateForm(): boolean {
    const emailInput = document.getElementById('user-email') as HTMLInputElement;
    const usernameInput = document.getElementById('user-name') as HTMLInputElement;
    let isValid = true;

    if (emailInput) {
      isValid = this.validateEmail(emailInput) && isValid;
    }
    if (usernameInput) {
      isValid = this.validateUsername(usernameInput) && isValid;
    }

    return isValid;
  }

  private validateEmail(emailInput: HTMLInputElement): boolean {
    const emailRegex = /^[a-z0-9а-яё._%+-]+@[a-z0-9а-яё.-]+\.[a-zа-я]{2,}$/i;

    // Get the error element using `data-error-id` attribute or fallback to 'emailError'
    const errorId = emailInput.getAttribute('data-error-id') || 'emailError';
    const errorElement = document.getElementById(errorId);

    this.removeInputError(emailInput, errorElement);

    if (!emailRegex.test(emailInput.value)) {
      this.addInputError(emailInput, errorElement, 'Неверный формат почты');
      return false;
    }

    return true;
  }

  private validateUsername(usernameInput: HTMLInputElement): boolean {
    const usernameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9 _-]+$/;
    const errorId = usernameInput.getAttribute('data-error-id') || 'nameError';
    const errorElement = document.getElementById(errorId);
    const usernameValue = usernameInput.value;

    this.removeInputError(usernameInput, errorElement);

    if (usernameValue.length < 2 || usernameValue.length > 40) {
      this.addInputError(usernameInput, errorElement, 'Имя должно быть от 2 до 40 символов');
      return false;
    }

    if (!usernameRegex.test(usernameValue)) {
      this.addInputError(usernameInput, errorElement, 'Имя должно содержать только буквы и цифры');
      return false;
    }

    return true;
  }

  private addInputError(element: HTMLElement, errorElement: HTMLElement | null, message: string) {
    // console.log('Adding input error for:', element.id, 'with message:', message);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      element.classList.add('form__input_invalid');
      element.style.backgroundColor = '#ffe6e6';
      element.style.borderColor = 'red';
    }
  }

  private removeInputError(element: HTMLElement, errorElement: HTMLElement | null) {
    // console.log('Removing input error for:', element.id);

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
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