import { SingleOrderApiInterface } from '../api/single-order';
import { SingleOrderView } from '../view/single-order';
import { SingleOrder } from '../types/types';
import { router } from '../../../../services/app/init';

export class SingleOrderPresenter {
  private singleOrderApi: SingleOrderApiInterface;
  private singleOrderView: SingleOrderView;
  private orderData: SingleOrder;

  constructor(rootId: string) {
    this.singleOrderApi = new SingleOrderApiInterface();
    this.singleOrderView = new SingleOrderView(rootId);
  }

  public async initialize():Promise<void> {
    try {
      const keys = router.getRouteParams();
      if (keys === null) {
        return
      }

      const orderId = keys["id"];

      this.orderData = await this.singleOrderApi.getOrderData(orderId);
      this.singleOrderView.render(this.orderData);
    } catch (error) {
      console.error('Не удалось инициализировать заказ', error);
    }
  }
}
