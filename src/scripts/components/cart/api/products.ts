import { CartData } from '../types/types';  // Импорт интерфейса CartData

/**
 * Данные корзины покупок.
 *
 * @type {CartData}
 */
export let cartData: CartData = {
    selectedCount: 0,  // Количество выбранных товаров
    products: [
        {
            id: '1',
            name: 'Кроссовки ASICS',
            cost: 2473,
            currency: '₽',
            image_url: 'https://sun9-25.userapi.com/impg/dsKDTkLYpWXfVMYj_21Rn7CESXspaL3zrXGF3A/riTPmwVCVaw.jpg?size=750x1000&quality=95&sign=3f49cd35acc30ab4f3dea29e4e0540d6&type=album',
            old_cost: 7632,  // Опциональная старая цена товара
            discount: 77,  // Процент скидки
            weight: 0.2,
            is_liked: false,
            delivery_date: '10.11.2024',
            quantity: 1,
            isSingleItem: true,
            isSelected: true,
            url: '/catalog/product/1'
        },
        {
            id: '2',
            name: 'Lydsto Робот-пылесос G1, белый',
            cost: 8099,
            currency: '₽',
            image_url: 'https://sun9-27.userapi.com/impg/n4x2LZ7IpCfYgOAYedj3wkDaVS2CF1aATpCVDQ/0D8LB0AiXNs.jpg?size=1000x1000&quality=95&sign=9478ab570b9f6735a2536ec4cabf7777&type=album',
            old_cost: 14990,  // Опциональная старая цена товара
            discount: 46,  // Процент скидки
            weight: 2.4,
            is_liked: true,
            delivery_date: '11.11.2024',
            quantity: 2,
            isSingleItem: false,
            isSelected: true,
            url: '/catalog/product/2'
        },
        {
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