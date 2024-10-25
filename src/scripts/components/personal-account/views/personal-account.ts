import account from './personal-account.hbs?raw';
import Handlebars from 'handlebars';
import { rootId } from '../../../../services/app/config';
import { BuildModalOptions, editAddressConfig, editNameGenderEmailConfig } from '../../modal/views/types';
import { buildModalWithContent } from '../../modal/views/modal';

const compiled = Handlebars.compile(account);
const MODAL_ROOT_ID = 'modal-render';
const MODAL_ID = 'modal';
const EDIT_USER_INFO_TRIGGER = 'edit-user-info';
const EDIT_USER_ADDRESS_TRIGGER = 'edit-user-address';
const FIELD_NAME = 'name';
const FIELD_GENDER = 'gender';
const FIELD_EMAIL = 'email';
const FIELD_ADDRESS = 'address';

function openUserEditModal(options: BuildModalOptions) {
  buildModalWithContent(options);
}

export async function renderPersonalAccountPage(data: any) {
  const rootElement = document.getElementById(rootId) as HTMLElement;
  if (!rootElement) {
    console.error(`Элемент root ${rootId} не найден`);
    return;
  }

  rootElement.innerHTML = '';
  const templateElement = document.createElement('div');
  templateElement.innerHTML = compiled(data);
  rootElement.appendChild(templateElement);

  const user = data.user;

  const editButton = document.getElementById(EDIT_USER_INFO_TRIGGER);
  const editButtonAddress = document.getElementById(EDIT_USER_ADDRESS_TRIGGER);

  if (editButton) {
    editButton.addEventListener('click', () => {
      const userData = {
        ...editNameGenderEmailConfig,
        fields: editNameGenderEmailConfig.fields.map((field) => {
          if (field.name === FIELD_NAME) {
            field.value = user.name;
          } else if (field.name === FIELD_GENDER) {
            field.selected = user.gender;
          } else if (field.name === FIELD_EMAIL) {
            field.value = user.email;
          }
          return field;
        }),
      };

      const options: BuildModalOptions = {
        user,
        triggerElement: EDIT_USER_INFO_TRIGGER,
        rootId: MODAL_ROOT_ID,
        modalID: MODAL_ID,
        data: userData,
      };
      // Используем PersonalDataModal для редактирования персональных данных
      openUserEditModal(options);
    });
  }

  if (editButtonAddress) {
    editButtonAddress.addEventListener('click', () => {
      const addressData = {
        ...editAddressConfig,
        fields: editAddressConfig.fields.map((field) => {
          if (field.name === FIELD_ADDRESS) {
            field.value = user.address;
          }
          return field;
        }),
      };

      const options: BuildModalOptions = {
        user,
        triggerElement: EDIT_USER_ADDRESS_TRIGGER,
        rootId: MODAL_ROOT_ID,
        modalID: MODAL_ID,
        data: addressData,
      };
      // Используем AddressModal для редактирования адреса
      openUserEditModal(options);
    });
  }
}
