import {
  PersonalAccountData,
  User,
  DeliveryInfo,
  FavoritesPurchaseInfo,
} from './types/types';

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
      class: 'delivery-info',
      iconClass: 'local-shipping',
      icon: 'local_shipping',
      detailsClass: 'delivery-details',
      titleClass: 'delivery-title',
      textClass: 'status-text',
      title: 'Доставка',
      text: 'Ближайшая не ожидается',
      editable: false,
    },
    {
      class: 'address-info',
      iconClass: 'pin-drop',
      icon: 'pin_drop',
      detailsClass: 'address-details',
      titleClass: 'address-title',
      textClass: 'address-text',
      title: 'Адрес доставки',
      text: '2-я Бауманская, 5',
      editable: true,
    },
  ],
  rightColumnInfo: [
    {
      class: 'favorites-info',
      iconClass: 'favorite',
      icon: 'favorite_outline',
      detailsClass: 'favorites-details',
      titleClass: 'favorites-title',
      textClass: 'favorites-text',
      title: 'Избранное',
      text: '5 товаров в наличии',
    },
    {
      class: 'purchases-info',
      iconClass: 'shopping-basket',
      icon: 'shopping_basket',
      detailsClass: 'purchases-details',
      titleClass: 'purchases-title',
      textClass: 'purchases-text',
      title: 'Покупки',
      text: 'Смотреть',
    },
  ],
};
