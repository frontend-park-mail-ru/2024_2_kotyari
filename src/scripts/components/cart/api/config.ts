/**
 * Объект с маршрутами для работы с корзиной.
 *
 * @constant {Object} CART_URLS - Маршруты и методы для работы с API корзины.
 *
 * @property {Object} getCarts - Маршрут для получения списка корзин.
 * @property {string} getCarts.route - Путь для получения корзин.
 * @property {string} getCarts.method - HTTP метод для получения корзин (GET).
 * @property {Object} getCarts.headers - Заголовки запроса для получения корзин.
 * @property {string} getCarts.headers['Content-Type'] - Тип содержимого в запросе (application/json).
 */
export const CART_URLS = {
    getCarts: {
        route: '/cart',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    },
};
