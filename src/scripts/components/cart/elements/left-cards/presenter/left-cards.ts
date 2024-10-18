import { RightCartPresenter } from "../../right-element-of-cart/presenter/calculate-cart-totals.js";
import { cartData } from "../../../api/products.js";
import { CartProduct } from "../../../types/types";
import { LeftCardsView } from "../view/left-cards.js";
import {RightCartView} from "../../right-element-of-cart/view/calculate-cart-totals.js";

export class LeftCardsPresenter {
    private view: LeftCardsView;
    private rightCartPresenter: RightCartPresenter;

    constructor(view: LeftCardsView) {
        this.view = view;

        const rightCartView = new RightCartView();
        this.rightCartPresenter = new RightCartPresenter(rightCartView);

        this.view.onFavoriteToggle = this.handleFavoriteToggle.bind(this);
        this.view.onQuantityChange = this.handleQuantityChange.bind(this);
        this.view.onRemoveItem = this.handleRemoveItem.bind(this);
        this.view.onSelectItem = this.handleSelectItem.bind(this);
    }

    // Метод для обновления количества выбранных товаров
    updateSelectedCount(): void {
        const selectedCount = cartData.products.filter((product: CartProduct) => product.isSelected).length;
        this.view.updateSelectedCount(selectedCount);
        this.rightCartPresenter.calculateCartTotals();
    }

    // Обработчик для переключения состояния "избранное"
    private handleFavoriteToggle(productId: string): void {
        const product = this.findProductById(productId);
        if (product) {
            product.is_liked = !product.is_liked;
            this.view.updateFavoriteIcon(productId, product.is_liked);
        }
    }

    // Обработчик изменения количества товара
    private handleQuantityChange(productId: string, action: 'increase' | 'decrease'): void {
        const product = this.findProductById(productId);
        if (product) {
            if (action === 'increase') {
                product.quantity++;
            } else if (action === 'decrease' && product.quantity > 1) {
                product.quantity--;
            }

            this.view.updateQuantityDisplay(productId, product.quantity);

            if (product.quantity === 1) {
                this.view.switchMinusButtonToDelete(productId, true);
                product.isSingleItem = true;
            } else {
                this.view.switchMinusButtonToDelete(productId, false);
                product.isSingleItem = false;
            }

            this.rightCartPresenter.calculateCartTotals();
        }
    }

    // Обработчик удаления товара
    private handleRemoveItem(productId: string): void {
        cartData.products = cartData.products.filter((product: CartProduct) => product.id !== productId);
        this.view.removeItem(productId);
        this.updateSelectedCount();
    }

    // Обработчик выбора товара
    private handleSelectItem(productId: string, isSelected: boolean): void {
        const product = this.findProductById(productId);
        if (product) {
            product.isSelected = isSelected;
            this.updateSelectedCount();
        }
    }

    // Вспомогательный метод для поиска товара по id
    private findProductById(productId: string): CartProduct | undefined {
        return cartData.products.find((p: CartProduct) => p.id === productId);
    }
}
