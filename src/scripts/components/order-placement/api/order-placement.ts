import { OrderData } from '../types/types';

export const orderData: OrderData = {
  totalItems: 3,
  totalWeight: 10.3,
  finalPrice: 4500,
  currency: '₽',
  paymentMethods: [
    {
      method: 'Картой',
      icon: 'credit_card',
      isSelected: true,
    },
    {
      method: 'Наличными',
      icon: 'payments',
      isSelected: false,
    },
  ],
  recipient: {
    address: 'г. Москва, 2-я Бауманская ул., 5',
    recipientName: 'Иван Иванов',
  },
  deliveryDates: [
    {
      date: '2024-10-08',
      weight: 10,
      items: [
        {
          productName: 'Кроссовки ASICS',
          productPrice: 2473,
          quantity: 3,
          productImage:
            'https://sun9-25.userapi.com/impg/dsKDTkLYpWXfVMYj_21Rn7CESXspaL3zrXGF3A/riTPmwVCVaw.jpg?size=750x1000&quality=95&sign=3f49cd35acc30ab4f3dea29e4e0540d6&type=album',
          weight: 0.2,
          url: '/catalog/product/1',
        },
        {
          productName: 'Lydsto Робот-пылесос G1, белый',
          productPrice: 8099,
          quantity: 1,
          productImage:
            'https://sun9-27.userapi.com/impg/n4x2LZ7IpCfYgOAYedj3wkDaVS2CF1aATpCVDQ/0D8LB0AiXNs.jpg?size=1000x1000&quality=95&sign=9478ab570b9f6735a2536ec4cabf7777&type=album',
          weight: 2.4,
          url: '/catalog/product/2',
        },
      ],
    },
    {
      date: '2024-10-09',
      weight: 5,
      items: [
        {
          productName: 'Посудомоечная машина встраиваемая',
          productPrice: 31513,
          quantity: 1,
          productImage: '/images/shtanga.jpg',
          weight: 23.1,
          url: '/catalog/product/3',
        },
      ],
    },
  ],
};
