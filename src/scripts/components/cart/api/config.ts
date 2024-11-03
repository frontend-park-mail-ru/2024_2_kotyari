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
    updateProductQuantity: {
        route: '/cart/product/', // Плсде идет productId
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    },
    selectProduct: {
        route: '/cart/select/product/', // Плсде идет productId
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        }
    },
    selectAllProducts: {
        route: '/cart/select/products',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        }
    },
    deleteSelectedProducts: {
        route: '/cart/select/product',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    },
    deleteProduct: {
        route: '/cart/product/', // После идет productId
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    },
    urlOfProduct: '/product/' // Посде идет ProductId
};
