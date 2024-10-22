/**
 * Объект `orderList` описывает структуру страницы списка заказов.
 *
 * @namespace orderList
 * @property {string} id - Идентификатор контейнера для списка заказов.
 * @property {string} title - Заголовок страницы списка заказов.
 * @property {Object[]} orders - Массив объектов, описывающих заказы.
 * @property {string} orders[].date - Дата оформления заказа.
 * @property {string} orders[].status - Статус заказа.
 * @property {string} orders[].total - Итоговая стоимость заказа.
 * @property {Object[]} orders[].items - Массив объектов, описывающих товары в заказе.
 * @property {string} orders[].items[].name - Название товара.
 * @property {string} orders[].items[].image - URL изображения товара.
 * @property {Object} reviewButton - Объект, описывающий кнопку для оценки товаров.
 * @property {string} reviewButton.text - Текст кнопки.
 */
export const orderList = {
  id: 'order-list-container',
  title: 'Мои заказы',
  orders: [
    {
      id: '1',
      date: '8 октября',
      status: 'Вы получили 9 октября',
      total: '12 345',
      items: [
        {
          name: 'Робот пылесос',
          image:
            'https://sun9-27.userapi.com/impg/n4x2LZ7IpCfYgOAYedj3wkDaVS2CF1aATpCVDQ/0D8LB0AiXNs.jpg?size=1000x1000&quality=95&sign=9478ab570b9f6735a2536ec4cabf7777&type=album',
        },
        {
          name: 'Лонглслив Cave',
          image:
            'https://sun9-7.userapi.com/impg/H_hFnufaf39UnwPmjsDBfVubEVr0KEVQvivSPQ/hOQU4EEcmEQ.jpg?size=750x1000&quality=95&sign=3316458ee12ef8b56ee560f7d07e2ece&type=album',
        },
      ],
    },
    {
      id: '2',
      date: '10 октября',
      status: 'Вы получили 11 октября',
      total: '7 890',
      items: [
        {
          name: 'Кроссовки ASICS',
          image:
            'https://sun9-25.userapi.com/impg/dsKDTkLYpWXfVMYj_21Rn7CESXspaL3zrXGF3A/riTPmwVCVaw.jpg?size=750x1000&quality=95&sign=3f49cd35acc30ab4f3dea29e4e0540d6&type=album',
        },
        {
          name: 'Посудомоечная машина',
          image:
            'https://sun9-62.userapi.com/impg/Pn7njR824gsUONsgRhuLCoGhQp1eSwzs21A0JQ/OW-FgCP2ZQU.jpg?size=440x440&quality=95&sign=05605d495f05bf373368e5d31dcf1900&type=album',
        },
      ],
    },
  ],
  reviewButton: {
    text: 'Оцените товары',
  },
};
