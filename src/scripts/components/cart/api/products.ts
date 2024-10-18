/**
 * Объект, содержащий данные корзины покупок.
 * Включает количество выбранных товаров и массив продуктов с детализированной информацией о каждом продукте.
 *
 * @typedef {Object} CartData
 * @property {number} selectedCount - Количество выбранных товаров.
 * @property {Array<Product>} products - Массив продуктов, добавленных в корзину.
 */

/**
 * Объект, представляющий информацию о продукте в корзине.
 *
 * @typedef {Object} Product
 * @property {string} id - Уникальный идентификатор товара.
 * @property {string} name - Название товара.
 * @property {number} cost - Цена товара.
 * @property {string} currency - Валюта, в которой указана цена товара.
 * @property {string} image_url - URL изображения товара.
 * @property {number} old_cost - Старая цена товара (до скидки).
 * @property {number} discount - Процент скидки на товар.
 * @property {number} weight - Вес товара (в килограммах).
 * @property {boolean} is_liked - Статус "добавлено в избранное".
 * @property {string} delivery_date - Дата доставки товара.
 * @property {number} quantity - Количество единиц товара в корзине.
 * @property {boolean} isSingleItem - Флаг, указывающий, является ли товар единственным (если количество = 1).
 * @property {boolean} isSelected - Флаг, указывающий, выбран ли товар для действий (например, для оформления заказа).
 */

/**
 * Данные корзины покупок.
 *
 * @type {CartData}
 */
export let cartData = {
    selectedCount: 0,  // Количество выбранных товаров
    products: [
        {
            id: '1',
            name: 'Кроссовки ASICS',
            cost: 2473,
            currency: '₽',
            image_url: 'https://sun9-25.userapi.com/impg/dsKDTkLYpWXfVMYj_21Rn7CESXspaL3zrXGF3A/riTPmwVCVaw.jpg?size=750x1000&quality=95&sign=3f49cd35acc30ab4f3dea29e4e0540d6&type=album',
            old_cost: 7632,
            discount: 77, //скидка
            weight: 0.2,
            is_liked: false,
            delivery_date: '10.11.2024',
            quantity: 1,
            isSingleItem: true,
            isSelected: true,
            url: '/catalog/product/1'
        }, {
            id: '2',
            name: 'Lydsto Робот-пылесос G1, белый',
            cost: 8099,
            currency: '₽',
            image_url: 'https://sun9-27.userapi.com/impg/n4x2LZ7IpCfYgOAYedj3wkDaVS2CF1aATpCVDQ/0D8LB0AiXNs.jpg?size=1000x1000&quality=95&sign=9478ab570b9f6735a2536ec4cabf7777&type=album',
            old_cost: 14990,
            discount: 46, //скидка
            weight: 2.4,
            is_liked: true,
            delivery_date: '11.11.2024',
            quantity: 2,
            isSingleItem: false,
            isSelected: true,
            url: '/catalog/product/2'
        }, {
            id: '3',
            name: 'Посудомоечная машина встраиваемая',
            cost: 31513,
            currency: '₽',
            image_url: 'https://sun9-62.userapi.com/impg/Pn7njR824gsUONsgRhuLCoGhQp1eSwzs21A0JQ/OW-FgCP2ZQU.jpg?size=440x440&quality=95&sign=05605d495f05bf373368e5d31dcf1900&type=album',
            weight: 23.1,
            is_liked: false,
            delivery_date: '23.11.2024',
            quantity: 3,
            isSingleItem: false,
            isSelected: false,
            url: '/catalog/product/3'
        },
    ]
};
