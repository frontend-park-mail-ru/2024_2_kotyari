import {
  PersonalAccountData,
  User,
  DeliveryInfo,
  FavoritesPurchaseInfo,
} from '../types/types';

export const personalAccountData: PersonalAccountData = {
  user: {
    name: 'Иван Иванов',
    photoUrl:
      'https://img07.rl0.ru/afisha/e-x750i/daily.afisha.ru/uploads/images/2/8c/28c81955037105a0d07239d34f039295.jpg',
    gender: 'Мужской',
    email: 'ivan@example.com',
    notifications: true,
    address: '2-я Бауманская, 5',
  },
  deliveryInfo: [
    {
      class: 'account__delivery-info',
      iconClass: 'account__local-shipping',
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
      iconClass: 'account__pin-drop',
      icon: 'pin_drop',
      detailsClass: 'account__address-details',
      titleClass: 'account__address-title',
      textClass: 'account__address-text',
      title: 'Адрес доставки',
      text: '2-я Бауманская, 5',
      editable: true,
    },
  ],
  rightColumnInfo: [
    {
      class: 'account__favorites-info',
      iconClass: 'account__favorite',
      icon: 'favorite_outline',
      detailsClass: 'account__favorites-details',
      titleClass: 'account__favorites-title',
      textClass: 'account__favorites-text',
      title: 'Избранное',
      text: '5 товаров в наличии',
    },
    {
      class: 'account__purchases-info',
      iconClass: 'account__shopping-basket',
      icon: 'shopping_basket',
      detailsClass: 'account__purchases-details',
      titleClass: 'account__purchases-title',
      textClass: 'account__purchases-text',
      title: 'Покупки',
      text: 'Смотреть',
    },
  ],
};
