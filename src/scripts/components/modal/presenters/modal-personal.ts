import { editNameGenderEmailConfig, ModalControllerParams, ModalField } from '../views/types';
import { BaseModal } from './base-modal';
import { ModalRenderer } from '../views/modal-render';



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

    // Render the modal using ModalRenderer
    this.modalElement = ModalRenderer.render(this.config.rootId, editNameGenderEmailConfig);
    this.setupListeners();
  }

  protected setupListeners() {
    if (!this.modalElement) return;
    const form = this.modalElement.querySelector(`#${editNameGenderEmailConfig.formId}`) as HTMLFormElement;
    if (!form) return;

    // Handle form submission without Object.fromEntries
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const updatedUser: Record<string, string> = {};
      formData.forEach((value, key) => {
        updatedUser[key] = value as string;
      });

      this.onSubmitCallback(updatedUser);
      this.close();
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