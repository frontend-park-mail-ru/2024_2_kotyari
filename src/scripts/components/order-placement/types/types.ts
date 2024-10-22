export interface PaymentMethod {
  method: string; // Название метода оплаты
  icon: string; // Иконка для метода оплаты
  isSelected: boolean; // Указание, выбран ли этот метод оплаты
}

export interface Recipient {
  address: string; // Адрес доставки
  recipientName: string; // Имя получателя
}

export interface ProductItem {
  productName: string; // Название товара
  productPrice: number; // Цена товара
  quantity: number; // Количество товаров
  productImage: string; // Изображение товара
  weight: number; // Вес товара
}

export interface DeliveryDate {
  date: string; // Дата доставки
  weight: number; // Общий вес товаров для этой даты
  items: ProductItem[]; // Список товаров для этой даты
}

export interface OrderData {
  totalItems: number; // Количество товаров
  totalWeight: number; // Общий вес в килограммах
  finalPrice: number; // Общая стоимость
  currency: string; // Валюта
  paymentMethods: PaymentMethod[]; // Методы оплаты
  recipient: Recipient; // Данные получателя
  deliveryDates: DeliveryDate[]; // Массив с датами и товарами для доставки
}
