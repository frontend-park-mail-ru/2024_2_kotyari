import { CSATApi } from "../api/api";
import { RatingRequest } from "../types/types";
import { CSATView } from "../view/csat";

export class CSATPresenter {
    private view: CSATView;

    constructor(placeId: string, type: string) {
        this.view = new CSATView;
        this.init(placeId, type);
    }

    private async init(placeId: string, type: string): Promise<void> {
        //const response = await CSATApi.checkIfRated();

        const status = 400;
        //if (response.status === 200) {
        if (status === 200) {
            console.log(response)

            const stats = await CSATApi.getRatingStats();
            if (stats.status === 200 && stats.body) {
                //this.view.showStats(stats.body.rating);
            }
        } else {
            console.log(2)
            this.view.render(placeId, type);
        }
    }

    async submitRating(rating: number, comment: string | null): Promise<void> {
        const request: RatingRequest = { rating, comment, type: "CSAT" };
        const response = await CSATApi.postRating(request);
        if (response.status === 200) {
            const stats = await CSATApi.getRatingStats();
            if (stats.status === 200 && stats.body) {
                //this.view.showStats(stats.body.rating);
            }
        } else {
            this.view.showError(response.message);
        }
    }
}
