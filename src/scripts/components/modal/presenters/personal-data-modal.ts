import { BaseModalController } from './base-modal-controller';
import { ModalControllerParams } from '../views/types';

const USER_NAME_SELECTOR = '.account__user-name';
const USER_GENDER_SELECTOR = '.product-page__description-item .product-page__description-value.gender';
const USER_EMAIL_SELECTOR = '.product-page__description-item .product-page__description-value.email';
const FIELD_NAME = 'name';
const FIELD_GENDER = 'gender';
const FIELD_EMAIL = 'email';

export class PersonalDataModal extends BaseModalController {
  constructor(params: ModalControllerParams, data: any, user: any) {
    super(params);

    const form = document.getElementById(data.formId) as HTMLFormElement | null;
    if (form) {
      form.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        const formData = new FormData(form);
        this.handleFormSubmission(data.id, formData, user);
        this.closeModal();
      });
    }
  }

  handleFormSubmission(_formId: string, formData: FormData, user: any): void {
    const updatedUser = {
      name: formData.get(FIELD_NAME) as string,
      gender: formData.get(FIELD_GENDER) as string,
      email: formData.get(FIELD_EMAIL) as string,
    };
    this.updateUserInfo(updatedUser, user);
  }

  private updateUserInfo(updatedUser: { name: string; gender: string; email: string }, user: any) {
    Object.assign(user, updatedUser);

    // Обновляем имя пользователя
    const userNameElement = document.querySelector(USER_NAME_SELECTOR) as HTMLElement | null;
    if (userNameElement) {
      userNameElement.textContent = updatedUser.name;
    }

    // Обновляем пол пользователя
    const genderElement = document.querySelector(USER_GENDER_SELECTOR) as HTMLElement | null;
    if (genderElement) {
      genderElement.textContent = updatedUser.gender;
    }

    // Обновляем email пользователя
    const emailElement = document.querySelector(USER_EMAIL_SELECTOR) as HTMLElement | null;
    if (emailElement) {
      emailElement.textContent = updatedUser.email;
    }
  }
}
