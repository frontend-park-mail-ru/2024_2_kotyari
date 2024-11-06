
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
  title: 'Редактировать информацию',
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
  title: 'Редактировать адрес',
  formId: 'address-edit-form',
  fields: [
    {
      id: 'user-city',
      label: 'Город',
      type: 'text',
      name: 'city',
      value: '',
      error_id: 'city-error',
    },
    {
      id: 'user-street',
      label: 'Улица',
      type: 'text',
      name: 'street',
      value: '',
      error_id: 'street-error',
    },
    {
      id: 'user-house',
      label: 'Дом',
      type: 'text',
      name: 'house',
      value: '',
      error_id: 'house-error',
    },
    {
      id: 'user-flat',
      label: 'Квартира',
      type: 'text',
      name: 'flat',
      value: '',
      error_id: 'flat-error',
    }
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
