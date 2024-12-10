import { ReviewsViewInterface } from '../types/types';
import { ReviewsApi } from '../api/api';
import { AddReviewView } from '../views/add_review';
import { AddReviewPresenter } from './AddReviewPresenter';
import { backurl } from '../../../../services/app/config';

export class ReviewsPresenter {
    /** @type {ReviewsApi} API для работы с отзывами */
    private api: any;

    /** @type {ReviewsViewInterface} Представление для отображения отзывов */
    private view: ReviewsViewInterface;

    private static readonly SORT_BY: string = 'rating'; // Параметр сортировки
    private static readonly SORT_ORDER: string = 'desc'; // Порядок сортировки

    /**
     * Конструктор ReviewsPresenter.
     * @param {ReviewsViewInterface} view - Интерфейс представления отзывов.
     */
    constructor(view: ReviewsViewInterface) {
        this.view = view;
    }

    /**
     * Инициализация презентера.
     * @param {string} id - Идентификатор объекта, для которого загружаются отзывы.
     * @param hash
     */
    init = (id: string, hash: any) => {
        this.api = ReviewsApi;

        this.loadReviews(id)
          .then(() => {
              if (hash) {
                  // console.log(hash);

                  const targetElement = document.getElementById(hash);
                  // console.log(targetElement);

                  if (targetElement) {
                      targetElement.scrollIntoView({ behavior: 'smooth' });
                  }
              }
        });
    };

    /**
     * Загружает отзывы с сервера.
     * @private
     * @param {string} id - Идентификатор объекта, для которого загружаются отзывы.
     * @returns {Promise<void>} Промис, который выполняется после загрузки отзывов.
     */
    private loadReviews = async (id: string) => {
        return this.api
            .fetchReviews(id, ReviewsPresenter.SORT_BY, ReviewsPresenter.SORT_ORDER)
            .then((reviewsData: any) => {
                const formattedReviews = {
                    total_review_count: reviewsData.total_review_count,
                    total_review_rating: reviewsData.total_review_rating,
                    reviews: reviewsData.reviews.map((review: any) => ({
                        name: review.is_private ? 'Аноним' : review.username,
                        avatar_url: `${backurl}/${review.avatar_url}`,
                        text: review.text,
                        rating: review.rating,
                        created_at: new Date(review.created_at).toLocaleString('ru-RU')
                    }))
                };

                this.view.render(id, formattedReviews);
                const view = new AddReviewView();
                new AddReviewPresenter(id, view, this.loadReviews);
            })
            .catch((err: Error) => {
                // console.error(123, err);

                if (err.message === 'Ошибка при загрузке отзывов: 404'){
                    const formattedReviews = {
                        total_review_count: 0,
                        total_review_rating: 0,
                        reviews: []
                    };

                    this.view.render(id, formattedReviews);
                    const view = new AddReviewView();
                    new AddReviewPresenter(id, view, this.loadReviews);

                    return;
                }

                this.view.renderError('Не удалось загрузить отзывы. Попробуйте позже.');
            });
    };
}
