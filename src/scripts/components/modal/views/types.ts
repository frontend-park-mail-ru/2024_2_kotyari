
export interface ModalField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select';
  name: string;
  value?: string;
  error_id: string;
  options?: { value: string; label: string }[];
  selected?: string;
}


export const editNameGenderEmailConfig = {
  id: 'edit_info',
  title: 'Редактировать',
  formId: 'user-edit-form',
  fields: [
    {
      id: 'user-name',
      label: 'Имя',
      type: 'text',
      name: 'username',
      value: '',
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
      type: 'text',
      name: 'email',
      value: '',
      error_id: 'emailError',
    },
  ] as ModalField[],
  submitText: 'Сохранить изменения',
};

export const editAddressConfig = {
  id: 'edit_address',
  title: 'Редактировать',
  formId: 'address-edit-form',
  fields: [
    {
      id: 'user-address',
      label: 'Введите ваш адрес',
      type: 'text',
      name: 'address',
      value: '',
      error_id: 'city-error',
    },
  ],
  submitText: 'Сохранить изменения',
};

export interface ModalControllerParams {
  modal: string;
  rootId: string;
  btnOpen: string;
  btnClose?: string;
  time?: number;
}
