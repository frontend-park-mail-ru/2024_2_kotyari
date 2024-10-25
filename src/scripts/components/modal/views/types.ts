import { personalAccountData } from '../../personal-account/views/personal-account-config';

export const editNameGenderEmailConfig = {
  id: 'edit_info',
  title: 'Редактировать информацию',
  formId: 'user-edit-form',
  fields: [
    {
      id: 'user-name',
      label: 'Имя',
      type: 'text',
      name: 'name',
      value: personalAccountData.user.name,
      error_id: 'nameError',
    },
    {
      id: 'user-gender',
      label: 'Пол',
      type: 'select',
      name: 'gender',
      options: [
        { value: 'Мужской', label: 'Мужской' },
        { value: 'Женский', label: 'Женский' },
      ],
      selected: personalAccountData.user.gender,
      error_id: 'genderError',
    },
    {
      id: 'user-email',
      label: 'Почта',
      type: 'email',
      name: 'email',
      value: personalAccountData.user.email,
      error_id: 'emailError',
    },
  ],
  submitText: 'Сохранить изменения',
};

export const editAddressConfig = {
  id: 'edit_address',
  title: 'Редактировать адрес',
  formId: 'address-edit-form',
  fields: [
    {
      id: 'user-address',
      label: 'Адрес',
      type: 'text',
      name: 'address',
      value: personalAccountData.user.address,
      error_id: 'addressError',
    },
  ],
  submitText: 'Сохранить изменения',
};

export interface User {
  name: string;
  gender: string;
  email: string;
  address: string;
}

export interface ModalControllerParams {
  modal: string;
  rootId: string;
  btnOpen: string;
  btnClose?: string;
  time?: number;
}
