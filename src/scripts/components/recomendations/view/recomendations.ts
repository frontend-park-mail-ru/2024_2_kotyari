import Handlebars from 'handlebars';
import { Product } from '../../card/api/card';
import { CardViewInterface } from '../../card/view/card';
import { DropdownConfig, DropdownPresenter } from '../../dropdown-btn/presenter/dropdown';
import {rootId} from "../../../../services/app/config";
import {b} from "vite/dist/node/types.d-aGj9QkWt";

export interface RecommendationsViewInterface {
    renderProducts(data: { products: Product[] , page_title?: string}, query: string, config: DropdownConfig, rootId?: string, show?: boolean, flag?: boolean, url?: string): void;
}

export class RecommendationsView implements RecommendationsViewInterface {
    private readonly cardView: CardViewInterface;

    constructor(cardView: CardViewInterface) {
        this.cardView = cardView;
    }

    public renderProducts = (data: { products: Product[] , page_title?: string}, query: string, config: DropdownConfig, newRootId: string = rootId, show: boolean = true, flag: boolean = false, url: string = '') => {
        data.page_title = '';

        this.cardView.render(data, query, newRootId, show, flag, url);

        const dropdownPresenter = new DropdownPresenter(config);
        dropdownPresenter.initView();
    };
}