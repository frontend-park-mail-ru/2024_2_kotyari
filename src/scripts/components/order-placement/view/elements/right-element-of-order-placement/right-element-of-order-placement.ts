import {OrderPlacementApiInterface} from "../../../api/order-placement";
import { router } from '../../../../../../services/app/init';
import { add } from 'husky';
import {CSATPresenter} from "../../../../csat/presenter/csat";
import {csat} from "../../../../../../services/app/app";

/**
 * Класс для управления элементами правой части страницы оформления заказа.
 *
 * @class RightElementOfOrderPlacementView
 */
export class RightElementOfOrderPlacementView {
  /**
   * Коллекция DOM-элементов, представляющих способы оплаты.
   *
   * @private
   * @type {NodeListOf<Element>}
   */
  private paymentMethods: NodeListOf<Element>;

  /**
   * Конструктор класса RightElementOfOrderPlacementView.
   * Инициализирует список способов оплаты и запускает процессы инициализации.
   */
  constructor(address: string) {
    // Инициализация: получаем все элементы способов оплаты
    this.paymentMethods = document.querySelectorAll('.right-element-card__payment-method');
    console.log(address);

    this.init(address);
  }

  /**
   * Удаляет класс, обозначающий выбранный метод оплаты, со всех элементов.
   *
   * @private
   * @returns {void}
   */
  private clearSelected(): void {
    this.paymentMethods.forEach((method) => {
      method.classList.remove('right-element-card__payment-method--selected');
    });
  }

  /**
   * Обновляет выбранный способ оплаты через API.
   *
   * @async
   * @param {Element} methodElement - Элемент DOM, содержащий информацию о выбранном способе оплаты.
   * @returns {Promise<void>} Промис без возвращаемого значения.
   */
  private async updatePaymentMethod(methodElement: Element): Promise<void> {
    const selectedMethod = methodElement.querySelector('.right-element-card__payment-method-text')?.textContent;
    if (selectedMethod) {
      await OrderPlacementApiInterface.updatePaymentMethod(selectedMethod);
    }
  }

  /**
   * Добавляет обработчики событий для каждого способа оплаты.
   *
   * @private
   * @returns {void}
   */
  private addEventListeners(): void {
    this.paymentMethods.forEach((method) => {
      method.addEventListener('click', async () => {
        this.clearSelected();
        method.classList.add('right-element-card__payment-method--selected');
        await this.updatePaymentMethod(method);
      });
    });
  }

  /**
   * Инициализирует выбор способа оплаты по умолчанию и добавляет обработчики событий.
   *
   * @private
   * @returns {void}
   */
  private init(address: string): void {
    this.addEventListeners();

    document.getElementById('order-button')?.addEventListener('click', async () => {
      csat.renderStats('csat', 'purchase')

      OrderPlacementApiInterface.placeOrder(address)
        .then(() => {
          router.navigate('/order_list');
        })
        .catch(err => {
          console.error('что-то пошло не так', err);
        })
    });
  }
}
