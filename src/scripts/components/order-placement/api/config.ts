/**
 * Объект с маршрутами для работы с оформлением заказа.
 *
 * @constant {Object} ORDER_PLACEMENT_URLS - Маршруты и методы для работы с API оформления заказов.
 *
 * @property {Object} getCartProducts - Маршрут для получения данных корзины.
 * @property {string} getCartProducts.route - Путь.
 * @property {string} getCartProducts.method - Метод.
 * @property {Object} getCartProducts.headers - Заголовки запроса.
 * @property {string} getCartProducts.headers['Content-Type'] - Тип содержимого в запросе (application/json).
 *
 * @property {Object} updatePaymentMethod - Маршрут для обновления способа оплаты.
 * @property {string} updatePaymentMethod.route - Путь.
 * @property {string} updatePaymentMethod.method - Метод.
 * @property {Object} updatePaymentMethod.headers - Заголовки запроса.
 *
 * @property {Object} placeOrder - Маршрут для размещения заказа.
 * @property {string} placeOrder.route - Путь.
 * @property {string} placeOrder.method - Метод.
 * @property {Object} placeOrder.headers - Заголовки запроса.
 */
export const ORDER_PLACEMENT_URLS = {
    getCartProducts: {
        route: '/cart/select/products',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    },
    updatePaymentMethod: {
        route: '/cart/pay-method',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        }
    },
    placeOrder: {
        route: '/orders',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }
};
