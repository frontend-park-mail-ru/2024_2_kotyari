import { backurl } from '../../../../services/app/config';
import { csrf } from '../../../../services/api/CSRFService';
import { get } from '../../../../services/api/without-csrf';

/**
 * API для работы с отзывами.
 */
export class ReviewsApi {
    /** Базовый URL для API. */
  protected readonly baseUrl: string;

    /** HTTP-код успешного ответа. */
    protected static readonly HTTP_OK: number = 200;

    /** HTTP-код успешного создания. */
    protected static readonly HTTP_CREATED: number = 201;

  constructor() {
    this.baseUrl = backurl;
  }

    /**
     * Получение отзывов для продукта.
     *
     * @param {string} id - ID продукта.
     * @param {string} sortBy - Тип сортировки.
     * @param {string} sortOrder - Порядок сортировки (asc/desc).
     * @returns {Promise<any[]>} Массив отзывов.
     * @throws {Error} В случае ошибки с кодом ответа.
     */
  static fetchReviews(id: string, sortBy: string, sortOrder: string) {
    return get(backurl + '/product/' + id + '/reviews?sort=' + sortBy + '&order=' + sortOrder)
        .then(response => {
          if (response.status !== ReviewsApi.HTTP_OK) {
            throw new Error(`Ошибка при загрузке отзывов: ${response.status}`);
          }

          return response.body;
        });
  }

    /**
     * Отправка отзыва.
     *
     * @param {string} productId - ID продукта.
     * @param {Object} review - Объект отзыва.
     * @param {string} review.text - Текст отзыва.
     * @param {boolean} review.is_private - Приватность отзыва.
     * @param {number} review.rating - Рейтинг продукта.
     * @returns {Promise<Response>} Ответ сервера.
     * @throws {Error} В случае ошибки с кодом ответа.
     */
  static async createReview(productId: string, review: { text: string; is_private: boolean; rating: number }): Promise<Response> {
      try {
          const response = await csrf.post(`${backurl}/product/${productId}/reviews`, review);

          if (response.status !== ReviewsApi.HTTP_CREATED) {
              throw new Error(`${response.status}`);
          }

          return response;
      } catch (error) {
          throw error;
      }
  }
}
