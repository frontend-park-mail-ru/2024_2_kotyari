import { Helper } from "../../../../../constprograms/templatizer/helps/helper.js";
import { CartProduct } from "../../../types/types";  // Допустим, есть интерфейс для товара

export class RightCartView {
    private readonly totalItemsElement: HTMLElement;
    private readonly benefitPriceElement: HTMLElement;
    private readonly finalPriceElement: HTMLElement;
    private readonly checkoutButton: HTMLButtonElement;

    constructor() {
        this.totalItemsElement = document.querySelector('.right-card__total-items') as HTMLElement;
        this.benefitPriceElement = document.querySelector('.right-card__benefit-price') as HTMLElement;
        this.finalPriceElement = document.querySelector('.right-card__final-price') as HTMLElement;
        this.checkoutButton = document.querySelector('.cart-checkout-btn') as HTMLButtonElement;
    }

    /**
     * Обновляет информацию о количестве товаров, их общем весе и стоимости.
     *
     * @param totalItems Общее количество товаров
     * @param totalWeight Общий вес всех товаров
     * @param totalPrice Полная стоимость всех товаров
     * @param benefitPrice Общая выгода (скидка)
     * @param finalPrice Финальная стоимость после скидки
     * @param currency Валюта
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
                <span class="total-price">${totalPrice}${currency}</span>
            `;

            this.benefitPriceElement.innerText = `-${benefitPrice}${currency}`;
            this.finalPriceElement.innerText = `${finalPrice}${currency}`;
        }
    }

    /**
     * Обновляет информацию, если корзина пуста.
     */
    updateEmptyCart() {
        if (this.totalItemsElement && this.benefitPriceElement && this.finalPriceElement) {
            this.totalItemsElement.innerHTML = 'Корзина пуста';
            this.benefitPriceElement.innerText = '0';
            this.finalPriceElement.innerText = '0';
        }
    }

    /**
     * Управляет состоянием кнопки "Оформить заказ".
     *
     * @param isDisabled Блокировать кнопку или нет
     * @param selectedItems Массив выбранных товаров для оформления
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
