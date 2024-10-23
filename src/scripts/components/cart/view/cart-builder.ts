import { DataSamplingView } from '@/scripts/components/cart/elements/data-sampling/view/data-sampling.ts';
import { CartPresenter } from '@/scripts/components/cart/presenter/cart.ts';
import { cartData } from '@/scripts/components/cart/api/products.ts';
import { rootId } from "@/services/app/config.ts";
import cart from './cart.hbs?raw';
import leftCards from '../elements/left-cards/view/left-cards.hbs?raw';
import rightElementOfCart from '../elements/right-element-of-cart/view/right-element-of-cart.hbs?raw';
import dataSampling from '../elements/data-sampling/view/data-sampling.hbs?raw';
import Handlebars from "handlebars";

export class CartBuilder {
    private readonly rootElement: HTMLElement | null;
    private leftCardsRoot: HTMLElement | null = null;
    private rightElementOfCartRoot: HTMLElement | null = null;
    private dataSamplingRoot: HTMLElement | null = null;

    // Handlebars-шаблоны компилируются в конструкторе
    private readonly leftCardsTemplate: HandlebarsTemplateDelegate;
    private readonly rightElementOfCartTemplate: HandlebarsTemplateDelegate;
    private readonly dataSamplingTemplate: HandlebarsTemplateDelegate;
    private readonly cartTemplate: HandlebarsTemplateDelegate;

    constructor() {
        this.rootElement = document.getElementById(rootId);

        this.cartTemplate = Handlebars.compile(cart);
        this.leftCardsTemplate = Handlebars.compile(leftCards);
        this.rightElementOfCartTemplate = Handlebars.compile(rightElementOfCart);
        this.dataSamplingTemplate = Handlebars.compile(dataSampling);
    }

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

    private async renderCart(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // Вставляем тело страницы
            this.rootElement.insertAdjacentHTML('beforeend', this.cartTemplate([]));

            this.leftCardsRoot = document.getElementById('left-cards');
            this.rightElementOfCartRoot = document.getElementById('right-element-of-cart');
            this.dataSamplingRoot = document.getElementById('data-sampling');

            if (this.leftCardsRoot && this.rightElementOfCartRoot && this.dataSamplingRoot) {
                this.leftCardsRoot.innerHTML = '';
                this.rightElementOfCartRoot.innerHTML = '';
                this.dataSamplingRoot.innerHTML = '';

                this.leftCardsRoot.insertAdjacentHTML('beforeend', this.leftCardsTemplate(cartData));
                this.rightElementOfCartRoot.insertAdjacentHTML('beforeend', this.rightElementOfCartTemplate(cartData));
                this.dataSamplingRoot.insertAdjacentHTML('beforeend', this.dataSamplingTemplate(cartData));

                resolve();
            } else {
                reject(new Error('Ошибка отрисовки cart'));
            }
        });
    }

    private initializeCartPresenter(): void {
        const dataSamplingView = new DataSamplingView();
        const cartPresenter = new CartPresenter(dataSamplingView);

        cartPresenter.initializeCart();
    }
}
