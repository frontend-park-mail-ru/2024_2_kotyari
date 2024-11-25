/**
 * @interface ReviewsViewInterface
 * @description Интерфейс для представления отзывов.
 */
export interface ReviewsViewInterface {
    /**
     * Отображает данные отзывов.
     * @param {Object} data - Данные отзывов.
     * @param {Object[]} data.reviews - Список отзывов.
     * @param {number} data.total_review_count - Общее количество отзывов.
     * @param {number} data.total_review_rating - Общий рейтинг.
     */
    render(data: { reviews: { total_review_rating: any; reviews: any; total_review_count: any } }): void;

    /**
     * Отображает сообщение об ошибке.
     * @param {string} errorMessage - Текст сообщения об ошибке.
     */
    renderError(errorMessage: string): void;

    /**
     * Добавляет новый отзыв.
     * @param {any} newReview - Данные нового отзыва.
     */
    addNewReview(newReview: any): void;
}

/**
 * @typedef {Object} ReviewData
 * @description Тип данных для одного отзыва.
 * @property {number} rating - Рейтинг отзыва (от 1 до 5).
 * @property {string} comment - Текст отзыва.
 * @property {boolean} anonymous - Флаг анонимности отзыва.
 */
export type ReviewData = {
    rating: number;
    comment: string;
    anonymous: boolean;
};

