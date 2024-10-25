import { ModalControllerParams } from '../views/types';

export class BaseModalController {
  modalElem: HTMLElement | null;
  btn: HTMLElement | null;
  btnClose: string | undefined;
  time: number;

  constructor({ modal, btnOpen, btnClose, time = 300 }: ModalControllerParams) {
    this.modalElem = document.getElementById(modal);
    this.btn = document.getElementById(btnOpen);
    this.btnClose = btnClose;
    this.time = time;

    if (!this.btn || !this.modalElem) {
      console.error('Modal or button not found.');
      return;
    }

    this.initializeModal();
  }

  initializeModal() {
    const closeModal = (event: Event) => {
      const target = event.target as HTMLElement;

      if (target === this.modalElem || (this.btnClose && target.closest(this.btnClose))) {
        this.modalElem!.style.opacity = '0';
        setTimeout(() => {
          this.modalElem!.style.visibility = 'hidden';
        }, this.time);
        window.removeEventListener('click', closeModal);
      }
    };

    const openModal = () => {
      this.modalElem!.style.visibility = 'visible';
      this.modalElem!.style.opacity = '1';
      window.addEventListener('click', closeModal);
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
