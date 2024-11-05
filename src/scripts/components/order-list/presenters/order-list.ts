import { OrderListApiInterface } from '../api/order-list';
import { OrderListView } from '../views/order-list';
import { Order } from '../types/types';

export class OrderListPresenter {
  private orderListApi: OrderListApiInterface;
  private orderListView: OrderListView;
  private orderData: Order[];

  constructor(rootId: string) {
    this.orderListApi = new OrderListApiInterface();
    this.orderListView = new OrderListView(rootId);
  }

  public async initialize() {
    try {
      this.orderData = await this.orderListApi.getOrderData()
      this.orderListView.render(this.orderData);
    } catch (error) {
      console.error('Не удалось инициализировать заказ', error)
    }
  }
}