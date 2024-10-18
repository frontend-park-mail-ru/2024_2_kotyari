// Обновление количества выбранных товаров
import {calculateCartTotals} from "../../right-element-of-cart/view/calculate-cart-totals.js";
import {cartData} from "../../../api/products.js";

/**
 * Обновляет количество выбранных товаров и пересчитывает данные корзины.
 * Проходит по всем товарам в корзине и обновляет их статус в зависимости от состояния чекбоксов.
 * После этого обновляются итоговые значения корзины.
 *
 * @function
 */
export function updateSelectedCount() {
    const itemCheckboxes = document.querySelectorAll('.cart-item__select-item');

    const selectedCountElement = document.getElementById('selected-count');
    const selectedCount = Array.from(itemCheckboxes).filter(checkbox => checkbox.checked).length;
    selectedCountElement.textContent = selectedCount;

    itemCheckboxes.forEach((checkbox) => {
        const checkboxId = checkbox.id;
        const productId = checkboxId ? checkboxId.split('-')[2] : null;  // Проверяем наличие id перед разбиением

        if (productId) {
            const product = cartData.products.find(p => p.id === productId);

            if (product) {
                product.isSelected = checkbox.checked;  // Обновляем свойство isSelected товара
            } else {
                console.error(`Product with id ${productId} not found in cartData.`);
            }
        } else {
            console.error(`Invalid checkbox id: ${checkboxId}`);
        }
    });

    calculateCartTotals();  // Пересчитываем итоговые значения корзины
}

/**
 * Настройка карточек товаров в корзине.
 * Включает функционал для изменения количества товаров, добавления/удаления товаров в избранное, а также их удаления из корзины.
 *
 * @function
 */
export function cardsSetting() {
    // Логика для изменения количества товаров и лайков
    const cartItems = document.querySelectorAll('.cart-item');

    cartItems.forEach(item => {
        const productId = item.querySelector('.cart-item__btn-favorite').id.split('-')[2];

        // Изменение лайка
        const favoriteButton = item.querySelector('.cart-item__btn-favorite');
        favoriteButton.addEventListener('click', () => {
            const product = cartData.products.find(p => p.id === productId);
            product.is_liked = !product.is_liked; // Переключение состояния лайка

            const icon = favoriteButton.querySelector('.cart-item__wishlist-icon');
            icon.innerText = product.is_liked ? 'favorite' : 'favorite_border'; // Обновление иконки
        });

        // Изменение количества товаров
        const minusButton = item.querySelector('.cart-item__quantity-btn--minus');
        const plusButton = item.querySelector('.cart-item__quantity-btn--plus');
        const quantityDisplay = item.querySelector('.cart-item__quantity-count');

        minusButton.addEventListener('click', () => {
            const product = cartData.products.find(p => p.id === productId);

            if (product.quantity > 1) {
                product.quantity--;
                quantityDisplay.innerText = `${product.quantity} шт.`;

                if (product.quantity === 1) {
                    // Обновляем кнопку "минус" на иконку мусорки
                    minusButton.innerHTML = '&#128465;';
                    minusButton.classList.add('delete-btn');

                    product.isSingleItem = true;
                }
            } else {
                let itemId = item.id;
                const productId = itemId ? itemId.split('-')[2] : null;

                cartData.products = cartData.products.filter(product => product.id !== productId);

                // Удаляем товар, если нажата иконка мусорки
                item.remove();

                updateSelectedCount(cartData);
            }

            calculateCartTotals();
        });

        plusButton.addEventListener('click', () => {
            const product = cartData.products.find(p => p.id === productId);

            product.quantity++;
            quantityDisplay.innerText = `${product.quantity} шт.`;

            if (product.quantity > 1) {
                // Восстанавливаем кнопку "минус"
                minusButton.innerHTML = '-';
                minusButton.classList.remove('delete-btn');

                product.isSingleItem = false;
            }

            calculateCartTotals();
        });

        // Удаление товара по иконке мусорки
        const removeItemButton = item.querySelector('.cart-item__remove-item');
        removeItemButton.addEventListener('click', () => {
            let itemId = item.id;
            const productId = itemId ? itemId.split('-')[2] : null;

            cartData.products = cartData.products.filter(product => product.id !== productId);

            item.remove();
            updateSelectedCount(cartData);
            calculateCartTotals();
        });
    });
}