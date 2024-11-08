import { ModalControllerParams } from '../views/types';

export abstract class BaseModal {
  protected config: ModalControllerParams;
  protected data: any;
  protected user: any;
  protected modalElement: HTMLElement | null = null; // Add modalElement here

  protected constructor(config: ModalControllerParams, data: any, user: any) {
    this.config = config;
    this.data = data;
    this.user = user;
  }

  public open() {
    this.modalElement = document.getElementById('modal-render');

    if (!this.modalElement) {
      this.renderContent();
    }

    if (this.modalElement) {
      this.modalElement.style.visibility = 'visible';
      this.modalElement.style.opacity = '1';

      if (!this.config.btnClose){
        this.config.btnClose = 'btn__close';
      }

      const closeButton = this.modalElement.querySelector(this.config.btnClose);
      closeButton?.addEventListener('click', this.close.bind(this));

      this.modalElement.addEventListener('click', this.handleOutsideClick.bind(this));
    }
  }

  public close() {
    if (this.modalElement) {
      this.modalElement.style.opacity = '0';
      setTimeout(() => {
        this.modalElement!.style.visibility = 'hidden';
        this.modalElement!.removeEventListener('click', this.handleOutsideClick.bind(this));
      }, 300);
    }
  }

  private handleOutsideClick(event: MouseEvent) {
    if (!this.modalElement) {
      console.error(this.modalElement, ' not found');
      return;
    }

    const modalContent = this.modalElement.querySelector('.modal__container');
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