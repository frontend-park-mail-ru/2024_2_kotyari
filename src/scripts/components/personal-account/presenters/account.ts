import { personalAccountData } from '../views/personal-account-config';
import { PersonalAccountPage } from '../views/personal-account';
import { ModalFactory } from '../../modal/views/modal-factory';
import { editAddressConfig, editNameGenderEmailConfig, ModalControllerParams } from '../../modal/views/types';

export class AccountPageBuilder {
    private EDIT_USER_INFO_TRIGGER = 'edit-user-info';
    private EDIT_USER_ADDRESS_TRIGGER = 'edit-user-address';
    private EDIT_USER_BUTTON_CLOSE = '.btn__close';
    private EDIT_USER_ROOTMODALID = 'modal-render';
    private EDIT_USER_MODALID = 'modal';
    private EDIT_USERINFO_TYPE = 'edit_info';
    private EDIT_USERADDRESS_TYPE = 'edit_address';

    private user: any;

    constructor() {
        this.user = personalAccountData.user;
    }

    public async build(): Promise<void> {
        const page = new PersonalAccountPage(personalAccountData);
        await page.render();
        this.setupEditButtons();
    }

    private setupEditButtons(): void {
        const editButton = document.getElementById(this.EDIT_USER_INFO_TRIGGER);
        const editButtonAddress = document.getElementById(this.EDIT_USER_ADDRESS_TRIGGER);

        if (editButton) {
            editButton.addEventListener('click', () => {
                const modalParams: ModalControllerParams = {
                    modal: this.EDIT_USER_MODALID,
                    rootId: this.EDIT_USER_ROOTMODALID,
                    btnOpen: this.EDIT_USER_INFO_TRIGGER,
                    btnClose: this.EDIT_USER_BUTTON_CLOSE,
                };

                ModalFactory.showModal(this.EDIT_USERINFO_TYPE, modalParams, editNameGenderEmailConfig, this.user);
            });
        }

        if (editButtonAddress) {
            editButtonAddress.addEventListener('click', () => {
                const modalParams: ModalControllerParams = {
                    modal: this.EDIT_USER_MODALID,
                    rootId: this.EDIT_USER_ROOTMODALID,
                    btnOpen: this.EDIT_USER_ADDRESS_TRIGGER,
                    btnClose: this.EDIT_USER_BUTTON_CLOSE,
                };

                ModalFactory.showModal(this.EDIT_USERADDRESS_TYPE, modalParams, editAddressConfig, this.user);
            });
        }
    }
}
