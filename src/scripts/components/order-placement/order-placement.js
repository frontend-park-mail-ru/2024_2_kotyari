import {TemplateManager} from "/dist/scripts/constprograms/templatizer/templatize.js";
import {
    rightElementOfOrderPlacement
} from "./elements/right-element-of-order-placement/right-element-of-order-placement.js";

const orderData = {
    totalItems: 3,                    // Количество товаров
    totalWeight: 10.3,                // Общий вес в килограммах
    finalPrice: 4500,                 // Общая стоимость
    currency: "₽",                    // Валюта, в данном случае российский рубль
    paymentMethods: [                 // Методы оплаты
        {
            method: "Картой",          // Название метода оплаты
            icon: "credit_card",       // Иконка для метода оплаты (material-icons)
            isSelected: true           // Отметим, что этот метод выбран по умолчанию
        },
        {
            method: "Наличными",       // Название второго метода оплаты
            icon: "payments",          // Иконка для второго метода (material-icons)
            isSelected: false          // Этот метод не выбран по умолчанию
        }
    ],
    recipient: {                      // Данные получателя
        address: "г. Москва, 2-я Бауманская ул., 5", // Адрес доставки
        recipientName: "Иван Иванов",  // Имя получателя
    },
    deliveryDates: [                   // Массив с датами и товарами для доставки
        {
            date: "2024-10-08",        // Дата доставки (первая дата)
            weight: 10,                // Общий вес товаров для этой даты
            items: [                   // Список товаров для этой даты
                {
                    productName: "Кроссовки ASICS",  // Название товара
                    productPrice: 2473,      // Цена товара
                    quantity: 3,             // Количество товаров
                    productImage: "https://sun9-25.userapi.com/impg/dsKDTkLYpWXfVMYj_21Rn7CESXspaL3zrXGF3A/riTPmwVCVaw.jpg?size=750x1000&quality=95&sign=3f49cd35acc30ab4f3dea29e4e0540d6&type=album",  // Путь к изображению товара
                    weight: 0.2,
                },
                {
                    productName: "Lydsto Робот-пылесос G1, белый",
                    productPrice: 8099,
                    quantity: 1,
                    productImage: "https://sun9-27.userapi.com/impg/n4x2LZ7IpCfYgOAYedj3wkDaVS2CF1aATpCVDQ/0D8LB0AiXNs.jpg?size=1000x1000&quality=95&sign=9478ab570b9f6735a2536ec4cabf7777&type=album",
                    weight: 2.4,
                }
            ]
        },
        {
            date: "2024-10-09",        // Вторая дата доставки
            weight: 5,
            items: [
                {
                    productName: "Посудомоечная машина встраиваемая",
                    productPrice: 31513,
                    quantity: 1,
                    productImage: "/images/shtanga.jpg",
                    weight: 23.1,
                }
            ]
        }
    ]
};

export function orderPlacement() {
    return TemplateManager.templatize(document.getElementById('main'), '/src/scripts/components/order-placement/order-placement.hbs', orderData).then(() => {
        rightElementOfOrderPlacement()
    })
}
