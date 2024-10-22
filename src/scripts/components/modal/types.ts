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
      value: 'Иван Иванов',
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
      selected: 'Мужской',
      error_id: 'genderError',
    },
    {
      id: 'user-email',
      label: 'Почта',
      type: 'email',
      name: 'email',
      value: 'example@mail.com',
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
      value: 'Москва, ул. Ленина, д. 1',
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
  btnOpen: string;
  btnClose?: string;
  time?: number;
}

export interface BuildModalOptions {
  user: User;
  triggerElement: string;
  rootId: string;
  modalID: string;
  data: any;
}

