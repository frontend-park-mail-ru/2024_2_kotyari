import { editNameGenderEmailConfig, ModalControllerParams, ModalField } from '../views/types';
import { BaseModal } from './base-modal';
import { ModalRenderer } from '../views/modal-render';
import { backurl } from '../../../../services/app/config';



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

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const updatedUser: Record<string, string> = {};

      formData.forEach((value, key) => {
        updatedUser[key] = value as string;
      });

      try {
        const response = await fetch(`${backurl}/account`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
          credentials: 'include',
        });

        if (response.ok) {
          this.onSubmitCallback(updatedUser);
          this.close();
        } else {
          console.error('Failed to update profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    });

    // Close button listener
    const closeButton = this.modalElement.querySelector('.btn__close');
    closeButton?.addEventListener('click', this.close.bind(this));
  }

  public open() {
    this.renderContent();
    super.open();
  }
}