import {DataSamplingView} from '@/scripts/components/cart/elements/data-sampling/view/data-sampling.ts';
import {CartPresenter} from '@/scripts/components/cart/presenter/cart.ts';
import {CartApiInterface} from "../api/cart-api";
import {rootId} from "@/services/app/config.ts";
import cart from './cart.hbs?raw';
import leftCards from '../elements/left-cards/view/left-cards.hbs?raw';
import rightElementOfCart from '../elements/right-element-of-cart/view/right-element-of-cart.hbs?raw';
import dataSampling from '../elements/data-sampling/view/data-sampling.hbs?raw';
import Handlebars from "handlebars";
import {CartData} from "../types/types";

/**
 * Класс для сборки и отображения корзины на странице.
 * @class CartBuilder
 */
export class CartBuilder {
    /**
     * Корневой HTML-элемент, в который будет рендериться корзина.
     * @private {HTMLElement | null}
     */
    private readonly rootElement: HTMLElement | null;

    /**
     * HTML-элемент для левой части корзины.
     * @private {HTMLElement | null}
     */
    private leftCardsRoot: HTMLElement | null = null;

    /**
     * HTML-элемент для правой части корзины.
     * @private {HTMLElement | null}
     */
    private rightElementOfCartRoot: HTMLElement | null = null;

    /**
     * HTML-элемент для блока с выбором данных.
     * @private {HTMLElement | null}
     */
    private dataSamplingRoot: HTMLElement | null = null;

    /**
     * Данные корзины.
     * @private {CartData | {}}
     */
    private cartData: CartData | {};

    /**
     * Скомпилированный шаблон для левой части корзины.
     * @private {HandlebarsTemplateDelegate}
     */
    private readonly leftCardsTemplate: HandlebarsTemplateDelegate;

    /**
     * Скомпилированный шаблон для правой части корзины.
     * @private {HandlebarsTemplateDelegate}
     */
    private readonly rightElementOfCartTemplate: HandlebarsTemplateDelegate;

    /**
     * Скомпилированный шаблон для блока с выбором данных.
     * @private {HandlebarsTemplateDelegate}
     */
    private readonly dataSamplingTemplate: HandlebarsTemplateDelegate;

    /**
     * Скомпилированный шаблон для всей страницы корзины.
     * @private {HandlebarsTemplateDelegate}
     */
    private readonly cartTemplate: HandlebarsTemplateDelegate;

    /**
     * Конструктор класса. Инициализирует корневой элемент и компилирует Handlebars-шаблоны.
     */
    constructor() {
        this.rootElement = document.getElementById(rootId);

        this.cartTemplate = Handlebars.compile(cart);
        this.leftCardsTemplate = Handlebars.compile(leftCards);
        this.rightElementOfCartTemplate = Handlebars.compile(rightElementOfCart);
        this.dataSamplingTemplate = Handlebars.compile(dataSampling);
    }

    /**
     * Основной метод для сборки и отображения корзины.
     * Выполняет отрисовку и инициализацию презентера корзины.
     * @public
     * @async
     * @returns {Promise<void>}
     * @throws {Error} Если корневой элемент не найден.
     */
    public async buildCart(): Promise<void> {
        if (!this.rootElement) {
            throw new Error(`Root element with ID ${rootId} not found`);
        }

        try {
            await this.renderCart();
            this.initializeCartPresenter();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Выполняет отрисовку корзины и заполняет её данные.
     * @private
     * @async
     * @returns {Promise<void>}
     * @throws {Error} Если не удалось отрисовать корзину.
     */
    private async renderCart(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            //this.rootElement.innerHTML='';
            // Вставляем основной шаблон корзины на страницу.
            this.rootElement.insertAdjacentHTML('beforeend', this.cartTemplate([]));

            this.leftCardsRoot = document.getElementById('left-cards');
            this.rightElementOfCartRoot = document.getElementById('right-element-of-cart');
            this.dataSamplingRoot = document.getElementById('data-sampling');

            if (this.leftCardsRoot && this.rightElementOfCartRoot && this.dataSamplingRoot) {
                this.cartData = await CartApiInterface.getCartData();

                // Очищаем содержимое блоков перед добавлением новых данных.
                this.leftCardsRoot.innerHTML = '';
                this.rightElementOfCartRoot.innerHTML = '';
                this.dataSamplingRoot.innerHTML = '';

                // Вставляем шаблоны с данными в соответствующие блоки.
                this.leftCardsRoot.insertAdjacentHTML('beforeend', this.leftCardsTemplate(this.cartData));
                this.rightElementOfCartRoot.insertAdjacentHTML('beforeend', this.rightElementOfCartTemplate(this.cartData));
                this.dataSamplingRoot.insertAdjacentHTML('beforeend', this.dataSamplingTemplate(this.cartData));

                resolve();
            } else {
                reject(new Error('Ошибка отрисовки cart'));
            }
        });
    }

    /**
     * Инициализирует CartPresenter для управления корзиной.
     * @private
     */
    private initializeCartPresenter(): void {
        const dataSamplingView = new DataSamplingView();
        const cartPresenter = new CartPresenter(dataSamplingView, this.cartData);

        cartPresenter.initializeCart();
    }
}
