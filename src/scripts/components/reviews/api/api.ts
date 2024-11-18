import { backurl } from '../../../../services/app/config';
import { csrf } from '../../../../services/api/CSRFService';
import { get } from '../../../../services/api/without-csrf';

export class ReviewsApi {
  protected readonly baseUrl: string;

  constructor() {
    this.baseUrl = backurl;
  }

  /**
   * Получение отзывов для продукта.
   *
   * @param {string} id - ID продукта
   * @returns {Promise<any[]>} Массив отзывов
   */
  static fetchReviews(id: string) {
    return get(backurl + '/product/' + id + '/reviews')
        .then(response => {
          if (response.status !== 200) {
            throw new Error(`Ошибка при загрузке отзывов: ${response.status}`);
          }

          return response.body;
        });
  }

  /**
   * Отправка отзыва.
   *
   * @param productId
   * @param {Object} review - Объект отзыва
   * @param {string} review.author - Автор отзыва
   * @param {string} review.text - Текст отзыва
   * @returns {Promise<void>}
   */
  static async createReview(productId: string, review: { text: string; is_private: boolean; rating: number }): Promise<void> {
      console.log('api', productId, review)

      return csrf.post(`${backurl}/product/${productId}/reviews`, review)
          .then((response) => {
              if (response.status !== 201) {
                  throw new Error(`Ошибка создания отзыва: ${response.status}`);
              }
          });
  }
}
