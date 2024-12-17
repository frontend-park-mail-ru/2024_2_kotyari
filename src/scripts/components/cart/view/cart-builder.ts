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
import {RightCartView} from "../elements/right-element-of-cart/view/calculate-cart-totals";
import { backurl } from '../../../../services/app/config';

/**
 * Класс для сборки и отображения корзины на странице.
 * @class CartBuilder
 */
export class CartBuilder {
    /**
     * Корневой HTML-элемент, в который будет рендериться корзина.
     * @private {HTMLElement | null}
     */
    private rootElement: HTMLElement | null;

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
        try {
            await this.renderCart();
            this.initializeCartPresenter();
        } catch (error) {
            // console.error(error);
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
            this.rootElement = document.getElementById(rootId);

            if (!this.rootElement) {
                throw new Error(`Root element with ID ${rootId} not found`);
            }

            this.rootElement.insertAdjacentHTML('beforeend', this.cartTemplate([]));

            this.leftCardsRoot = document.getElementById('left-cards');
            this.rightElementOfCartRoot = document.getElementById('right-element-of-cart');
            this.dataSamplingRoot = document.getElementById('data-sampling');

            if (this.leftCardsRoot && this.rightElementOfCartRoot && this.dataSamplingRoot) {
                try {
                    this.cartData = await CartApiInterface.getCartData();

                    if (!this.cartData || this.cartData.products.length === 0) {
                        const cartView = new RightCartView();
                        cartView.updateEmptyCart();
                        resolve();
                        return;
                    }

                    this.cartData.products.forEach((cart) => {
                        cart.image_url = `${backurl}/${cart.image_url}`;
                    });

                    this.leftCardsRoot.innerHTML = '';
                    this.rightElementOfCartRoot.innerHTML = '';
                    this.dataSamplingRoot.innerHTML = '';

                    this.leftCardsRoot.insertAdjacentHTML('beforeend', this.leftCardsTemplate(this.cartData));
                    this.rightElementOfCartRoot.insertAdjacentHTML('beforeend', this.rightElementOfCartTemplate(this.cartData));
                    this.dataSamplingRoot.insertAdjacentHTML('beforeend', this.dataSamplingTemplate(this.cartData));

                    resolve();
                } catch (error) {
                    if (error.message.includes('404')) {
                        this.leftCardsRoot.innerHTML = '';
                        this.rightElementOfCartRoot.innerHTML = '';
                        this.dataSamplingRoot.innerHTML = '';

                        this.leftCardsRoot.insertAdjacentHTML('beforeend', this.leftCardsTemplate(this.cartData));
                        this.rightElementOfCartRoot.insertAdjacentHTML('beforeend', this.rightElementOfCartTemplate(this.cartData));
                        this.dataSamplingRoot.insertAdjacentHTML('beforeend', this.dataSamplingTemplate(this.cartData));

                        const rightCartView = new RightCartView();
                        rightCartView.updateEmptyCart();
                        resolve();
                    } else {
                        reject(new Error('Ошибка отрисовки cart'));
                    }
                }
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
