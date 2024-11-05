import { backurl } from "../../../../services/app/config";
import { ORDER_PLACEMENT_URLS } from "./config";
import { OrderData } from '../types/types';
import { router } from '../../../../services/app/init';

export class OrderPlacementApiInterface {
  /**
   * Получение данных о продуктах в корзине.
   *
   * @returns {Promise<OrderData>} Возвращает данные корзины.
   */
  static async getCartProducts(): Promise<OrderData> {
    try {
      const response = await fetch(`${backurl}${ORDER_PLACEMENT_URLS.getCartProducts.route}`, {
        method: ORDER_PLACEMENT_URLS.getCartProducts.method,
        credentials: 'include',
        headers: ORDER_PLACEMENT_URLS.getCartProducts.headers,
      });

      if (!response.ok) {
        throw new Error(`Ошибка получения данных: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCartData(data.body);
    } catch (error) {
      console.error('Ошибка:', error);
      throw error;
    }
  }

  /**
   * Обновление выбранного метода оплаты.
   *
   * @param {string} paymentMethod - Название метода оплаты ("Наличными" или "Картой").
   * @returns {Promise<void>}
   */
  static async updatePaymentMethod(paymentMethod: string): Promise<void> {
    try {
      const response = await fetch(`${backurl}${ORDER_PLACEMENT_URLS.updatePaymentMethod.route}`, {
        method: ORDER_PLACEMENT_URLS.updatePaymentMethod.method,
        credentials: 'include',
        headers: ORDER_PLACEMENT_URLS.updatePaymentMethod.headers,
        body: JSON.stringify({ payment_method: paymentMethod }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка обновления метода оплаты: ${response.status}`);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      throw error;
    }
  }

  /**
   * Размещает заказ, отправляя запрос на сервер, и перенаправляет на страницу заказов.
   *
   * @async
   * @returns {Promise<void>} Промис без возвращаемого значения.
   */
  public static async placeOrder(): Promise<void> {
    try {
      const response = await fetch(`${backurl}${ORDER_PLACEMENT_URLS.placeOrder.route}`, {
        method: ORDER_PLACEMENT_URLS.placeOrder.method,
        credentials: 'include',
        headers: ORDER_PLACEMENT_URLS.placeOrder.headers,
        body: JSON.stringify({
          address: 'sdffds',
        }),
      });

      if (response.ok) {
        router.navigate('/order_list'); // Перенаправление на страницу заказов
      } else {
        console.error('Ошибка при размещении заказа:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
    }
  }

  /**
   * Преобразование данных корзины в нужный формат.
   *
   * @param {any} data - Данные корзины
   * @returns {OrderData} Преобразованные данные корзины.
   */
  private static transformCartData(data: any): OrderData {
    return {
      totalItems: data.total_items,
      totalWeight: data.total_weight,
      finalPrice: data.final_price,
      currency: data.currency,
      paymentMethods: data.payment_methods.map((method: any) => ({
        method: method.method,
        icon: method.icon,
        isSelected: method.is_selected,
      })),
      recipient: {
        address: data.recipient.address,
        recipientName: data.recipient.recipient_name,
      },
      deliveryDates: data.delivery_dates.map((dateObj: any) => ({
        date: dateObj.date,
        weight: dateObj.weight,
        items: dateObj.items.map((item: any) => ({
          productName: item.product_name,
          productPrice: item.product_price,
          quantity: item.quantity,
          productImage: item.product_image,
          weight: item.weight,
          url: item.url,
        })),
      })),
    };
  }
}
