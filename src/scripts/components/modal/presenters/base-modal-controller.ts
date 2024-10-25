import { ModalControllerParams } from '../views/types';

export class BaseModalController {
  modalElem: HTMLElement | null;
  btn: HTMLElement | null;
  time: number;

  constructor({ modal, btnOpen, btnClose, time = 300 }: ModalControllerParams) {
    this.modalElem = document.getElementById(modal);
    this.btn = document.getElementById(btnOpen);
    this.time = time;

    if (!this.btn || !this.modalElem) {
      console.error('Modal or button not found.');
      return;
    }

    this.initializeModal(btnClose);
  }

  initializeModal(btnClose?: string) {
    const closeModal = (event: Event | KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (target === this.modalElem || (btnClose && target.closest(btnClose))) {
        this.modalElem!.style.opacity = '0';
        setTimeout(() => {
          this.modalElem!.style.visibility = 'hidden';
        }, this.time);
        window.removeEventListener('keydown', closeModal);
      }
    };

    const openModal = () => {
      this.modalElem!.style.visibility = 'visible';
      this.modalElem!.style.opacity = '1';
      window.addEventListener('keydown', closeModal);
    };

    this.btn!.addEventListener('click', openModal);
    this.modalElem!.addEventListener('click', closeModal);
  }

  closeModal() {
    this.modalElem!.style.opacity = '0';
    setTimeout(() => {
      this.modalElem!.style.visibility = 'hidden';
    }, this.time);
  }

  handleFormSubmission(formId: string, formData: FormData, user: any): void {
    throw new Error("Method 'handleFormSubmission' must be implemented in subclasses.");
  }
}
