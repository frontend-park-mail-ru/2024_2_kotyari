import Handlebars from 'handlebars';
import accountTemplate from './personal-account.hbs'; // Assuming correct import path
import { UserData } from '../api/personal-account';

export class AccountView {
  private readonly rootId: string;
  private readonly compiledTemplate: HandlebarsTemplateDelegate;
  private rootElement: HTMLElement | null;

  public onEditAvatarClick?: () => void;
  public onEditUserInfoClick?: () => void;
  public onEditAddressClick?: () => void;

  constructor(rootId: string) {
    this.rootId = rootId;

    this.compiledTemplate = Handlebars.compile(accountTemplate);
  }

  public render(data: UserData & { deliveryInfo: Array<any>; rightColumnInfo: Array<any>  }) {
    this.rootElement = document.getElementById(this.rootId);
    if (!this.rootElement) {
      console.error(`Root element with id ${this.rootId} not found`);
      return;
    }
    this.rootElement.innerHTML = this.compiledTemplate(data);
    this.setupListeners();
  }

  public updateAvatar(newAvatarUrl: string) {
    this.rootElement = document.getElementById(this.rootId);
    if (!this.rootElement){
      console.error(this.rootElement, 'not found');
      return;
    }

    const avatarElement = this.rootElement.querySelector('.account__user-photo') as HTMLImageElement;
    if (avatarElement) {
      avatarElement.src = newAvatarUrl;
    }
  }

  public updateAddress(address: UserData['Address']) {
    this.rootElement = document.getElementById(this.rootId);
    if (!this.rootElement){
      console.error(this.rootElement, 'not found');
      return;
    }

    const addressElement = this.rootElement.querySelector('.account__address-details .account__address-text');
    if (addressElement) {
      addressElement.textContent = `${address.city}, ${address.street}, ${address.house}, ${address.flat}`;
    }
  }

  private setupListeners() {
    this.rootElement = document.getElementById(this.rootId);
    if (!this.rootElement){
      console.error(this.rootElement, 'not found');
      return;
    }

    const editAvatarButton = this.rootElement.querySelector('.account__avatar-container');
    if (editAvatarButton) {
      editAvatarButton.addEventListener('click', () => {
        if (this.onEditAvatarClick) this.onEditAvatarClick();
      });
    }

    const editUserInfoButton = this.rootElement.querySelector('#edit-user-info');
    if (editUserInfoButton) {
      editUserInfoButton.addEventListener('click', () => {
        if (this.onEditUserInfoClick) this.onEditUserInfoClick();
      });
    }

    const editAddressButton = this.rootElement.querySelector('#edit-user-address');
    if (editAddressButton) {
      editAddressButton.addEventListener('click', () => {
        if (this.onEditAddressClick) this.onEditAddressClick();
      });
    }
  }
}