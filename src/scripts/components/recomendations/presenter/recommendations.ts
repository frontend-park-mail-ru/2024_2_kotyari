import { RecommendationsApiInterface } from '../api/recommendations';
import { RecommendationsViewInterface } from '../view/recomendations';
import { backurl } from '../../../../services/app/config';
import { router } from '../../../../services/app/init';
import { DropdownConfig, DropdownPresenter } from '../../dropdown-btn/presenter/dropdown';
import { DropdownAPI } from '../../dropdown-btn/api/dropdown';


export class Recommendations {
    private api: RecommendationsApiInterface;
    private view: RecommendationsViewInterface;
    private dropdownPresenter: DropdownPresenter;
    private apiEndpoint = '/product/';
    private readonly config: DropdownConfig;
    private readonly id: number | null = null;
    private readonly name: string | null = null;

    constructor(api: RecommendationsApiInterface, view: RecommendationsViewInterface) {
        this.api = api;
        this.view = view;

        this.config = {
            containerId: 'sort-container',
            sortOptions: [
                { value: 'price_asc', text: 'Сначала дешевле' },
                { value: 'price_desc', text: 'Сначала дороже'},
                { value: 'rating', text: 'По рейтингу' },
            ],
            apiEndpoint: this.apiEndpoint,
            defaultSort: 'cost',
            defaultOrder: 'asc',
            onSortChange: this.handleSortChange,
        };
    }

    private handleSortChange = (sortOrder: string): void => {
        if (!this.id || !this.name) return;

        // Маппинг значений sortOrder в параметры sort и order
        let sort: string;
        let order: string;

        switch (sortOrder) {
            case 'price_asc':
                sort = 'price';
                order = 'asc';
                break;
            case 'price_desc':
                sort = 'price';
                order = 'desc';
                break;
            default:
                sort = 'rating';
                order = 'desc';
                break;
        }

        router.navigate(`${this.apiEndpoint}/${this.id}/recommendations?sort=${sort}&order=${order}`);

        this.recommendationsProducts(this.id, this.name, sort, order);
    };

    async render(id: number, name: string, rootId: string) {
        this.id = id;
        this.name = name;

        const products = {products: await this.api.getProducts(this.id)};

        if (products.products.length > 6) {
            products.more = true;
            products.products = products.products.slice(0, 6);
        }

        this.view.renderProducts(products, 'Похожее на ' + this.name, this.config, rootId, false, true, this.apiEndpoint + this.id + '/recommendations' + `?id=${this.id}&title=${this.name}`);
    }

    public recommendationsProducts(id: number, name: string, sort: string, order: string) {
        DropdownAPI.sortProducts(`${backurl}${this.apiEndpoint}/${id}/recommendations`, sort, order)
            .then(async (productsApi) => {
                let products;

                if (productsApi !== undefined) {
                    products = productsApi.body;
                    products.forEach((card: any) => {
                        card.image_url = `${backurl}/${card.image_url}`;
                    });
                } else {
                    products = {};
                }

                await this.view.renderProducts({products: products}, 'Похожее на ' + name, this.config);
            })
            .catch(() => {
                return
            });
    }
}