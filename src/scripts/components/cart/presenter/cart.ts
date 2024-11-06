import { DataSamplingView } from '../elements/data-sampling/view/data-sampling.js';
import { LeftCardsPresenter } from '../elements/left-cards/presenter/left-cards.js';
import { LeftCardsView } from '../elements/left-cards/view/left-cards.js';
import { RightCartPresenter } from '../elements/right-element-of-cart/presenter/calculate-cart-totals.js';
import { RightCartView } from '../elements/right-element-of-cart/view/calculate-cart-totals.js';
import { DataSamplingPresenter } from '../elements/data-sampling/presenter/data-sampling.js';
import { CartData } from "../types/types";

/**
 * Класс CartPresenter управляет логикой работы с корзиной товаров,
 * связывая представление (View) и обработчики данных (Presenter).
 * Он отвечает за инициализацию представлений, обновление состояния корзины
 * и выполнение операций, таких как расчет итогов корзины.
 *
 * @class CartPresenter
 */
export class CartPresenter {
  /**
   * Представление для отображения выборки данных.
   * @private {DataSamplingView}
   */
  private readonly cartView: DataSamplingView;

  /**
   * Презентер для управления карточками слева.
   * @private {LeftCardsPresenter}
   */
  private leftCardsPresenter: LeftCardsPresenter;

  /**
   * Презентер для управления итогами корзины.
   * @private {RightCartPresenter}
   */
  private readonly rightCartPresenter: RightCartPresenter;

  /**
   * Презентер для выборки данных.
   * @private {DataSamplingPresenter}
   */
  private readonly dataSamplingPresenter: DataSamplingPresenter;

  /**
   * Данные корзины.
   * @private {CartData}
   */
  private readonly cartData: CartData;

  /**
   * Создает экземпляр CartPresenter.
   * @param {DataSamplingView} cartView - Представление для отображения выборки данных.
   * @param {CartData} cartData - Данные о продуктах в корзине.
   */
  constructor(cartView: DataSamplingView, cartData: CartData) {
    this.cartView = cartView;
    this.cartData = cartData;

    // Инициализируем View и Presenter для работы с итогами корзины.
    const rightCartView = new RightCartView();
    this.rightCartPresenter = new RightCartPresenter(rightCartView, this.cartData);

    // Инициализируем Presenter для выборки данных.

    // Инициализируем View и Presenter для работы с карточками слева.
    const leftCardsView = new LeftCardsView();
    this.leftCardsPresenter = new LeftCardsPresenter(leftCardsView, this.dataSamplingPresenter, this.cartData);

    this.dataSamplingPresenter = new DataSamplingPresenter(this.cartView, this.rightCartPresenter, this.cartData);
  }

  /**
   * Инициализация работы с корзиной. Загружает состояние корзины и добавляет слушатели событий.
   */
  async initializeCart() {
    // Инициализируем чекбоксы на основе данных корзины
    this.cartView.initializeCheckboxes(this.cartData.products);

    // Инициализируем работу с выборкой данных.
    this.dataSamplingPresenter.initializeDataSampling();

    // Выполняем дополнительные настройки.
    this.leftCardsPresenter.updateSelectedCount();
    await this.rightCartPresenter.calculateCartTotals(this.cartData);
  }
}
