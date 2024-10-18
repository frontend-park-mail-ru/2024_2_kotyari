import {TemplateManager} from "/dist/scripts/constprograms/templatizer/templatize.js";
import {cardsSetting, updateSelectedCount} from "../elements/lefr-cards/view/left-cards.js";
import {calculateCartTotals} from "../elements/right-element-of-cart/view/calculate-cart-totals.js";
import {cartData} from "../api/products.js";

/**
 * Основная функция для работы с корзиной покупок.
 * Загрузка шаблона корзины, инициализация состояния товаров, обработка чекбоксов (выделение всех товаров, удаление выбранных),
 * обновление итоговых данных корзины.
 *
 * @function
 * @returns {Promise} Возвращает промис, который разрешается после полной инициализации корзины и всех её элементов.
 */
export function cart() {
    return TemplateManager.templatize(document.getElementById('main'), '/src/scripts/components/cart/view/cart.hbs', cartData).then(() => {
        const selectAllCheckbox = document.getElementById('select-all');
        const itemCheckboxes = document.querySelectorAll('.cart-item__select-item');
        const selectedCountElement = document.getElementById('selected-count'); // Элемент для отображения количества выбранных товаров

        selectedCountElement.innerText = cartData.products.filter(p => p.isSelected).length;

        /**
         * Обновляет состояние чекбокса "select-all" на основе состояния отдельных товаров в корзине.
         * Если все товары выбраны, чекбокс "select-all" также становится выбранным.
         *
         * @function
         */
        function updateSelectAllCheckbox() {
            const allChecked = Array.from(itemCheckboxes).every(checkbox => checkbox.checked);
            selectAllCheckbox.checked = allChecked;
        }

        // Инициализация состояния чекбоксов на основе cartData
        itemCheckboxes.forEach(checkbox => {
            const productId = checkbox.id.split('-')[2];
            const product = cartData.products.find(p => p.id === productId);

            if (product) {
                checkbox.checked = product.isSelected; // Устанавливаем состояние из cartData
            }
        });

        /**
         * Обработчик для чекбокса "select-all".
         * При изменении состояния выделяет или снимает выделение со всех товаров в корзине.
         *
         * @event change
         */
        selectAllCheckbox.addEventListener('change', function() {
            itemCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
                const productId = checkbox.id.split('-')[2];
                cartData.products = cartData.products.map(product => {
                    if (product.id === productId) {
                        return {
                            ...product,
                            isSelected: selectAllCheckbox.checked
                        };
                    }
                    return product;
                });
            });
            updateSelectedCount();
        });

        /**
         * Обработчик для отдельных чекбоксов товаров.
         * При изменении состояния обновляет данные корзины и проверяет состояние чекбокса "select-all".
         *
         * @event change
         */
        itemCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const productId = checkbox.id.split('-')[2];

                cartData.products = cartData.products.map(product => {
                    if (product.id === productId) {
                        return {
                            ...product,
                            isSelected: checkbox.checked
                        };
                    }
                    return product;
                });

                updateSelectAllCheckbox();  // Проверяем состояние "select-all"
                updateSelectedCount();
            });
        });

        /**
         * Обработчик для удаления выбранных товаров из корзины.
         * Удаляет все выделенные товары как из DOM, так и из данных корзины.
         *
         * @event click
         * @param {Event} e - Событие клика.
         */
        // Удаление выбранных товаров
        document.querySelector('.cart-header__delete-selected').addEventListener('click', function(e) {
            e.preventDefault();
            const selectedItems = document.querySelectorAll('.cart-item__select-item:checked');

            // Получаем ID всех выбранных продуктов
            const selectedIds = Array.from(selectedItems).map(item => {
                const checkboxId = item.id;
                return checkboxId ? checkboxId.split('-')[2] : null; // Получаем ID продукта
            });

            // Фильтруем массив продуктов, исключая выбранные
            cartData.products = cartData.products.filter(product => !selectedIds.includes(product.id));

            // Удаляем DOM-элементы, соответствующие выбранным товарам
            selectedItems.forEach(item => {
                item.closest('.cart-item').remove();
            });

            updateSelectedCount();
            updateSelectAllCheckbox();  // Обновляем состояние "select-all"
        });

        // Инициализация состояния "select-all" при первой загрузке
        updateSelectAllCheckbox();

        cardsSetting();
        calculateCartTotals();
    });
}
