//import { DataSamplingView } from '../view/data-sampling.js';
import { cartData } from '../../../api/products.js';
import { DataSamplingView } from "../view/data-sampling.js";
import { RightCartPresenter } from "../../right-element-of-cart/presenter/calculate-cart-totals";

export class DataSamplingPresenter {
    //private dataSamplingView: DataSamplingView;
    private rightCartPresenter: RightCartPresenter;
    private cartView: DataSamplingView;

    constructor(cartView: DataSamplingView, rightCartPresenter: RightCartPresenter) {
        this.cartView = cartView;
        //this.dataSamplingView = new DataSamplingView();
        this.rightCartPresenter = rightCartPresenter;
    }

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
        cartData.products = cartData.products.map(product => ({
            ...product,
            isSelected: checked
        }));

        this.cartView.initializeCheckboxes(cartData.products);  // Обновляем состояние чекбоксов
        this.updateSelectedCount();  // Обновляем количество выбранных товаров
    }

    /**
     * Обработчик изменения состояния отдельного чекбокса товара.
     * Обновляет состояние товара в корзине.
     *
     * @param productId ID товара
     * @param checked булево значение: выбран ли товар.
     */
    private handleItemCheckboxChange(productId: string, checked: boolean) {
        cartData.products = cartData.products.map(product => {
            if (product.id === productId) {
                return {
                    ...product,
                    isSelected: checked
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
        const selectedItems = this.cartView.getSelectedItems();
        const selectedIds = selectedItems.map(item => item.id.split('-')[2]);

        cartData.products = cartData.products.filter(product => !selectedIds.includes(product.id));
        this.cartView.removeSelectedItems(selectedItems);
        this.updateSelectAllCheckbox();
        this.updateSelectedCount();
    }

    /**
     * Обновляет количество выбранных товаров.
     */
    private updateSelectedCount() {
        const selectedCount = cartData.products.filter(product => product.isSelected).length;
        this.cartView.updateSelectedCount(selectedCount);
        this.rightCartPresenter.calculateCartTotals();
    }

    /**
     * Обновляет состояние чекбокса "select-all" на основе состояния товаров в корзине.
     */
    private updateSelectAllCheckbox() {
        const selectedCount = cartData.products.filter(product => product.isSelected).length;
        const allChecked = selectedCount === cartData.products.length;
        const isIndeterminate = selectedCount > 0 && selectedCount < cartData.products.length;

        // Обновляем состояние select-all чекбокса
        this.cartView.updateSelectAllCheckbox(allChecked, isIndeterminate);
    }
}
