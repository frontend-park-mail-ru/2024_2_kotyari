import { OrderProduct, Order } from '../types/types'
import { backurl } from '../../../../services/app/config';

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
    try {
      const response = await fetch(`${backurl}/orders`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Ошибка при получении данных: ${response.status}`);
      }

      const data = await response.json();
      const orders = data.body.orders;

      return OrderListApiInterface.transformOrderData(orders);
    } catch (error) {
      console.error('Ошибка: ', error);
      throw error;
    }
  }

}