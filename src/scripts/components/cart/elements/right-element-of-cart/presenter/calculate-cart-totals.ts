import { RightCartView } from "../view/calculate-cart-totals.js";
import { cartData } from "../../../api/products.js";  // Предполагаем, что есть интерфейсы для данных
import { CartProduct } from "../../../types/types";  // Предполагаем, что есть интерфейсы для данных

export class RightCartPresenter {
    private cartView: RightCartView;

    constructor(cartView: RightCartView) {
        this.cartView = cartView;
    }

    /**
     * Рассчитывает итоговые данные корзины.
     */
    calculateCartTotals() {
        const selectedItems = cartData.products.filter((product: CartProduct) => product.isSelected);

        const totalItems = selectedItems.reduce((acc: number, product: CartProduct) => acc + product.quantity, 0);
        const totalWeight = selectedItems.reduce((acc: number, product: CartProduct) => acc + (product.weight * product.quantity), 0);
        const totalPrice = selectedItems.reduce((acc: number, product: CartProduct) => {
            const oldCost = product.old_cost !== undefined ? product.old_cost : product.cost;
            return acc + (oldCost * product.quantity);
        }, 0);
        const benefitPrice = selectedItems.reduce((acc: number, product: CartProduct) => {
            const oldCost = product.old_cost !== undefined ? product.old_cost : product.cost;
            return acc + ((oldCost - product.cost) * product.quantity);
        }, 0);
        const finalPrice = totalPrice - benefitPrice;

        if (cartData.products.length > 0 && selectedItems.length > 0) {
            const currency = cartData.products[0].currency;
            this.cartView.updateTotals(totalItems, totalWeight, totalPrice, benefitPrice, finalPrice, currency);
        } else {
            this.cartView.updateEmptyCart();
        }

        this.handleCheckoutButton();
    }

    /**
     * Управляет состоянием кнопки "Оформить заказ".
     */
    private handleCheckoutButton() {
        const selectedItems = cartData.products.filter((product: CartProduct) => product.isSelected);
        const isDisabled = selectedItems.length === 0;
        this.cartView.updateCheckoutButton(isDisabled, selectedItems);
    }
}
