import { BaseModal } from './base-modal';
import { editAddressConfig, ModalControllerParams } from '../views/types';
import { ModalRenderer } from '../views/modal-render';
import { backurl } from '../../../../services/app/config';
import { csrf } from '../../../../services/api/CSRFService';
import { debounce } from '../../../utils/debounce';
import { API_KEY } from './key-yandex';

export class AddressModal extends BaseModal {
  private readonly onSubmitCallback: (updatedAddress: Record<string, string>) => void;

  constructor(
    config: ModalControllerParams,
    userAddress: Record<string, string>,
    onSubmit: (updatedAddress: Record<string, string>) => void,
  ) {
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

    const addressInput = this.modalElement.querySelector(`[name="address"]`) as HTMLInputElement;
    const suggestionsList = this.modalElement.querySelector('#suggestions-list') as HTMLElement;

    if (addressInput && suggestionsList) {
      addressInput.addEventListener(
        'input',
        debounce(async () => {
          const query = addressInput.value.trim();
          if (query.length < 3) {
            suggestionsList.innerHTML = ''; // Очистка списка предложений
            return;
          }

          const suggestions = await this.fetchAddressSuggestions(query);

          // Обновляем UI для показа подсказок
          this.updateSuggestionsList(suggestionsList, suggestions, addressInput);
        }, 300),
      );

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!this.validateForm()) {
          // console.log('Validation failed: Some required fields are empty.');
          return;
        }

        const formData = new FormData(form);
        const updatedAddress: Record<string, string> = {};

        formData.forEach((value, key) => {
          updatedAddress[key] = value as string;
        });

      return csrf.put(`${backurl}/address`, updatedAddress)
        .then(res => {
          switch (res.status) {
            case 200:
              this.onSubmitCallback(updatedAddress);
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
          // console.error('Error updating address:', err);
        });
    });

      if (!this.modalElement) {
        return;
      }

      const closeButton = this.modalElement.querySelector('.btn__close');
      closeButton?.addEventListener('click', this.close.bind(this));
    }
  }

  private updateSuggestionsList(suggestionsList: HTMLElement, suggestions: any[], addressInput: HTMLInputElement) {
    suggestionsList.innerHTML = ''; // Очищаем текущие подсказки

    suggestions.forEach((suggestion) => {
      const option = document.createElement('div');
      option.className = 'suggestions__item';
      option.textContent = suggestion.address.formatted_address;

      option.addEventListener('click', () => {
        addressInput.value = suggestion.address.formatted_address;
        suggestionsList.innerHTML = '';
      });

      suggestionsList.appendChild(option);
    });
  }

  private async fetchAddressSuggestions(query: string): Promise<any[]> {
    const url = `https://suggest-maps.yandex.ru/v1/suggest?apikey=${API_KEY}&text=${encodeURIComponent(query)}&print_address=1&attrs=uri`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка API Яндекса: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Ошибка получения подсказок адреса:', error);
      return [];
    }
  }

  private validateForm(): boolean {
    let isValid = true;

    editAddressConfig.fields.forEach((field) => {
      const inputElement = this.modalElement?.querySelector(`[name="${field.name}"]`) as HTMLInputElement;

      const regex = /^[a-zA-Zа-яА-Я0-9№\s.,\/-]+$/u;
      this.removeInputError(inputElement);
      isValid = true;

      if (inputElement && !inputElement.value.trim()) {
        this.addInputError(inputElement, `Поле "${field.label}" не должно быть пустым`);
        isValid = false;
      } else if (!regex.test(inputElement.value)) {
        this.addInputError(inputElement, 'Поле должно содержать буквы цифры, точки, запятые, слэши и дефисы')
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
