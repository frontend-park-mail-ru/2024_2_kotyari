import { CSATApi } from "../api/api";
import { RatingRequest } from "../types/types";
import { CSATView } from "../view/csat";
import string from 'vite-plugin-string';

export class CSATPresenter {
    private view: CSATView;

    constructor(placeId: string, type: string) {
        this.view = new CSATView;
    }

    public renderVote = (placeId: string, type: string) => {
        CSATApi.getRatingStats()
          .then(() => {

          })
          .catch((err) => {
              console.error('ошибка при запросе', err);
          })
    }

    public renderStats = (placeId: string, type: string) => {
        this.view.render(placeId, type);
    }

    async submitRating(rating: number, comment: string | null): Promise<void> {
        const request: RatingRequest = { rating, comment, type: "CSAT" };
        const response = await CSATApi.voteCSAT(request);
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
