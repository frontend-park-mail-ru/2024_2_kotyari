import account from './personal-account.hbs?raw';
import Handlebars from 'handlebars';
import { contentRenderId } from '../../../services/app/config';
import { BuildModalOptions, editAddressConfig, editNameGenderEmailConfig } from '../modal/types';
import { buildModalWithContent } from '../modal/modal';

const compiled = Handlebars.compile(account);

function openUserEditModal(options: BuildModalOptions) {
  buildModalWithContent(options);
}

export async function renderPersonalAccountPage(data: any) {
  const rootElement = document.getElementById(contentRenderId) as HTMLElement;
  if (!rootElement) {
    console.error(`Элемент root ${contentRenderId} -- ${rootElement}`);
  }

  rootElement.innerHTML = '';
  const templateElement = document.createElement('div');
  templateElement.innerHTML = compiled(data);
  rootElement.appendChild(templateElement);

  const user = data.user;

  const editButton = document.getElementById('edit-user-info');
  const editButtonAddress = document.getElementById('edit-user-address');

  if (editButton) {
    editButton.addEventListener('click', () => {
      const userData = {
        ...editNameGenderEmailConfig,
        fields: editNameGenderEmailConfig.fields.map((field) => {
          if (field.name === 'name') {
            field.value = user.name;
          } else if (field.name === 'gender') {
            field.selected = user.gender;
          } else if (field.name === 'email') {
            field.value = user.email;
          }
          return field;
        }),
      };

      const options: BuildModalOptions = {
        user,
        triggerElement: 'edit-user-info',
        rootId: 'modal-render',
        modalID: 'modal',
        data: userData,
      };
      openUserEditModal(options);
    });
  }

  if (editButtonAddress) {
    editButtonAddress.addEventListener('click', () => {
      const addressData = {
        ...editAddressConfig,
        fields: editAddressConfig.fields.map((field) => {
          if (field.name === 'address') {
            field.value = user.address;
          }
          return field;
        }),
      };

      const options: BuildModalOptions = {
        user,
        triggerElement: 'edit-user-address',
        rootId: 'modal-render',
        modalID: 'modal',
        data: addressData,
      };
      openUserEditModal(options);
    });
  }

}