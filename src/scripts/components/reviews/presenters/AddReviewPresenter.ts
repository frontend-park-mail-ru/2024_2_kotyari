import {ReviewData} from "../types/types";
import {AddReviewView} from "../views/add_review";
import {ReviewsViewInterface} from "../types/types";
import {ReviewsApi} from "../api/api";

/**
 * Презентер для обработки логики добавления отзыва.
 */
export class AddReviewPresenter {
    private view: AddReviewView;
    private renderFunction: any;
    private readonly id: string;

    // Сообщения об ошибках
    private static readonly ERROR_MESSAGE_NETWORK = 'Ошибка сети, попробуйте позже';
    private static readonly ERROR_MESSAGE_UNKNOWN = 'Неизвестная ошибка';
    private static readonly ERROR_MESSAGE_SERVER = 'Ошибка сервера, попробуйте позже';
    private static readonly ERROR_MESSAGE_EXISTS = 'Отзыв уже существует';
    private static readonly ERROR_MESSAGE_BAD_REQUEST = 'Некорректный запрос';
    private static readonly ERROR_MESSAGE_SUBMIT = 'Не удалось отправить отзыв';
    private static readonly ERROR_MESSAGE_RATING = 'Пожалуйста, укажите рейтинг!';

    /**
     * Конструктор презентера.
     * @param {string} id - Идентификатор объекта, к которому добавляется отзыв.
     * @param {AddReviewView} view - Вью, управляющее UI добавления отзыва.
     * @param {Function} renderFunction - Функция для повторного рендеринга после добавления отзыва.
     */
    constructor(id: string, view: AddReviewView, renderFunction: any) {
        this.renderFunction = renderFunction;
        this.view = view;
        this.view.bindStarClick(this.handleStarClick.bind(this));
        this.view.bindSubmit(this.handleSubmit.bind(this));
        this.id = id;
    }

    /**
     * Обработчик клика по звезде рейтинга.
     * @param {number} rating - Выбранный рейтинг.
     */
    handleStarClick(rating: number): void {
        this.view.highlightStars(rating);
    }

    /**
     * Обработчик отправки отзыва.
     * @param {ReviewData} data - Данные отзыва, включая текст, рейтинг и анонимность.
     */
    async handleSubmit(data: ReviewData): Promise<void> {
        if (data.rating === 0) {
            this.view.displayMessage(AddReviewPresenter.ERROR_MESSAGE_RATING, 'error');
            return;
        }

        try {
            const response = await ReviewsApi.createReview(this.id, {
                text: data.comment,
                is_private: data.anonymous,
                rating: data.rating,
            });

            if (response.status === 201) {
                this.renderFunction(this.id);
            } else {
                this.view.displayMessage(AddReviewPresenter.ERROR_MESSAGE_SUBMIT, 'error');
            }
        } catch (error) {

            if (error.message) {
                switch (error.message) {
                    case '400':
                        this.view.displayMessage(AddReviewPresenter.ERROR_MESSAGE_BAD_REQUEST, 'error');
                        break;
                    case '409':
                        this.view.displayMessage(AddReviewPresenter.ERROR_MESSAGE_EXISTS, 'error');
                        break;
                    case '500':
                        this.view.displayMessage(AddReviewPresenter.ERROR_MESSAGE_SERVER, 'error');
                        break;
                    default:
                        this.view.displayMessage(AddReviewPresenter.ERROR_MESSAGE_UNKNOWN, 'error');
                }
            } else {
                this.view.displayMessage(AddReviewPresenter.ERROR_MESSAGE_NETWORK, 'error');
            }
        }
    }
}
