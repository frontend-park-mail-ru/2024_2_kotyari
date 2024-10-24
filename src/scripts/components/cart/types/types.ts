/**
 * Интерфейс для объекта продукта в корзине.
 *
 * @interface CartProduct
 */
export interface CartProduct {
  /**
   * Уникальный идентификатор товара.
   * @type {string}
   */
  id: string;

  /**
   * Название товара.
   * @type {string}
   */
  name: string;

  /**
   * Цена товара.
   * @type {number}
   */
  cost: number;

  /**
   * Валюта товара (например, "₽", "$").
   * @type {string}
   */
  currency: string;

  /**
   * URL изображения товара.
   * @type {string}
   */
  image_url: string;

  /**
   * Старая цена товара (если есть).
   * @type {number | undefined}
   */
  old_cost?: number;

  /**
   * Процент скидки на товар (если присутствует).
   * @type {number | undefined}
   */
  discount?: number;

  /**
   * Вес товара в килограммах.
   * @type {number}
   */
  weight: number;

  /**
   * Флаг, указывающий, добавлен ли товар в избранное.
   * @type {boolean}
   */
  is_liked: boolean;

  /**
   * Дата доставки товара в формате строки (например, "2024-10-24").
   * @type {string}
   */
  delivery_date: string;

  /**
   * Количество данного товара в корзине.
   * @type {number}
   */
  quantity: number;

  /**
   * Флаг, указывающий, является ли товар единственным в своей категории.
   * @type {boolean}
   */
  isSingleItem: boolean;

  /**
   * Флаг, указывающий, выбран ли товар для оформления заказа.
   * @type {boolean}
   */
  isSelected: boolean;

  /**
   * URL товара на сайте.
   * @type {string}
   */
  url: string;
}

/**
 * Интерфейс для объекта корзины.
 *
 * @interface CartData
 */
export interface CartData {
  /**
   * Количество выбранных товаров в корзине.
   * @type {number}
   */
  selectedCount: number;

  /**
   * Массив продуктов, находящихся в корзине.
   * @type {CartProduct[]}
   */
  products: CartProduct[];
}
