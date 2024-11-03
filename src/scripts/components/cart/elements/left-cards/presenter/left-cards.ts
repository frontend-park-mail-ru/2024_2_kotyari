import { RightCartPresenter } from '../../right-element-of-cart/presenter/calculate-cart-totals.js';
import { CartData, CartProduct } from '../../../types/types';
import { LeftCardsView } from '../view/left-cards.js';
import { RightCartView } from '../../right-element-of-cart/view/calculate-cart-totals.js';
import { DataSamplingPresenter } from "../../data-sampling/presenter/data-sampling";
import {CartApiInterface} from "../../../api/cart-api";

/**
 * Класс LeftCardsPresenter управляет взаимодействием с карточками товаров слева
 * и обновляет данные корзины и представление (view).
 *
 * @class LeftCardsPresenter
 */
export class LeftCardsPresenter {
  /**
   * Представление для отображения карточек товаров.
   * @private {LeftCardsView}
   */
  private view: LeftCardsView;

  /**
   * Презентер для расчета итогов корзины.
   * @private {RightCartPresenter}
   */
  private rightCartPresenter: RightCartPresenter;

  /**
   * Презентер для работы с выбором товаров.
   * @private {DataSamplingPresenter}
   */
  private dataSamplingPresenter: DataSamplingPresenter;

  /**
   * Данные корзины.
   * @private {CartData}
   */
  private cartData: CartData;

  /**
   * Конструктор класса LeftCardsPresenter.
   * Инициализирует представление и презентеры для работы с карточками и корзиной.
   *
   * @param {LeftCardsView} view - Представление для отображения карточек товаров.
   * @param {DataSamplingPresenter} dataSamplingPresenter - Презентер для работы с выбором товаров.
   * @param {CartData} cartData - Данные корзины, включая список товаров.
   */
  constructor(view: LeftCardsView, dataSamplingPresenter: DataSamplingPresenter, cartData: CartData) {
    this.view = view;
    this.cartData = cartData;
    this.dataSamplingPresenter = dataSamplingPresenter;

    const rightCartView = new RightCartView();
    this.rightCartPresenter = new RightCartPresenter(rightCartView, this.cartData);

    // Привязка обработчиков событий
    this.view.onFavoriteToggle = this.handleFavoriteToggle.bind(this);
    this.view.onQuantityChange = this.handleQuantityChange.bind(this);
    this.view.onRemoveItem = this.handleRemoveItem.bind(this);
    this.view.onSelectItem = this.handleSelectItem.bind(this);
  }

  /**
   * Обновляет количество выбранных товаров и пересчитывает итоги корзины.
   */
  updateSelectedCount(): void {
    const selectedCount = this.cartData.products.filter((product: CartProduct) => product.isSelected).length;
    this.view.updateSelectedCount(selectedCount);
    this.rightCartPresenter.calculateCartTotals();

    // Обновляем состояние чекбокса "Выбрать все"
    this.updateSelectAllCheckbox();
  }

  /**
   * Обновляет состояние чекбокса "Выбрать все" в зависимости от выбранных товаров.
   */
  updateSelectAllCheckbox(): void {
    const selectedCount = this.cartData.products.filter((product: CartProduct) => product.isSelected).length;
    const allChecked = selectedCount === this.cartData.products.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < this.cartData.products.length;

    this.view.updateSelectAllCheckbox(allChecked, isIndeterminate);
  }

  /**
   * Обработчик для переключения состояния "избранное" у товара.
   *
   * @param {string} productId - ID товара.
   */
  private handleFavoriteToggle(productId: string): void {
    const product = this.findProductById(productId);
    if (product) {
      product.is_liked = !product.is_liked;
      this.view.updateFavoriteIcon(productId, product.is_liked);
    }
  }

  /**
   * Обработчик изменения количества товара.
   *
   * @param {string} productId - ID товара.
   * @param {'increase' | 'decrease'} action - Действие: увеличить или уменьшить количество.
   */
  private handleQuantityChange(productId: string, action: 'increase' | 'decrease'): void {
    const product = this.findProductById(productId);

    if (product) {
      if (action === 'increase') {
        product.quantity++;
      } else if (action === 'decrease' && product.quantity > 1) {
        product.quantity--;
      }

      try {
        CartApiInterface.updateProductQuantity(productId, product.quantity).then(() => {
          this.view.updateQuantityDisplay(productId, product.quantity);

          // Переключение кнопки в режим удаления при количестве = 1
          const isSingleItem = product.quantity === 1;
          this.view.switchMinusButtonToDelete(productId, isSingleItem);

          product.isSingleItem = isSingleItem;
          this.rightCartPresenter.calculateCartTotals();
        })
      } catch (error) {
        console.error('Ошибка при обновлении количества товара:', error);
      }
    }
  }

  /**
   * Обработчик удаления товара из корзины.
   *
   * @param {string} productId - ID товара, который нужно удалить.
   */
  private handleRemoveItem(productId: string): void {
    this.cartData.products = this.cartData.products.filter((product) => product.id !== productId);

    try {
      CartApiInterface.deleteProduct(productId).then(() => {
        this.view.removeItem(productId);
        this.updateSelectedCount(); // Пересчёт выбранных товаров
        this.updateSelectAllCheckbox(); // Обновляем состояние select-all
        this.dataSamplingPresenter.updateSelectAllCheckbox();
      })
    } catch (error) {
      console.error('Ошибка при удалении товара из корзины:', error);
    }
  }

  /**
   * Обработчик выбора товара (чекбокс).
   *
   * @param {string} productId - ID товара.
   * @param {boolean} isSelected - Булево значение, указывающее, выбран ли товар.
   */
  private handleSelectItem(productId: string, isSelected: boolean): void {
    const product = this.findProductById(productId);

    try {
      CartApiInterface.selectProduct(productId, isSelected).then(() => {
        if (product) {
          product.isSelected = isSelected;
          this.updateSelectedCount();
        }
      })
    } catch (error) {
      console.error('Ошибка при выборе товара в корзине:', error);
    }
  }

  /**
   * Вспомогательный метод для поиска товара по его ID.
   *
   * @param {string} productId - ID товара.
   * @returns {CartProduct | undefined} Возвращает товар или undefined, если товар не найден.
   */
  private findProductById(productId: string): CartProduct | undefined {
    return this.cartData.products.find((p: CartProduct) => p.id === productId);
  }
}
