import { ModalRenderer } from '../views/modal-render';
import { PersonalDataModal } from './personal-data-modal';
import { AddressModal } from './address-modal';
import { BaseModal } from './base-modal';
import { ModalControllerParams } from '../views/types';

export type ModalType = 'edit_info' | 'edit_address';

type ModalConstructor = new (config: ModalControllerParams, data: any, user: any) => BaseModal;

const modalRegistry: Record<ModalType, ModalConstructor> = {
  edit_info: PersonalDataModal,
  edit_address: AddressModal,
};

export class ModalFactory {
  public static showModal(
    modalType: ModalType,
    modalParams: ModalControllerParams,
    data: any,
    user: any
  ): BaseModal | null {

    const renderedElement = ModalRenderer.render(modalParams.rootId, data);
    if (!renderedElement) return null;

    const ModalClass = modalRegistry[modalType];
    if (!ModalClass) {
      console.warn(`Unknown modal type: ${modalType}`);
      return null;
    }

    return new ModalClass(modalParams, data, user);
  }
}
