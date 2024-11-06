import { backurl } from '../../../../services/app/config';
import { Product, SingleOrder } from '../types/types';

export class SingleOrderApiInterface {
  static transformSingleOrderData(data: any): SingleOrder {
    const products: Product[] = data.products.map((product: any) => ({
      id: product.id,
      cost: product.cost,
      count: product.count,
      image_url: `${backurl}/${product.image_url}`,
      name: product.name,
    }));

    const totalItems = products.reduce((sum, product) => sum + product.count, 0);
    const totalPrice = products.reduce((sum, product) => sum + product.cost * product.count, 0);

    return {
      id: data.id,
      delivery_date: data.delivery_date.split('T')[0],
      order_status: SingleOrderApiInterface.switchOrderStatus(data.status),
      address: data.address,
      recipient: data.recipient,
      totalItems: totalItems,
      totalPrice: totalPrice,
      products: products,
    };
  }

  private static switchOrderStatus(status: string): string {
    switch (status) {
      case 'awaiting_payment':
        return 'Ожидает оплаты';
      case 'paid':
        return 'Оплачен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return '';
    }
  }

  public async getOrderData(orderId: string, deliveryDate: string): Promise<SingleOrder> {
    try {
      const response = await fetch(`${backurl}/order/${orderId}/${deliveryDate}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Ошибка при получении данных: ${response.status}`);
      }

      const data = await response.json();
      const body = data.body; // Данные заказа находятся внутри 'body'

      return SingleOrderApiInterface.transformSingleOrderData(body);
    } catch (error) {
      console.error('Ошибка: ', error);
      throw error;
    }
  }
}