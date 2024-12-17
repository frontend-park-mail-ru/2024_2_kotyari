import { AccountAPI, UserData } from '../api/personal-account';
import { AccountView } from '../views/account';
import { PersonalDataModal } from '../../modal/presenters/modal-personal';
import { AddressModal } from '../../modal/presenters/modal-address';
import { backurl } from '../../../../services/app/config';
import { storageUser } from '../../../../services/storage/user';
import { updateAfterAuth } from '../../../layouts/body';
import { csrf } from '../../../../services/api/CSRFService';
import { ChangePasswordModal } from '../../modal/presenters/change-password';

export class AccountPresenter {
  private accountAPI: AccountAPI;
  private view: AccountView;
  private userData: UserData | undefined;
  private deliveryInfo: Array<any> | undefined;
  private rightColumnInfo: Array<any> | undefined;

  constructor(apiBaseUrl: string, rootId: string) {
    this.accountAPI = new AccountAPI(apiBaseUrl);
    this.view = new AccountView(rootId);

    this.view.onEditAvatarClick = this.handleEditAvatar.bind(this);
    this.view.onEditUserInfoClick = this.handleEditUserInfo.bind(this);
    this.view.onEditAddressClick = this.handleEditAddress.bind(this);
    this.view.onChangePasswordClick = this.changePassword.bind(this);
  }


  private changePassword() {
    const changePasswordModal = new ChangePasswordModal(
      { modal: 'change-password-modal', rootId: 'modal-render', btnOpen: 'change-password' },
      console.log,
    );
  }

  public async initialize() {
    try {
      await csrf.refreshToken();

      this.userData = await this.accountAPI.fetchUserData();

      this.userData.avatar_url = `${backurl}/${this.userData.avatar_url}`;

      this.deliveryInfo = await this.buildDeliveryInfo(this.userData);
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

  private async buildDeliveryInfo(userData: UserData) {
    const addressText =
      [
        userData.Address?.address?.trim(),
      ]
        .filter(Boolean)
        .join(', ') || 'Добавьте адресс';

    const msg = await this.accountAPI.getNearestDeliveryDate();

    return [
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
      },
      {
        class: 'account__delivery-info',
        iconClass: ' account__local-shipping',
        icon: 'local_shipping',
        detailsClass: 'account__delivery-details',
        titleClass: 'account__delivery-title',
        textClass: 'account__status-text',
        title: 'Доставка',
        text: msg,
        editable: false,
      },
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
        title: 'Вишлисты',
        text: 'Смотреть',
        href: '/wishlists',
      },
      {
        class: 'account__purchases-info',
        iconClass: ' account__shopping-basket',
        icon: 'shopping_basket',
        detailsClass: 'account__purchases-details',
        titleClass: 'account__purchases-title',
        textClass: 'account__purchases-text',
        title: 'Заказы',
        text: 'Смотреть',
        href: '/order_list',
      },
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
          let newAvatarUrl = await this.accountAPI.updateAvatar(file);
          newAvatarUrl = `${backurl}/${newAvatarUrl}`;

          this.userData!.avatar_url = `${backurl}/${newAvatarUrl}`;
          this.view.updateAvatar(newAvatarUrl);
        } catch (error) {
          const errorMessage = this.parseError(error);

          this.view.displayErrorMessage(errorMessage);
        }
      }
    });

    fileInput.click();
  }

  private parseError(error: any): string {
    return error.body.error_message;
  }

  private async handleEditUserInfo() {
    const userDataRecord: Record<string, string> = {
      username: this.userData!.username,
      gender: this.userData!.gender,
      email: this.userData!.email,
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

        storageUser.changeUsername(this.userData.username);
        updateAfterAuth(storageUser.getUserData());
      },
    );

    userInfoModal.open();
  }

  private async handleEditAddress() {
    const addressRecord: Record<string, string> = {
      address: this.userData!.Address.address,
    };

    const addressModal = new AddressModal(
      { modal: 'edit-address-modal', rootId: 'modal-render', btnOpen: 'edit-user-address' },
      addressRecord,
      (updatedAddress) => {
        this.userData!.Address = { ...this.userData!.Address, ...updatedAddress };

        console.log(this.userData!.Address );

        this.view.updateAddress(this.userData!.Address.address);

        storageUser.changeCity(this.userData!.Address.address);
        updateAfterAuth(storageUser.getUserData());
      },
    );
    addressModal.open();
  }


}
