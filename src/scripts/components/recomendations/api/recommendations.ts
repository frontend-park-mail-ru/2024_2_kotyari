import { get } from '../../../../services/api/without-csrf';
import { backurl } from '../../../../services/app/config';
import { Product } from '../../card/api/card';
import {RECOMMENDATIONS_URLS} from "./config";

export interface RecommendationsApiInterface {
    getProducts(id: number): Promise<Product[] | null>;
}

export class RecommendationsApi implements RecommendationsApiInterface {
    constructor() {

    }

    // getProducts = (id: number): Promise<Product[] | null> => {
    //     return get(backurl + RECOMMENDATIONS_URLS.GET_PRODUCTS + id)
    //         .then((res) => {
    //             return res.body as Product[];
    //         })
    //         .catch(() => {
    //             return null;
    //         });
    // };

    getProducts = async (id: number): Promise<Product[]> => {
        return Array.from({ length: 20 }, (_, index) => ({
            id: index + 1,
            title: `Product ${index + 1}`,
            description: `Description for product ${index + 1}`,
            price: 1000 + index * 10,
            originalPrice: 1200 + index * 10,
            discount: 200,
            count: 100,
            rating: 4.5,
            image_url: `https://via.placeholder.com/150?text=Product+${index + 1}`,
        }));
    };
}