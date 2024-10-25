import account from './personal-account.hbs?raw';
import Handlebars from 'handlebars';
import { rootId } from '../../../../services/app/config';
import { BuildModalOptions, editAddressConfig, editNameGenderEmailConfig } from '../../modal/views/types';
import { buildModalWithContent } from '../../modal/views/modal';

export class PersonalAccountPage {
  private MODAL_ROOT_ID = 'modal-render';
  private MODAL_ID = 'modal';
  private EDIT_USER_INFO_TRIGGER = 'edit-user-info';
  private EDIT_USER_ADDRESS_TRIGGER = 'edit-user-address';
  private FIELD_NAME = 'name';
  private FIELD_GENDER = 'gender';
  private FIELD_EMAIL = 'email';
  private FIELD_ADDRESS = 'address';

  // Compile Handlebars template
  private compiled = Handlebars.compile(account);

  constructor(private data: any) {}

  public async render() {
    const rootElement = document.getElementById(rootId) as HTMLElement;
    if (!rootElement) {
      console.error(`Element with id ${rootId} not found`);
      return;
    }

    this.initializeUI(rootElement);

    const user = this.data.user;
    this.setupEditButtons(user);
  }

  private initializeUI(rootElement: HTMLElement) {
    rootElement.innerHTML = '';
    const templateElement = document.createElement('div');
    templateElement.innerHTML = this.compiled(this.data);
    rootElement.appendChild(templateElement);
  }

  private setupEditButtons(user: any) {
    const editButton = document.getElementById(this.EDIT_USER_INFO_TRIGGER);
    const editButtonAddress = document.getElementById(this.EDIT_USER_ADDRESS_TRIGGER);

    if (editButton) {
      this.setupEditUserInfoButton(editButton, user);
    }

    if (editButtonAddress) {
      this.setupEditUserAddressButton(editButtonAddress, user);
    }
  }

  private setupEditUserInfoButton(button: HTMLElement, user: any) {
    button.addEventListener('click', () => {
      const userData = {
        ...editNameGenderEmailConfig,
        fields: editNameGenderEmailConfig.fields.map((field) => {
          if (field.name === this.FIELD_NAME) {
            field.value = user.name;
          } else if (field.name === this.FIELD_GENDER) {
            field.selected = user.gender;
          } else if (field.name === this.FIELD_EMAIL) {
            field.value = user.email;
          }
          return field;
        }),
      };

      const options: BuildModalOptions = {
        user,
        triggerElement: this.EDIT_USER_INFO_TRIGGER,
        rootId: this.MODAL_ROOT_ID,
        modalID: this.MODAL_ID,
        data: userData,
      };

      this.openUserEditModal(options);
    });
  }

  private setupEditUserAddressButton(button: HTMLElement, user: any) {
    button.addEventListener('click', () => {
      const addressData = {
        ...editAddressConfig,
        fields: editAddressConfig.fields.map((field) => {
          if (field.name === this.FIELD_ADDRESS) {
            field.value = user.address;
          }
          return field;
        }),
      };

      const options: BuildModalOptions = {
        user,
        triggerElement: this.EDIT_USER_ADDRESS_TRIGGER,
        rootId: this.MODAL_ROOT_ID,
        modalID: this.MODAL_ID,
        data: addressData,
      };

      this.openUserEditModal(options);
    });
  }

  private openUserEditModal(options: BuildModalOptions) {
    buildModalWithContent(options);
  }
}