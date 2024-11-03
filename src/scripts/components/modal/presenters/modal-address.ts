import { BaseModal } from './base-modal';
import { editAddressConfig, ModalControllerParams } from '../views/types';
import { ModalRenderer } from '../views/modal-render';

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

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const updatedAddress = Array.from(formData.entries()).reduce((acc, [key, value]) => {
        acc[key] = value as string;
        return acc;
      }, {} as Record<string, string>);

      this.onSubmitCallback(updatedAddress);
      this.close();
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