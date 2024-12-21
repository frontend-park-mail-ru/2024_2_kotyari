import { RightCartView } from '../view/calculate-cart-totals.js';
import {CartData, CartProduct} from '../../../types/types';

/**
 * Класс RightCartPresenter отвечает за логику расчета и обновления данных корзины,
 * взаимодействует с представлением RightCartView для отображения итогов корзины.
 *
 * @class RightCartPresenter
 */
export class RightCartPresenter {
  /**
   * Представление для отображения данных корзины.
   *
   * @private
   * @type {RightCartView}
   */
  private cartView: RightCartView;

  /**
   * Данные корзины, включая список товаров.
   *
   * @private
   * @type {CartData}
   */
  private cartData: CartData;

  /**
   * Конструктор RightCartPresenter.
   *
   * @param {RightCartView} cartView - Представление для отображения данных корзины.
   * @param {CartData} cartData - Данные корзины, содержащие список товаров.
   */
  constructor(cartView: RightCartView, cartData: CartData) {
    this.cartView = cartView;
    this.cartData = cartData;
  }

  /**
   * Рассчитывает итоговые данные корзины, такие как количество товаров,
   * общий вес, полную цену, скидку и финальную цену, и передает их в представление.
   *
   * @returns {Promise<void>} Промис, разрешающийся после обновления данных корзины.
   */
  async calculateCartTotals(cartData : CartData) {
    // console.log(cartData);

    this.cartData = cartData;
    const selectedItems = this.cartData.products.filter((product: CartProduct) => product.isSelected);

    // Подсчет общего количества товаров
    const totalItems = selectedItems.reduce((acc: number, product: CartProduct) => acc + product.quantity, 0);

    // Подсчет общего веса
    const totalWeight = selectedItems.reduce(
        (acc: number, product: CartProduct) => acc + product.weight * product.quantity,
        0
    );

    // Подсчет полной цены (с учетом старой стоимости, если есть)
    const totalPrice = selectedItems.reduce((acc: number, product: CartProduct) => {
      const oldCost = product.old_cost !== undefined ? product.old_cost : product.cost;
      return acc + oldCost * product.quantity;
    }, 0);

    // Подсчет скидки
    const benefitPrice = selectedItems.reduce((acc: number, product: CartProduct) => {
      const oldCost = product.old_cost !== undefined ? product.old_cost : product.cost;
      return acc + (oldCost - product.cost) * product.quantity;
    }, 0);

    // Подсчет финальной цены с учетом скидки
    const finalPrice = totalPrice - benefitPrice;

    // Если есть товары в корзине и выбраны хотя бы некоторые из них
    if (this.cartData.products.length > 0 && selectedItems.length > 0) {
      const currency = this.cartData.products[0].currency;
      this.cartView.updateTotals(totalItems, totalWeight, totalPrice, benefitPrice, finalPrice, currency);
    } else {
      this.cartView.updateEmptyCart();
    }

    return this.handleCheckoutButton();
  }

  /**
   * Управляет состоянием кнопки "Оформить заказ" в зависимости от наличия выбранных товаров.
   *
   * @private
   * @returns {Promise<void>} Промис, разрешающийся после обновления состояния кнопки.
   */
  private async handleCheckoutButton() {
    const selectedItems = this.cartData.products.filter((product: CartProduct) => product.isSelected);

    // Блокируем кнопку, если нет выбранных товаров
    const isDisabled = selectedItems.length === 0;
    this.cartView.updateCheckoutButton(isDisabled, selectedItems);
  }
}
