import { AccountAPI, UserData } from '../api/personal-account';
import { AccountView } from '../views/account';
import { PersonalDataModal } from '../../modal/presenters/modal-personal';
import { AddressModal } from '../../modal/presenters/modal-address';
import { editAddressConfig, editNameGenderEmailConfig } from '../../modal/views/types';
import { backurl } from '../../../../services/app/config';


export class AccountPresenter {
  private accountAPI: AccountAPI;
  private view: AccountView;
  private userData: UserData;
  private deliveryInfo: Array<any>;
  private rightColumnInfo: Array<any>;

  constructor(apiBaseUrl: string, rootId: string) {
    this.accountAPI = new AccountAPI(apiBaseUrl);
    this.view = new AccountView(rootId);

    this.view.onEditAvatarClick = this.handleEditAvatar.bind(this);
    this.view.onEditUserInfoClick = this.handleEditUserInfo.bind(this);
    this.view.onEditAddressClick = this.handleEditAddress.bind(this);
  }

  public async initialize() {
    try {
      this.userData = await this.accountAPI.fetchUserData();
      this.userData.avatar_url = `${backurl}/${this.userData.avatar_url}`;

      this.deliveryInfo = this.buildDeliveryInfo(this.userData);
      this.rightColumnInfo = this.buildRightColumnInfo();

      this.view.render({
        ...this.userData,
        deliveryInfo: this.deliveryInfo,
        rightColumnInfo: this.rightColumnInfo,
      });
    } catch (error) {
      console.error('Failed to initialize account data:', error);
    }
  }

  private buildDeliveryInfo(userData: UserData) {
    const addressText = `${userData.Address.city}, ул.${userData.Address.street}, д.${userData.Address.house}, кв.${userData.Address.flat}`;

    return [
      {
        class: 'account__delivery-info',
        iconClass: ' account__local-shipping',
        icon: 'local_shipping',
        detailsClass: 'account__delivery-details',
        titleClass: 'account__delivery-title',
        textClass: 'account__status-text',
        title: 'Доставка',
        text: 'Ближайшая не ожидается',
        editable: false,
      },
      {
        class: 'account__address-info',
        iconClass: ' account__pin-drop',
        icon: 'pin_drop',
        detailsClass: 'account__address-details',
        titleClass: 'account__address-title',
        textClass: 'account__address-text',
        title: 'Адрес доставки',
        text: addressText,
        editable: true,
      }
    ];
  }

  private buildRightColumnInfo() {
    return [
      {
        class: 'account__favorites-info',
        iconClass: ' account__favorite',
        icon: 'favorite_outline',
        detailsClass: 'account__favorites-details',
        titleClass: 'account__favorites-title',
        textClass: 'account__favorites-text',
        title: 'Избранное',
        text: 'скоро',
        href: '/soon'
      },
      {
        class: 'account__purchases-info',
        iconClass: ' account__shopping-basket',
        icon: 'shopping_basket',
        detailsClass: 'account__purchases-details',
        titleClass: 'account__purchases-title',
        textClass: 'account__purchases-text',
        title: 'Покупки',
        text: 'Смотреть',
        href: '/order_list',
      }
    ];
  }

  private async handleEditAvatar() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0] || null;
      if (file) {
        try {
          const newAvatarUrl = await this.accountAPI.updateAvatar(file);
          this.view.updateAvatar(newAvatarUrl);
        } catch (error) {
          console.error('Failed to upload avatar:', error);
        }
      }
    });

    fileInput.click();
  }

  private async handleEditUserInfo() {
    const userDataRecord: Record<string, string> = {
      name: this.userData.username,
      gender: this.userData.gender,
      email: this.userData.email,
    };

    const userInfoModal = new PersonalDataModal(
      { modal: 'edit-user-modal', rootId: 'modal-render', btnOpen: 'edit-user-info' },
      userDataRecord,
      (updatedUser) => {
        this.userData = { ...this.userData, ...updatedUser };
        this.view.render({
          ...this.userData,
          deliveryInfo: this.deliveryInfo,
          rightColumnInfo: this.rightColumnInfo,
        });
      }
    );

    userInfoModal.open();
  }

  private async handleEditAddress() {
    const addressRecord: Record<string, string> = {
      city: this.userData.Address.city,
      street: this.userData.Address.street,
      house: this.userData.Address.house,
      flat: this.userData.Address.flat,
    };

    const addressModal = new AddressModal(
      { modal: 'edit-address-modal', rootId: 'modal-render', btnOpen: 'edit-user-address' },
      addressRecord,
      (updatedAddress) => {
        this.userData.Address = { ...this.userData.Address, ...updatedAddress };
        this.view.updateAddress(this.userData.Address);
      }
    );
    addressModal.open();
  }
}