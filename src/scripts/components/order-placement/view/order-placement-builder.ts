import { rootId } from "@/services/app/config.ts";
import { orderData } from "../api/order-placement";
import { RightElementOfOrderPlacementView } from '@/scripts/components/order-placement/elements/right-element-of-order-placement/view/right-element-of-order-placement.ts';
import orderPlacement from './order-placement.hbs?raw';
import rightElementOfOrderPlacement from '../elements/right-element-of-order-placement/view/right-element-of-order-placement.hbs?raw';
import leftElementOfOrderPlacement from '../elements/left-element-of-order-placement/view/left-element-of-order-placement.hbs?raw';
import deliveryDatesList from '../elements/left-element-of-order-placement/elements/delivery-dates-list/view/delivery-dates-list.hbs?raw';
import productItem from '../elements/left-element-of-order-placement/elements/delivery-dates-list/elements/product-item/view/product-item.hbs?raw';
import Handlebars from "handlebars";

export class OrderPlacementBuilder {
    private readonly rootElement: HTMLElement | null;
    private rightElementOfOrderPlacementRoot: HTMLElement | null = null;
    private leftElementOfOrderPlacementRoot: HTMLElement | null = null;
    private deliveryDatesListRoot: HTMLElement | null = null;

    private readonly orderPlacementTemplate: HandlebarsTemplateDelegate;
    private readonly rightElementOfOrderPlacementTemplate: HandlebarsTemplateDelegate;
    private readonly leftElementOfOrderPlacementTemplate: HandlebarsTemplateDelegate;
    private readonly deliveryDatesListTemplate: HandlebarsTemplateDelegate;
    private readonly productItemTemplate: HandlebarsTemplateDelegate;

    constructor() {
        this.rootElement = document.getElementById(rootId);

        this.orderPlacementTemplate = Handlebars.compile(orderPlacement);
        this.rightElementOfOrderPlacementTemplate = Handlebars.compile(rightElementOfOrderPlacement);
        this.leftElementOfOrderPlacementTemplate = Handlebars.compile(leftElementOfOrderPlacement);
        this.deliveryDatesListTemplate = Handlebars.compile(deliveryDatesList);
        this.productItemTemplate = Handlebars.compile(productItem);

        // Регистрируем partial для товара
        Handlebars.registerPartial('product-item', this.productItemTemplate);
    }

    public async buildOrderPlacement(): Promise<void> {
        if (!this.rootElement) {
            throw new Error(`Root element with ID ${rootId} not found`);
        }

        try {
            await this.renderOrderPlacement();
            await this.renderLeftPart();
            this.initializeOrderPlacement();
        } catch (error) {
            console.error(error);
        }
    }

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

    private initializeOrderPlacement(): void {
        new RightElementOfOrderPlacementView();
    }
}
