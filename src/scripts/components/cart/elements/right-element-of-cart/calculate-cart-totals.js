import {Helper} from "../../../../../../dist/scripts/constprograms/shablon/helps/helper.js";
import {cartData} from "../../products.js";

/**
 * Рассчитывает итоговые данные корзины, включая количество товаров, общий вес, полную стоимость, выгоду, и финальную стоимость.
 * Также обновляет DOM-элементы с этой информацией.
 * Если корзина пуста, выводится соответствующее сообщение.
 *
 * @function
 */
export function calculateCartTotals() {
    const selectedItems = cartData.products.filter(product => product.isSelected);  // Фильтруем выбранные товары

    const totalItems = selectedItems.reduce((acc, product) => acc + product.quantity, 0);
    const totalWeight = selectedItems.reduce((acc, product) => acc + (product.weight * product.quantity), 0);
    const totalPrice = selectedItems.reduce((acc, product) => {
        const oldCost = product.old_cost !== undefined ? product.old_cost : product.cost;  // Если old_cost нет, берем cost
        return acc + (oldCost * product.quantity);
    }, 0);
    const benefitPrice = selectedItems.reduce((acc, product) => {
        const oldCost = product.old_cost !== undefined ? product.old_cost : product.cost;  // Если old_cost нет, скидка 0
        return acc + ((oldCost - product.cost) * product.quantity);
    }, 0);
    const finalPrice = totalPrice - benefitPrice;

    // Проверяем, что массив продуктов не пустой
    if (cartData.products.length > 0) {
        const currency = cartData.products[0].currency;  // Берём валюту у первого продукта

        document.querySelector('.right-card__total-items').innerHTML = `
            Всего: ${totalItems} ${Helper.pluralize(totalItems, 'товар', 'товара', 'товаров')}, ${Math.round(totalWeight * 10) / 10}кг
            <span class="total-price">${totalPrice}${currency}</span>
        `;

        document.querySelector('.right-card__benefit-price').innerText = `-${benefitPrice}${currency}`;
        document.querySelector('.right-card__final-price').innerText = `${finalPrice}${currency}`;
    } else {
        // Если товаров нет, выводим информацию, что корзина пуста
        document.querySelector('.right-card__total-items').innerHTML = 'Корзина пуста';
        document.querySelector('.right-card__benefit-price').innerText = '0';
        document.querySelector('.right-card__final-price').innerText = '0';
    }

    handleCheckoutButton();
}

/**
 * Управляет состоянием кнопки "Оформить заказ" в зависимости от наличия выбранных товаров в корзине.
 * Если товаров нет, кнопка блокируется и добавляется всплывающее сообщение.
 * Если есть выбранные товары, кнопка активируется и убирается сообщение.
 *
 * @function
 */
export function handleCheckoutButton() {
    const checkoutButton = document.querySelector('.checkout-btn');
    const selectedItems = cartData.products.filter(product => product.isSelected);  // Фильтруем выбранные товары

    if (selectedItems.length === 0) {
        // Блокируем кнопку, если нет выбранных товаров
        checkoutButton.disabled = true;
        checkoutButton.classList.add('disabled');  // Добавляем класс для стилей заблокированной кнопки

        // Добавляем сообщение при наведении
        checkoutButton.setAttribute('title', 'Выберите хотя бы один товар для оформления заказа');
    } else {
        // Разблокируем кнопку, если есть выбранные товары
        checkoutButton.disabled = false;
        checkoutButton.classList.remove('disabled');
        checkoutButton.removeAttribute('title');
    }

    // Обработчик клика для вывода в консоль выбранных товаров
    checkoutButton.addEventListener('click', () => {
        console.log('Selected products:', selectedItems);
    });
}
