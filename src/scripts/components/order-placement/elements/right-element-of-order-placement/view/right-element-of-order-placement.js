
/**
 * Рассчитывает итоговые данные корзины, включая количество товаров, общий вес, полную стоимость, выгоду, и финальную стоимость.
 * Также обновляет DOM-элементы с этой информацией.
 * Если корзина пуста, выводится соответствующее сообщение.
 *
 * @function
 */
export function rightElementOfOrderPlacement() {
    // Получаем все элементы способов оплаты
    const paymentMethods = document.querySelectorAll('.right-element-card__payment-method');

    // Функция для удаления класса выбранного метода
    function clearSelected() {
        paymentMethods.forEach(method => {
            method.classList.remove('right-element-card__payment-method--selected');
        });
    }

    // Установить первый способ оплаты как выбранный по умолчанию
    paymentMethods[0].classList.add('right-element-card__payment-method--selected');

    // Добавляем обработчики событий на каждый способ оплаты
    paymentMethods.forEach((method, index) => {
        method.addEventListener('click', function() {
            // Убираем выбор со всех методов
            clearSelected();

            // Добавляем класс выбранного метода
            method.classList.add('right-element-card__payment-method--selected');
        });
    });
}
