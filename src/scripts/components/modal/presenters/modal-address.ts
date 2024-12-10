import { BaseModal } from './base-modal';
import { editAddressConfig, ModalControllerParams } from '../views/types';
import { ModalRenderer } from '../views/modal-render';
import { backurl } from '../../../../services/app/config';
import { csrf } from '../../../../services/api/CSRFService';

export class AddressModal extends BaseModal {
  private readonly onSubmitCallback: (updatedAddress: Record<string, string>) => void;

  constructor(config: ModalControllerParams, userAddress: Record<string, string>, onSubmit: (updatedAddress: Record<string, string>) => void) {
    super(config, editAddressConfig, userAddress);
    this.onSubmitCallback = onSubmit;
  }

  protected renderContent(): void {
    editAddressConfig.fields.forEach((field) => {
      field.value = this.user[field.name] || '';
    });

    this.modalElement = ModalRenderer.render(this.config.rootId, editAddressConfig);
    this.setupListeners();
  }

  protected setupListeners() {
    if (!this.modalElement) return;
    const form = this.modalElement.querySelector(`#${editAddressConfig.formId}`) as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!this.validateForm()) {
        // console.log("Validation failed: Some required fields are empty.");
        return;
      }

      const formData = new FormData(form);
      const updatedAddress: Record<string, string> = {};

      formData.forEach((value, key) => {
        updatedAddress[key] = value as string;
      });

      return csrf.put(`${backurl}/address`, updatedAddress)
        .then(res => {
          switch (res.status){
            case 200:
              this.onSubmitCallback(updatedAddress);
              this.close();
              return;
            case 403:
              csrf.refreshToken();
              throw new Error('протух csrf токен, попробуйте еще раз')
            default:
              throw new Error(`${res.status} - ${res.body.error_message}`);
          }
        })
        .catch((err) => {
          // console.error('Error updating address:', err);
        })
    });

    if (!this.modalElement) {
      return;
    }

    const closeButton = this.modalElement.querySelector('.btn__close');
    closeButton?.addEventListener('click', this.close.bind(this));
  }

  private validateForm(): boolean {
    let isValid = true;

    editAddressConfig.fields.forEach((field) => {
      const inputElement = this.modalElement?.querySelector(`[name="${field.name}"]`) as HTMLInputElement;

      if (inputElement && field.name !== 'flat' && !inputElement.value.trim()) {
        this.addInputError(inputElement, `Поле "${field.label}" не должно быть пустым`);
        isValid = false;
      } else {
        this.removeInputError(inputElement);
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