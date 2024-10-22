/**
 * Интерфейс для объекта продукта в корзине.
 */
export interface CartProduct {
  id: string; // Уникальный идентификатор товара
  name: string; // Название товара
  cost: number; // Цена товара
  currency: string; // Валюта товара
  image_url: string; // URL изображения товара
  old_cost?: number; // Старая цена (может отсутствовать, поэтому необязательное поле)
  discount?: number; // Процент скидки (может отсутствовать)
  weight: number; // Вес товара в килограммах
  is_liked: boolean; // Статус "добавлено в избранное"
  delivery_date: string; // Дата доставки товара
  quantity: number; // Количество товара
  isSingleItem: boolean; // Флаг, указывающий, что товар единственный в своей категории
  isSelected: boolean; // Флаг, указывающий, выбран ли товар для оформления заказа
  url: string; // URL товара на сайте
}

/**
 * Интерфейс для объекта корзины.
 */
export interface CartData {
  selectedCount: number; // Количество выбранных товаров
  products: CartProduct[]; // Массив продуктов в корзине
}
