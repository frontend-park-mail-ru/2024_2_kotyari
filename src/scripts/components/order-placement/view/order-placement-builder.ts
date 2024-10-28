import { rootId } from "@/services/app/config.ts";
import { orderData } from "../api/order-placement";
import { RightElementOfOrderPlacementView } from '@/scripts/components/order-placement/elements/right-element-of-order-placement/view/right-element-of-order-placement.ts';
import orderPlacement from './order-placement.hbs?raw';
import rightElementOfOrderPlacement from '../elements/right-element-of-order-placement/view/right-element-of-order-placement.hbs?raw';
import leftElementOfOrderPlacement from '../elements/left-element-of-order-placement/view/left-element-of-order-placement.hbs?raw';
import deliveryDatesList from '../elements/left-element-of-order-placement/elements/delivery-dates-list/view/delivery-dates-list.hbs?raw';
import productItem from '../elements/left-element-of-order-placement/elements/delivery-dates-list/elements/product-item/view/product-item.hbs?raw';
import Handlebars from "handlebars";
import {OrderData} from "../types/types";
import Router from "../../../../services/app/router";

/**
 * Класс для построения и управления процессом оформления заказа.
 *
 * @class OrderPlacementBuilder
 */
export class OrderPlacementBuilder {
    /**
     * Корневой элемент страницы.
     *
     * @private
     * @type {HTMLElement | null}
     */
    private readonly rootElement: HTMLElement | null;

    /**
     * Корневой элемент правой части оформления заказа.
     *
     * @private
     * @type {HTMLElement | null}
     */
    private rightElementOfOrderPlacementRoot: HTMLElement | null = null;

    /**
     * Корневой элемент левой части оформления заказа.
     *
     * @private
     * @type {HTMLElement | null}
     */
    private leftElementOfOrderPlacementRoot: HTMLElement | null = null;

    /**
     * Корневой элемент для списка дат доставки.
     *
     * @private
     * @type {HTMLElement | null}
     */
    private deliveryDatesListRoot: HTMLElement | null = null;

    /**
     * Данные заказа.
     *
     * @private
     * @type {OrderData}
     */
    private orderData: OrderData;

    /**
     * Шаблон оформления заказа.
     *
     * @private
     * @type {HandlebarsTemplateDelegate}
     */
    private readonly orderPlacementTemplate: HandlebarsTemplateDelegate;

    /**
     * Шаблон правой части оформления заказа.
     *
     * @private
     * @type {HandlebarsTemplateDelegate}
     */
    private readonly rightElementOfOrderPlacementTemplate: HandlebarsTemplateDelegate;

    /**
     * Шаблон левой части оформления заказа.
     *
     * @private
     * @type {HandlebarsTemplateDelegate}
     */
    private readonly leftElementOfOrderPlacementTemplate: HandlebarsTemplateDelegate;

    /**
     * Шаблон списка дат доставки.
     *
     * @private
     * @type {HandlebarsTemplateDelegate}
     */
    private readonly deliveryDatesListTemplate: HandlebarsTemplateDelegate;

    /**
     * Шаблон элемента товара.
     *
     * @private
     * @type {HandlebarsTemplateDelegate}
     */
    private readonly productItemTemplate: HandlebarsTemplateDelegate;

    /**
     * Конструктор класса. Выполняет инициализацию данных и компиляцию шаблонов.
     */
    constructor() {
        this.rootElement = document.getElementById(rootId);
        this.orderData = orderData;

        this.orderPlacementTemplate = Handlebars.compile(orderPlacement);
        this.rightElementOfOrderPlacementTemplate = Handlebars.compile(rightElementOfOrderPlacement);
        this.leftElementOfOrderPlacementTemplate = Handlebars.compile(leftElementOfOrderPlacement);
        this.deliveryDatesListTemplate = Handlebars.compile(deliveryDatesList);
        this.productItemTemplate = Handlebars.compile(productItem);

        // Регистрируем partial для товара
        Handlebars.registerPartial('product-item', this.productItemTemplate);
    }

    /**
     * Строит процесс оформления заказа. Если корневой элемент не найден,
     * выбрасывает ошибку или перенаправляет пользователя в корзину.
     *
     * @public
     * @returns {Promise<void>}
     */
    public async buildOrderPlacement(): Promise<void> {
        if (!this.rootElement) {
            throw new Error(`Root element with ID ${rootId} not found`);
        }

        if (!this.orderData.deliveryDates) {
            const router = new Router();
            return router.navigate('/cart')
        }

        try {
            await this.renderOrderPlacement();
            await this.renderLeftPart();
            this.initializeOrderPlacement();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Рендерит структуру оформления заказа.
     *
     * @private
     * @returns {Promise<void>}
     */
    private async renderOrderPlacement(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.rootElement.innerHTML='';
            this.rootElement!.insertAdjacentHTML('beforeend', this.orderPlacementTemplate([]));

            this.rightElementOfOrderPlacementRoot = document.getElementById('right-element-of-order-placement');
            this.leftElementOfOrderPlacementRoot = document.getElementById('left-element-of-order-placement');

            if (this.rightElementOfOrderPlacementRoot &&
                this.leftElementOfOrderPlacementRoot) {

                // Очищаем элементы перед вставкой
                this.rightElementOfOrderPlacementRoot.innerHTML = '';
                this.leftElementOfOrderPlacementRoot.innerHTML = '';

                // Рендерим правую и левую часть оформления заказа
                this.rightElementOfOrderPlacementRoot.insertAdjacentHTML(
                    'beforeend',
                    this.rightElementOfOrderPlacementTemplate(orderData)
                );

                this.leftElementOfOrderPlacementRoot.insertAdjacentHTML(
                    'beforeend',
                    this.leftElementOfOrderPlacementTemplate(orderData)
                );

                resolve();
            } else {
                reject(new Error('Ошибка отрисовки данных.'));
            }
        });
    }

    /**
     * Рендерит левую часть оформления заказа, включая список дат доставки.
     *
     * @private
     * @returns {Promise<void>}
     */
    private async renderLeftPart(): Promise<void> {
        this.deliveryDatesListRoot = document.getElementById('data-sampling');

        //this.deliveryDatesListRoot.innerHTML = '';

        if (this.deliveryDatesListRoot) {
            // Рендерим список дат доставки с товарами
            this.deliveryDatesListRoot.insertAdjacentHTML(
                'beforeend',
                this.deliveryDatesListTemplate({deliveryDates: orderData.deliveryDates})
            );
        }
    };

    /**
     * Инициализирует правую часть оформления заказа.
     *
     * @private
     * @returns {void}
     */
    private initializeOrderPlacement(): void {
        new RightElementOfOrderPlacementView();
    }
}
