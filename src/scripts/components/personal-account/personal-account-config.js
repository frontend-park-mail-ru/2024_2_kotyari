export const personalAccountData = {
  user: {
    name: 'Иван Иванов',
    photoUrl:
      'https://img07.rl0.ru/afisha/e-x750i/daily.afisha.ru/uploads/images/2/8c/28c81955037105a0d07239d34f039295.jpg',
    gender: 'Мужской',
    email: 'ivan@example.com',
    notifications: true,
  },
  deliveryInfo: [
    {
      class: 'delivery-info',
      iconClass: 'local-shipping',
      icon: 'local_shipping',
      detailsClass: 'delivery-details',
      titleClass: 'delivery-title',
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
      title: 'Адрес доставки',
      text: 'Адреса доставки для пользователя',
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
      title: 'Избранное',
      text: '5 товаров в наличии',
    },
    {
      class: 'purchases-info',
      iconClass: 'shopping-basket',
      icon: 'shopping_basket',
      detailsClass: 'purchases-details',
      titleClass: 'purchases-title',
      title: 'Покупки',
      text: 'Смотреть',
    },
  ],
};
