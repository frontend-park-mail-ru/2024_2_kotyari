export interface ReviewsViewInterface {
    render(data: { reviews: { total_review_rating: any; reviews: any; total_review_count: any } }): void;
    renderError(errorMessage: string): void;
    addNewReview(newReview: any): void;
}

export type ReviewData = {
    rating: number;
    comment: string;
    anonymous: boolean;
    name: string;
};

