import Handlebars from 'handlebars';
import { BuildModalOptions } from './types';
import modal from './modal.hbs?raw';
import { PersonalDataModal } from '../presenters/personal-data-modal';
import { AddressModal } from '../presenters/address-modal';

const compiled = Handlebars.compile(modal);

/**
 * Создает и отображает модальное окно с заданным контентом.
 * В зависимости от переданных данных (data.id), создает модалку для редактирования персональных данных
 * или модалку для редактирования адреса.
 * @param {BuildModalOptions} options - Параметры модального окна.
 * @returns {Promise<void> | undefined}
 */

export async function buildModalWithContent({
                                              user,
                                              triggerElement,
                                              rootId,
                                              modalID,
                                              data,
                                            }: BuildModalOptions): Promise<void | undefined> {

  const root = document.getElementById(rootId) as HTMLElement | null;

  if (!root) {
    console.error(`Root element with id ${rootId} not found.`);
    return;
  }

  try {
    const templateElement = document.createElement('div');
    templateElement.innerHTML = compiled(data);
    root.innerHTML = '';
    root.appendChild(templateElement);

    switch (data.id) {
      case 'edit_info':
        new PersonalDataModal({
          modal: modalID,
          btnOpen: triggerElement,
          btnClose: '.btn__close',
        }, data, user);
        break;

      case 'edit_address':
        new AddressModal({
          modal: modalID,
          btnOpen: triggerElement,
          btnClose: '.btn__close',
        }, data, user);
        break;

      default:
        console.warn(`Unknown modal type: ${data.id}`);
    }

  } catch (err) {
    console.error('Error rendering modal:', err);
  }
}
