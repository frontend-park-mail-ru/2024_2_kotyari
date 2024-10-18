import { DataSamplingView } from '../elements/data-sampling/view/data-sampling.js';
import { cartData } from '../api/products.js';
import { LeftCardsPresenter } from '../elements/left-cards/presenter/left-cards.js';
import { LeftCardsView } from '../elements/left-cards/view/left-cards.js';
import { RightCartPresenter } from "../elements/right-element-of-cart/presenter/calculate-cart-totals.js";
import { RightCartView } from "../elements/right-element-of-cart/view/calculate-cart-totals.js";
import { DataSamplingPresenter } from "../elements/data-sampling/presenter/data-sampling.js";

export class CartPresenter {
    private readonly cartView: DataSamplingView;
    private leftCardsPresenter: LeftCardsPresenter;
    private readonly rightCartPresenter: RightCartPresenter;
    private dataSamplingPresenter: DataSamplingPresenter;

    constructor(cartView: DataSamplingView) {
        this.cartView = cartView;

        // Инициализируем View и Presenter для работы с карточками товаров
        const leftCardsView = new LeftCardsView();
        this.leftCardsPresenter = new LeftCardsPresenter(leftCardsView);

        const rightCartView = new RightCartView();
        this.rightCartPresenter = new RightCartPresenter(rightCartView);

        this.dataSamplingPresenter = new DataSamplingPresenter(this.cartView, this.rightCartPresenter)
    }

    /**
     * Инициализация работы с корзиной. Загружает состояние корзины и добавляет слушатели событий.
     */
    initializeCart() {
        // Инициализируем чекбоксы на основе cartData
        this.cartView.initializeCheckboxes(cartData.products);

        this.dataSamplingPresenter.initializeDataSampling();

        // Дополнительные настройки
        this.leftCardsPresenter.updateSelectedCount();
        this.rightCartPresenter.calculateCartTotals();
    }
}
