import { ModalControllerParams } from '../views/types';

export abstract class BaseModal {
  protected config: ModalControllerParams;
  protected data: any;
  protected user: any;

  constructor(config: ModalControllerParams, data: any, user: any) {
    this.config = config;
    this.data = data;
    this.user = user;
  }

  public open() {
    const modalElement = document.getElementById(this.config.modal);
    const closeButton = modalElement?.querySelector(this.config.btnClose);

    if (modalElement) {
      modalElement.style.visibility = 'visible';
      modalElement.style.opacity = '1';

      closeButton?.addEventListener('click', this.close.bind(this));

      modalElement.addEventListener('click', this.handleOutsideClick.bind(this));
    }
  }

  public close() {
    const modalElement = document.getElementById(this.config.modal);
    if (modalElement) {
      modalElement.style.opacity = '0';
      setTimeout(() => {
        modalElement.style.visibility = 'hidden';
        modalElement.removeEventListener('click', this.handleOutsideClick.bind(this));
      }, 300);
    }
  }

  private handleOutsideClick(event: MouseEvent) {
    const modalElement = document.getElementById(this.config.modal);
    const modalContent = modalElement?.querySelector('.modal__container');
    if (modalContent && !modalContent.contains(event.target as Node)) {
      this.close();
    }
  }

  protected abstract renderContent(): void;

  protected handleFormSubmission(
    form: HTMLFormElement,
    fields: string[],
    updateFunction: (data: any) => void
  ): void {
    const formData = new FormData(form);
    const updatedData = fields.reduce((acc, field) => {
      acc[field] = formData.get(field) as string;
      return acc;
    }, {} as Record<string, any>);

    updateFunction(updatedData);
  }
}
