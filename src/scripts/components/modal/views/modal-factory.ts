import Handlebars from 'handlebars';
import modalTemplate from './modal.hbs?raw';
import { PersonalDataModal } from '../presenters/personal-data-modal';
import { AddressModal } from '../presenters/address-modal';
import { BaseModal } from '../presenters/base-modal';
import { ModalControllerParams } from './types';

export class ModalFactory {
  private static compiledTemplate = Handlebars.compile(modalTemplate);

  public static showModal(modalType: string, modalParams: ModalControllerParams, data: any, user: any): void {
    const root = document.getElementById(modalParams.rootId) as HTMLElement | null;
    if (!root) {
      console.error(`Root element with id ${modalParams.rootId} not found.`);
      return;
    }

    try {
      const templateElement = document.createElement('div');
      templateElement.innerHTML = this.compiledTemplate(data);
      root.innerHTML = '';
      root.appendChild(templateElement);

      let modalInstance: BaseModal;

      switch (modalType) {
        case 'edit_info':
          modalInstance = new PersonalDataModal(modalParams, data, user);
          break;

        case 'edit_address':
          modalInstance = new AddressModal(modalParams, data, user);
          break;

        default:
          console.warn(`Unknown modal type: ${modalType}`);
          return;
      }

      modalInstance.open();

    } catch (err) {
      console.error('Error rendering modal:', err);
    }
  }
}
