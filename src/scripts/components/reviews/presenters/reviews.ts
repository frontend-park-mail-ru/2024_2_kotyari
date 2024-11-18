import {ReviewData, ReviewsViewInterface} from "../types/types";
import { ReviewsApi } from "../api/api";
import {AddReviewView} from "../views/add_review";
import {AddReviewPresenter} from "./AddReviewPresenter";

export class ReviewsPresenter {
    private api: any;
    private view: ReviewsViewInterface;

    constructor(view: ReviewsViewInterface) {
        this.view = view;
    }

    init = (id: string) => {
        this.api = ReviewsApi;

        this.loadReviews(id).then(() => {

        });
    };

    private loadReviews = async (id: string) => {
        return this.api
            .fetchReviews(id)
            .then((reviewsData: any) => {
                const formattedReviews = {
                    total_review_count: reviewsData.total_review_count,
                    total_review_rating: reviewsData.total_review_rating,
                    reviews: reviewsData.reviews.map((review: any) => ({
                        name: review.is_private ? 'Аноним' : review.username,
                        avatar_url: review.avatar_url,
                        text: review.text,
                        rating: review.rating,
                        created_at: new Date(review.created_at).toLocaleString('ru-RU')
                    }))
                };

                this.view.render(formattedReviews);
                const view = new AddReviewView();
                new AddReviewPresenter(id, view);
            })
            .catch((err: Error) => {
                console.error(err);
                this.view.renderError('Не удалось загрузить отзывы. Попробуйте позже.');
            });
    };
}
