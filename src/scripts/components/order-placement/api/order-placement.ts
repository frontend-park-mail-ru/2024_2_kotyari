import { backurl } from '../../../../services/app/config';
import { ORDER_PLACEMENT_URLS } from './config';
import { OrderData } from '../types/types';
import { getWithCred } from '../../../../services/api/without-csrf';
import { csrf } from '../../../../services/api/CSRFService';

export class OrderPlacementApiInterface {
  /**
   * Получение данных о продуктах в корзине.
   *
   * @returns {Promise<OrderData>} Возвращает данные корзины.
   */
  static async getCartProducts(): Promise<OrderData> {
    return getWithCred(`${backurl}${ORDER_PLACEMENT_URLS.getCartProducts.route}`)
      .then(res => {
        switch (res.status) {
          case 200:
            return this.transformCartData(res.body) as OrderData;
          default:
            throw new Error(`${res.status} - ${res.body.error_message}`);
        }
      })
      .catch(err => {
        // console.error('Ошибка получения данных: ', err);
        throw err;
      });
  }

  /**
   * Получение данных о продуктах в корзине с применением промокода.
   *
   * @returns {Promise<OrderData>} Возвращает данные корзины.
   */
  static async getCartProductsWithPromocode(promocode: string): Promise<OrderData> {
    return getWithCred(`${backurl}${ORDER_PLACEMENT_URLS.getCartProductsWithPromocode.route}${promocode}`)
        .then(res => {
          switch (res.status) {
            case 200:
              return this.transformCartData(res.body) as OrderData;
            default:
              throw new Error(`${res.status} - ${res.body.error_message}`);
          }
        })
        .catch(err => {
          // console.error('Ошибка получения данных: ', err);
          throw err;
        });
  }

  /**
   * Обновление выбранного метода оплаты.
   *
   * @param {string} paymentMethod - Название метода оплаты ("Наличными" или "Картой").
   * @returns {Promise<void>}
   */
  static updatePaymentMethod(paymentMethod: string): Promise<void> {
    return csrf.patch(`${backurl}${ORDER_PLACEMENT_URLS.updatePaymentMethod.route}`, { payment_method: paymentMethod })
      .then(res => {
        switch (res.status) {
          case 200:
            return;
          default:
            throw new Error(`Ошибка обновления метода оплаты: ${res.status} - ${res.body.error_message}`);
        }
      })
      .catch(error => {
        // console.error('Ошибка:', error);
        throw error;
      });
  }

  /**
   * Размещает заказ, отправляя запрос на сервер, и перенаправляет на страницу заказов.
   *
   * @async
   * @returns {Promise<void>} Промис без возвращаемого значения.
   */
  public static async placeOrder(address: string, promo: string): Promise<void> {
    // console.log(address);

    return csrf.post(`${backurl}${ORDER_PLACEMENT_URLS.placeOrder.route}`, { address: address, promocode: promo })
      .then(res => {
        // console.log(res.status, res.body);

        switch (res.status) {
          case 200:
            return {status: res.status, body: {id: res.body.id, order_date: res.body.order_date}};
          default:
            throw new Error(`${res.status} - ${res.body.error_message}`);
        }
      })
      .catch(err => {
        // console.error('Ошибка при отправке заказа:', err);
      });
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
          productImage: `${backurl}\\${item.product_image}`,
          weight: item.weight,
          url: item.url,
        })),
      })),
      promoStatus: data.promo_status
    };
  }
}
