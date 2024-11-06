import { DataSamplingView } from '../view/data-sampling.js';
import { RightCartPresenter } from '../../right-element-of-cart/presenter/calculate-cart-totals';
import { CartData } from "../../../types/types";
import {CartApiInterface} from "../../../api/cart-api";
import { LeftCardsView } from '../../left-cards/view/left-cards';

/**
 * Класс DataSamplingPresenter управляет функционалом выбора товаров в корзине
 * и взаимодействует с представлением (view) и презентером итогов корзины.
 *
 * @class DataSamplingPresenter
 */
export class DataSamplingPresenter {
  /**
   * Презентер для расчета итогов корзины.
   * @private {RightCartPresenter}
   */
  private rightCartPresenter: RightCartPresenter;

  /**
   * Представление для управления элементами корзины.
   * @private {DataSamplingView}
   */
  private cartView: DataSamplingView;

  /**
   * Данные корзины.
   * @private {CartData}
   */
  private readonly cartData: CartData;

  /**
   * Конструктор класса DataSamplingPresenter.
   *
   * @param {DataSamplingView} cartView - Представление для управления элементами корзины.
   * @param {RightCartPresenter} rightCartPresenter - Презентер для расчета итогов корзины.
   * @param {CartData} cartData - Данные корзины, включая список товаров.
   */
  constructor(cartView: DataSamplingView, rightCartPresenter: RightCartPresenter, cartData: CartData) {
    this.cartData = cartData;
    this.cartView = cartView;
    this.rightCartPresenter = rightCartPresenter;
  }

  /**
   * Инициализирует взаимодействие с корзиной:
   * настраивает состояние чекбокса "select-all" и добавляет слушатели событий.
   */
  initializeDataSampling() {
    // Инициализация состояния "select-all"
    this.updateSelectAllCheckbox();

    // Добавляем слушатели
    this.cartView.onSelectAllChange(this.handleSelectAllChange.bind(this));
    this.cartView.onItemCheckboxChange(this.handleItemCheckboxChange.bind(this));
    this.cartView.onDeleteSelected(this.handleDeleteSelected.bind(this));
  }

  /**
   * Обработчик изменения состояния чекбокса "select-all".
   * Выделяет или снимает выделение со всех товаров в корзине.
   *
   * @param checked булево значение: выделены ли все товары.
   */
  private handleSelectAllChange(checked: boolean) {
    try {
      CartApiInterface.selectAllProducts(checked).then(() => {
        this.cartData.products = this.cartData.products.map((product) => ({
          ...product,
          isSelected: checked,
        }));
        this.cartView.initializeCheckboxes(this.cartData.products);
        this.updateSelectedCount();});
    } catch (error) {
      console.error("Ошибка при изменении состояния 'Выбрать всё':", error);
    }
  }

  /**
   * Обработчик изменения состояния отдельного чекбокса товара.
   * Обновляет состояние товара в корзине.
   *
   * @param productId ID товара
   * @param checked булево значение: выбран ли товар.
   */
  private handleItemCheckboxChange(productId: string, checked: boolean) {
    this.cartData.products = this.cartData.products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          isSelected: checked,
        };
      }
      return product;
    });

    this.updateSelectAllCheckbox();
    this.updateSelectedCount();
  }

  /**
   * Обработчик удаления выбранных товаров.
   * Удаляет выбранные товары из корзины и обновляет состояние.
   */
  private handleDeleteSelected() {
    try {
      CartApiInterface.deleteSelectedProducts().then(async () => {
        const selectedItems = this.cartView.getSelectedItems();
        const selectedIds = selectedItems.map((item) => item.id.split('-')[2]);

        this.cartData.products = this.cartData.products.filter((product) => !selectedIds.includes(product.id));

        this.cartData.products = this.cartData.products.map((product) => ({
          ...product,
        }));

        this.cartView.removeSelectedItems(this.cartView.getSelectedItems());

        this.cartView.initializeCheckboxes(this.cartData.products);
        this.updateSelectAllCheckbox();

        await this.updateSelectedCount();

        if (this.cartData.products.length === 0) {
          LeftCardsView.displayEmptyCartMessage();
        }
      })
    } catch (error) {
      console.error("Ошибка при изменении состояния 'Удалить выбранное':", error);
    }
  }

  /**
   * Обновляет количество выбранных товаров.
   */
  private updateSelectedCount() {
    const selectedCount = this.cartData.products.filter((product) => product.isSelected).length;
    this.cartView.updateSelectedCount(selectedCount);

    return this.rightCartPresenter.calculateCartTotals(this.cartData);
  }

  /**
   * Обновляет состояние чекбокса "select-all" на основе состояния товаров в корзине.
   */
  updateSelectAllCheckbox() {
    try {
      const selectedCount = this.cartData.products.filter((product) => product.isSelected).length;
      const allChecked = selectedCount > 0 && selectedCount === this.cartData.products.length;
      const isIndeterminate = selectedCount > 0 && !allChecked;

      this.cartView.updateSelectAllCheckbox(allChecked, isIndeterminate);
    } catch (error) {
      console.error("Ошибка при изменении состояния 'Выбрать всё':", error);
    }
  }
}
