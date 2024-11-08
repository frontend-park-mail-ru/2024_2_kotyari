import { Order, OrderProduct } from '../types/types';
import { backurl } from '../../../../services/app/config';
import { getWithCred } from '../../../../services/api/without-csrf';

export class OrderListApiInterface {
  static transformOrderData(orders: any[]): Order[] {
    return orders.map((order: any) => {
      const transformedProducts: OrderProduct[] = order.products.slice(0, 3).map((product: any) => ({
        id: product.id,
        image_url: `${backurl}/${product.image_url}`,
        title: product.name,
      }));

      return {
        id: order.id,
        delivery_date: order.delivery_date.split('T')[0],
        delivery_date_req: order.delivery_date,
        order_date: order.order_date.split('T')[0],
        total_price: order.total_price,
        status: OrderListApiInterface.switchOrderStatus(order.status),
        products: transformedProducts,
      };
    });
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

  public async getOrderData(): Promise<Order[]> {
    return getWithCred(`${backurl}/orders`)
      .then(data => {
        switch (data.status) {
          case 200:
            const orders = data.body.orders;

            return OrderListApiInterface.transformOrderData(orders);
          default:
            throw new Error(`Ошибка при получении данных: ${data.status} - ${data.body.error_message}`);
        }
      });
  }
}