/**
 * Интерфейс, описывающий способ оплаты.
 *
 * @interface PaymentMethod
 */
export interface PaymentMethod {
  /**
   * Название метода оплаты.
   * @type {string}
   */
  method: string;

  /**
   * Иконка для метода оплаты.
   * @type {string}
   */
  icon: string;

  /**
   * Указание, выбран ли этот метод оплаты.
   * @type {boolean}
   */
  isSelected: boolean;
}

/**
 * Интерфейс, описывающий данные получателя.
 *
 * @interface Recipient
 */
export interface Recipient {
  /**
   * Адрес доставки.
   * @type {string}
   */
  address: string;

  /**
   * Имя получателя.
   * @type {string}
   */
  recipientName: string;
}

/**
 * Интерфейс, описывающий товар.
 *
 * @interface ProductItem
 */
export interface ProductItem {
  /**
   * Название товара.
   * @type {string}
   */
  productName: string;

  /**
   * Цена товара.
   * @type {number}
   */
  productPrice: number;

  /**
   * Количество товаров.
   * @type {number}
   */
  quantity: number;

  /**
   * Изображение товара.
   * @type {string}
   */
  productImage: string;

  /**
   * Вес товара в килограммах.
   * @type {number}
   */
  weight: number;

  /**
   * Ссылка на страницу товара.
   * @type {string}
   */
  url: string;
}

/**
 * Интерфейс, описывающий дату доставки и список товаров для этой даты.
 *
 * @interface DeliveryDate
 */
export interface DeliveryDate {
  /**
   * Дата доставки в формате строки.
   * @type {string}
   */
  date: string;

  /**
   * Общий вес товаров для этой даты в килограммах.
   * @type {number}
   */
  weight: number;

  /**
   * Список товаров для этой даты.
   * @type {ProductItem[]}
   */
  items: ProductItem[];
}

/**
 * Интерфейс, описывающий данные заказа.
 *
 * @interface OrderData
 */
export interface OrderData {
  /**
   * Общее количество товаров в заказе.
   * @type {number}
   */
  totalItems: number;

  /**
   * Общий вес товаров в заказе в килограммах.
   * @type {number}
   */
  totalWeight: number;

  /**
   * Итоговая стоимость заказа.
   * @type {number}
   */
  finalPrice: number;

  /**
   * Валюта заказа.
   * @type {string}
   */
  currency: string;

  /**
   * Методы оплаты, доступные для этого заказа.
   * @type {PaymentMethod[]}
   */
  paymentMethods: PaymentMethod[];

  /**
   * Данные получателя заказа.
   * @type {Recipient}
   */
  recipient: Recipient;

  /**
   * Массив с датами и списками товаров для доставки.
   * @type {DeliveryDate[]}
   */
  deliveryDates: DeliveryDate[];
}
