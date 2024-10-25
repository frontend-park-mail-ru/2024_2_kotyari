import { BaseModalController } from './base-modal-controller';
import { ModalControllerParams } from '../views/types';

const USER_ADDRESS_SELECTOR = '.account__address-details .account__address-text';
const FIELD_ADDRESS = 'address';

export class AddressModal extends BaseModalController {
  constructor(params: ModalControllerParams, data: any, user: any) {
    super(params);

    const form = document.getElementById(data.formId) as HTMLFormElement | null;
    if (form) {
      form.addEventListener('submit', (event: SubmitEvent) => {
        event.preventDefault();
        const formData = new FormData(form);
        this.handleFormSubmission(data.id, formData, user);
        this.closeModal();
      });
    }
  }

  handleFormSubmission(_formId: string, formData: FormData, user: any): void {
    const updatedAddress = {
      address: formData.get(FIELD_ADDRESS) as string,
    };
    this.updateAddress(updatedAddress, user);
  }

  private updateAddress(updatedAddress: { address: string }, user: any) {
    user.address = updatedAddress.address;

    const addressElement = document.querySelector(USER_ADDRESS_SELECTOR) as HTMLElement;
    if (addressElement) {
      addressElement.textContent = updatedAddress.address;
    }
  }
}
