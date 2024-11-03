import { Helper } from '../../../../../constprograms/helper.js';
import { CartProduct } from '../../../types/types';

/**
 * Класс RightCartView отвечает за отображение информации о корзине, включая
 * общую стоимость, скидку, финальную цену и управление кнопкой "Оформить заказ".
 *
 * @class RightCartView
 */
export class RightCartView {
  /**
   * Элемент, отображающий общее количество товаров и вес.
   *
   * @private
   * @type {HTMLElement}
   */
  private readonly totalItemsElement: HTMLElement;

  /**
   * Элемент, отображающий сумму скидки.
   *
   * @private
   * @type {HTMLElement}
   */
  private readonly benefitPriceElement: HTMLElement;

  /**
   * Элемент, отображающий итоговую стоимость корзины.
   *
   * @private
   * @type {HTMLElement}
   */
  private readonly finalPriceElement: HTMLElement;

  /**
   * Кнопка "Оформить заказ".
   *
   * @private
   * @type {HTMLButtonElement}
   */
  private readonly checkoutButton: HTMLButtonElement;

  /**
   * Конструктор RightCartView.
   * Инициализирует элементы DOM, необходимые для отображения данных корзины.
   */
  constructor() {
    this.totalItemsElement = document.querySelector('.right-card__total-items') as HTMLElement;
    this.benefitPriceElement = document.querySelector('.right-card__benefit-price') as HTMLElement;
    this.finalPriceElement = document.querySelector('.right-card__final-price') as HTMLElement;
    this.checkoutButton = document.querySelector('.cart-checkout-btn') as HTMLButtonElement;
  }

  /**
   * Обновляет информацию о количестве товаров, общем весе, полной стоимости,
   * общей выгоде (скидке) и финальной цене с учетом скидки.
   *
   * @param {number} totalItems Общее количество товаров
   * @param {number} totalWeight Общий вес всех товаров
   * @param {number} totalPrice Полная стоимость всех товаров
   * @param {number} benefitPrice Общая выгода (скидка)
   * @param {number} finalPrice Финальная стоимость после скидки
   * @param {string} currency Валюта, в которой отображаются цены
   */
  updateTotals(
    totalItems: number,
    totalWeight: number,
    totalPrice: number,
    benefitPrice: number,
    finalPrice: number,
    currency: string
  ) {
    if (this.totalItemsElement && this.benefitPriceElement && this.finalPriceElement) {
      this.totalItemsElement.innerHTML = `
                Всего: ${totalItems} ${Helper.pluralize(totalItems, 'товар', 'товара', 'товаров')}, ${Math.round(totalWeight * 10) / 10}кг
                <span class="total-price">${totalPrice} ${currency ? Helper.isNotUndefined(currency) : '₽' }</span>
            `;

      this.benefitPriceElement.innerText = `${benefitPrice} ${currency ? Helper.isNotUndefined(currency) : '₽' }`;
      this.finalPriceElement.innerText = `${finalPrice} ${currency ? Helper.isNotUndefined(currency) : '₽' }`;
    }
  }

  /**
   * Обновляет информацию о корзине, если она пуста.
   * Показывает сообщение "Корзина пуста" и устанавливает нули в стоимости.
   */
  updateEmptyCart() {
    if (this.totalItemsElement && this.benefitPriceElement && this.finalPriceElement) {
      this.totalItemsElement.innerHTML = 'Пока ничего не выбрано';
      this.benefitPriceElement.innerText = '0';
      this.finalPriceElement.innerText = '0';
    }

    if (this.checkoutButton) {
      this.checkoutButton.disabled = true;
      this.checkoutButton.classList.add('disabled');
      this.checkoutButton.setAttribute('title', 'Выберите хотя бы один товар для оформления заказа');
    }
  }


  /**
   * Обновляет состояние кнопки "Оформить заказ" в зависимости от наличия выбранных товаров.
   * Если нет выбранных товаров, кнопка блокируется и показывается подсказка.
   *
   * @param {boolean} isDisabled Нужно ли блокировать кнопку
   * @param {CartProduct[]} selectedItems Массив выбранных товаров для оформления
   */
  updateCheckoutButton(isDisabled: boolean, selectedItems: CartProduct[]) {
    if (this.checkoutButton) {
      if (isDisabled) {
        this.checkoutButton.disabled = true;
        this.checkoutButton.classList.add('disabled');
        this.checkoutButton.setAttribute('title', 'Выберите хотя бы один товар для оформления заказа');
      } else {
        this.checkoutButton.disabled = false;
        this.checkoutButton.classList.remove('disabled');
        this.checkoutButton.removeAttribute('title');
      }

      // Обработчик клика для вывода в консоль выбранных товаров
      this.checkoutButton.addEventListener('click', () => {
        console.log('Selected products:', selectedItems);
      });
    }
  }
}
