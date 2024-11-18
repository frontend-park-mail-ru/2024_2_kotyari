import {ReviewData} from "../types/types";
import {AddReviewView} from "../views/add_review";
import {ReviewsApi} from "../api/api";

export class AddReviewPresenter {
    private view: AddReviewView;
    private readonly id: string;

    constructor(id: string, view: AddReviewView) {
        this.view = view;
        this.view.bindStarClick(this.handleStarClick.bind(this));
        this.view.bindSubmit(this.handleSubmit.bind(this));
        this.id = id;
    }

    handleStarClick(rating: number): void {
        this.view.highlightStars(rating);
    }

    async handleSubmit(data: ReviewData): Promise<void> {
        try {
            console.log('Submitting review:', data);

            await ReviewsApi.createReview(this.id, {
                text: data.comment,
                is_private: data.anonymous,
                rating: data.rating,
            });

            console.log('Review submitted successfully!');
            this.view.displayMessage('Отзыв отправлен!', 'success');
        } catch (error) {
            console.error('Error submitting review:', error);
            this.view.displayMessage('Ошибка при отправке отзыва', 'error');
        }
    }
}
