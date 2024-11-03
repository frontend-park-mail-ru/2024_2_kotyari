import { BaseModal } from './base-modal';
import { editAddressConfig, ModalControllerParams } from '../views/types';
import { ModalRenderer } from '../views/modal-render';
import { backurl } from '../../../../services/app/config';

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

    // Render the modal using ModalRenderer
    this.modalElement = ModalRenderer.render(this.config.rootId, editAddressConfig);
    this.setupListeners();
  }

  protected setupListeners() {
    if (!this.modalElement) return;
    const form = this.modalElement.querySelector(`#${editAddressConfig.formId}`) as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const updatedAddress: Record<string, string> = {};

      formData.forEach((value, key) => {
        updatedAddress[key] = value as string;
      });

      try {
        const response = await fetch(`${backurl}/address`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedAddress),
          credentials: 'include',
        });

        if (response.ok) {
          this.onSubmitCallback(updatedAddress);
          this.close();
        } else {
          console.error('Failed to update address:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating address:', error);
      }
    });

    const closeButton = this.modalElement.querySelector('.btn__close');
    closeButton?.addEventListener('click', this.close.bind(this));
  }

  public open() {
    this.renderContent();
    super.open();
  }
}

function fromEntries(entries: Iterable<[string, any]>): Record<string, any> {
  return [...entries].reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
}