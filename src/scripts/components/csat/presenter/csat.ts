import { CSATApi } from "../api/api";
import { RatingRequest } from "../types/types";
import { CSATView } from "../view/csat";
import string from 'vite-plugin-string';

export class CSATPresenter {
    private view: CSATView;

    constructor() {
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
}
