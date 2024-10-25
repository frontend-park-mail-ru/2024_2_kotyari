import { BaseModal } from './base-modal';
import { ModalControllerParams } from '../views/types';

const USER_ADDRESS_SELECTOR = '.account__address-details .account__address-text';
const FIELD_ADDRESS = 'address';

export class AddressModal extends BaseModal {
  constructor(config: ModalControllerParams, data: any, user: any) {
    super(config, data, user);
    this.renderContent();
  }

  protected renderContent(): void {
    const addressField = this.data.fields.find((field: any) => field.name === FIELD_ADDRESS);
    if (addressField) {
      addressField.value = this.user.address;
    }

    const modalElement = document.getElementById(this.config.modal);
    if (modalElement) {
      const form = modalElement.querySelector(`#${this.data.formId}`) as HTMLFormElement | null;
      if (form) {
        form.addEventListener('submit', (event: SubmitEvent) => {
          event.preventDefault();
          this.handleFormSubmission(form, [FIELD_ADDRESS], (updatedData) => {
            this.updateAddress(updatedData.address);
          });
          this.close();
        });
      }
    }
  }

  private updateAddress(updatedAddress: string): void {
    this.user.address = updatedAddress;
    const addressElement = document.querySelector(USER_ADDRESS_SELECTOR) as HTMLElement;
    if (addressElement) {
      addressElement.textContent = updatedAddress;
    }
  }
}
