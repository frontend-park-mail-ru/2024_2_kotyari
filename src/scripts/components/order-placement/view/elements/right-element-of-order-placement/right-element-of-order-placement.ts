import {OrderPlacementApiInterface} from "../../../api/order-placement";
import { router } from '../../../../../../services/app/init';
import { add } from 'husky';
import {OrderPlacementBuilder} from "../../order-placement-builder";

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

  private builder: OrderPlacementBuilder;

  /**
   * Конструктор класса RightElementOfOrderPlacementView.
   * Инициализирует список способов оплаты и запускает процессы инициализации.
   */
  constructor(address: string) {
    // Инициализация: получаем все элементы способов оплаты
    this.paymentMethods = document.querySelectorAll('.right-element-card__payment-method');
    // console.log(address);

    this.builder = new OrderPlacementBuilder();

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
      // console.log(address);

      OrderPlacementApiInterface.placeOrder(address, document.getElementById('apply-promo-input')?.value)
        .then(() => {
          router.navigate('/order_list');
        })
        .catch(err => {
          // console.error('что-то пошло не так', err);
        })
    });

    document.getElementById('apply-promo-button')?.addEventListener('click', async () => {

      const promo = document.getElementById('apply-promo-input')?.value;

      if (promo) {
        const prev = await document.getElementById('final-price')?.textContent;
        const data = await OrderPlacementApiInterface.getCartProductsWithPromocode(promo);

        await this.reconstructRightPart(data);

        if (data.promoStatus !== '') {
          this.showError();
        } else {
          this.applyCorrectPromoAnimation(data, prev);
        }
      } else {
        this.showError();
      }
    })
  }

  private debounceTimeout: number;

  private showError () {
    const err = document.getElementById('promo-error');

    clearTimeout(this.debounceTimeout); // Очистка предыдущего таймера

    err.style.display = "flex";

    this.debounceTimeout = setTimeout(() => {
      err.style.display = "none";
    }, 3000);
  }

  private async reconstructRightPart (data: any): Promise<void> {
    const finalPrice = document.getElementById('final-price');
    finalPrice.innerHTML = data.finalPrice + ' ' + data.currency;
  }

  private applyCorrectPromoAnimation(data: any, prev: number): void {
    const finalPrice = document.getElementById('final-price');
    const originalPrice = document.createElement('span');

    originalPrice.id = "original-price";
    originalPrice.textContent = prev;
    originalPrice.style.textDecoration = "line-through";
    originalPrice.style.marginRight = "10px";
    originalPrice.style.opacity = "1";
    originalPrice.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
    originalPrice.style.position = "absolute";
    originalPrice.style.transform = "translateX(0)";

    const parent = finalPrice.parentElement;
    parent.style.position = "relative";

    parent.insertBefore(originalPrice, finalPrice);

    const finalPriceRect = finalPrice.getBoundingClientRect();
    originalPrice.style.left = `${finalPriceRect.left - parent.getBoundingClientRect().left - originalPrice.offsetWidth - 10}px`;
    originalPrice.style.top = "0";

    setTimeout(() => {
      originalPrice.style.opacity = "0";
      originalPrice.style.transform = "translateX(-20px)";

      setTimeout(() => {
        originalPrice.remove();
        finalPrice.innerHTML = data.finalPrice + ' ' + data.currency;
        finalPrice.style.opacity = "0";
        finalPrice.style.transition = "opacity 0.3s ease-in-out";

        setTimeout(() => {
          finalPrice.style.opacity = "1";
        }, 50);
      }, 300);
    }, 3000);
  }
}
