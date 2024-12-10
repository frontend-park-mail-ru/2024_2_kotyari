import { backurl } from '../../../../services/app/config';
import { Product, SingleOrder } from '../types/types';
import { getWithCred } from '../../../../services/api/without-csrf';

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
        return 'Что-то сломалось... Попробуйте позже';
    }
  }

  public getOrderData(orderId: string): Promise<SingleOrder> {
    return getWithCred(`${backurl}/order/${orderId}`)
      .then(res => {
        switch (res.status) {
          case 200:
            // console.log(res.body);

            return SingleOrderApiInterface.transformSingleOrderData(res.body);
          default:
            throw new Error(`Ошибка при получении данных: ${res.status} - ${res.body}`);
        }
      })
      .catch(err => {
        // console.error('Ошибка: ', err);
        throw err;
      })
  }
}