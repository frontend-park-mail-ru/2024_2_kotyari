import { BaseModal } from './base-modal';
import { ModalControllerParams } from '../views/types';
import { editNameGenderEmailConfig } from '../views/types';
import { personalAccountData } from '../../personal-account/views/personal-account-config';

const USER_NAME_SELECTOR = '.account__user-name';
const USER_GENDER_SELECTOR = '.product-page__description-item .product-page__description-value.gender';
const USER_EMAIL_SELECTOR = '.product-page__description-item .product-page__description-value.email';
const FIELD_NAME = 'name';
const FIELD_GENDER = 'gender';
const FIELD_EMAIL = 'email';

export class PersonalDataModal extends BaseModal {
  constructor(config: ModalControllerParams, data: any, user: any) {
    super(config, data, user);
    this.renderContent();
  }

  protected renderContent(): void {
    editNameGenderEmailConfig.fields.forEach((field) => {
      if (field.name === FIELD_NAME) {
        field.value = this.user.name;
      } else if (field.name === FIELD_GENDER) {
        field.selected = this.user.gender;
      } else if (field.name === FIELD_EMAIL) {
        field.value = this.user.email;
      }
    });

    const modalElement = document.getElementById(this.config.modal);
    if (modalElement) {
      const form = modalElement.querySelector(`#${this.data.formId}`) as HTMLFormElement | null;
      if (form) {
        form.addEventListener('submit', (event: SubmitEvent) => {
          event.preventDefault();
          this.handleFormSubmission(form, [FIELD_NAME, FIELD_GENDER, FIELD_EMAIL], (updatedData) => {
            this.updateUserInfo(updatedData);
          });
          this.close();
        });
      }
    }
  }

  private updateUserInfo(updatedUser: { name: string; gender: string; email: string }): void {
    Object.assign(this.user, updatedUser);

    const userNameElement = document.querySelector(USER_NAME_SELECTOR) as HTMLElement | null;
    if (userNameElement) {
      userNameElement.textContent = updatedUser.name;
      personalAccountData.user.name = updatedUser.name;
    }

    const genderElement = document.querySelector(USER_GENDER_SELECTOR) as HTMLElement | null;
    if (genderElement) {
      genderElement.textContent = updatedUser.gender;
      personalAccountData.user.gender = updatedUser.gender;
    }

    const emailElement = document.querySelector(USER_EMAIL_SELECTOR) as HTMLElement | null;
    if (emailElement) {
      emailElement.textContent = updatedUser.email;
      personalAccountData.user.email = updatedUser.email;
    }
  }
}
