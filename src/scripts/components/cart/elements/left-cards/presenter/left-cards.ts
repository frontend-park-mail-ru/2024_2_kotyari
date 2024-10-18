import { CartView } from '/dist/scripts/components/cart/view/cart.js';
import { cartData } from '/src/scripts/components/cart/api/products.js';
import { cardsSetting, updateSelectedCount } from '/dist/scripts/components/cart/elements/left-cards/view/left-cards.js';
import { calculateCartTotals } from '/dist/scripts/components/cart/elements/right-element-of-cart/view/calculate-cart-totals.js';

export class CartPresenter {
    private cartView: CartView;

    constructor(cartView: CartView) {
        this.cartView = cartView;
    }

    /**
     * Инициализация работы с корзиной. Загружает состояние корзины и добавляет слушатели событий.
     */
    initializeCart() {
        // Инициализируем чекбоксы на основе cartData
        this.cartView.initializeCheckboxes(cartData.products);

        // Инициализация состояния "select-all"
        this.updateSelectAllCheckbox();

        // Добавляем слушатели
        this.cartView.onSelectAllChange(this.handleSelectAllChange.bind(this));
        this.cartView.onItemCheckboxChange(this.handleItemCheckboxChange.bind(this));
        this.cartView.onDeleteSelected(this.handleDeleteSelected.bind(this));

        // Дополнительные настройки
        cardsSetting();
        calculateCartTotals();
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
     * Обновляет состояние чекбокса "select-all" на основе состояния товаров в корзине.
     */
    private updateSelectAllCheckbox() {
        const allChecked = cartData.products.every(product => product.isSelected);
        this.cartView.updateSelectAllCheckbox(allChecked);
    }

    /**
     * Обновляет количество выбранных товаров.
     */
    private updateSelectedCount() {
        const selectedCount = cartData.products.filter(product => product.isSelected).length;
        this.cartView.updateSelectedCount(selectedCount);
        updateSelectedCount();  // Вызов сторонней функции для обновления UI
    }
}
