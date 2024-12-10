import { CartData, CartProduct } from '../types/types'; // Импорт интерфейсов
import { backurl } from '../../../../services/app/config';
import { CART_URLS } from './config';
import { getWithCred } from '../../../../services/api/without-csrf';
import { csrf } from '../../../../services/api/CSRFService';

export class CartApiInterface {
  /**
   * Получение данных корзины.
   *
   * @returns {Promise<CartData>} Возвращает данные корзины
   */
  static async getCartData(): Promise<CartData> {
    return getWithCred(`${backurl}${CART_URLS.getCarts.route}`)
      .then(res => {
        if (res.status !== 200){
          throw Error(`Ошибка при получении данных: ${res.status} - ${res.body.error_message}`);
        }

        return CartApiInterface.transformCartData(res.body.products);
      })
  }

  /**
   * Обновление количества продукта в корзине.
   *
   * @param {string} productId - ID продукта
   * @param {number} count - Новое количество
   * @returns {Promise<void>}
   */
  static async updateProductQuantity(productId: string, count: number): Promise<void> {
    return csrf.patch(`${backurl}${CART_URLS.updateProductQuantity.route}${productId}`, { count })
      .then(res => {
        if (res.status !== 204) {
          throw new Error(`Ошибка при обновлении количества: ${res.status} - ${res.body.error_message}`);
        }
      })
  }

  /**
   * Выбор конкретного продукта.
   *
   * @param {string} productId - ID продукта
   * @param {boolean} isSelected - Статус выбора
   * @returns {Promise<void>}
   */
  static async selectProduct(productId: string, isSelected: boolean): Promise<void> {
    return csrf.patch(`${backurl}${CART_URLS.selectProduct.route}${productId}`, { 'is_selected' :isSelected })
      .then(res => {
        switch (res.status) {
          case 204:
            return;
          case 403:
            csrf.refreshToken();
        }

        //// console.error(`ошибка при выборе: ${res.status} - ${res.body}`);
        throw new Error(`${res.body}`);

      })
      /*.catch(err => {
        // console.error(err);
      })*/
  }

  /**
   * Выбор всех продуктов.
   *
   * @param {boolean} is_selected - Статус выбора
   * @returns {Promise<void>}
   */
  static async selectAllProducts(is_selected: boolean): Promise<void> {
    return csrf.patch(`${backurl}${CART_URLS.selectAllProducts.route}`, { 'is_selected': is_selected })
      .then(res => {
        switch (res.status) {
          case 204:
            return;
          case 403:
            csrf.refreshToken();
        }

        //// console.error(`ошибка при выборе: ${res.status} - ${res.body}`);
        throw new Error(`${res.body}`);

      })
      /*.catch(err => {
        // console.error(err);
      })*/
  }

  /**
   * Удаление выбранных продуктов из корзины.
   *
   * @returns {Promise<void>}
   */
  static async deleteSelectedProducts(): Promise<void> {
    return csrf.delete(`${backurl}${CART_URLS.deleteSelectedProducts.route}`, undefined)
      .then(res => {
        if (res.status !== 204) {
          throw new Error(`Ошибка при удалении выбранных продуктов: ${res.status} - ${res.body}`);
        }

        return Promise.resolve();
      })
  }

  /**
   * Преобразование данных продукта в соответствующий формат.
   *
   * @param {Array<any>} products - массив товаров, полученных из ответа API
   * @returns {CartData} Преобразованные данные корзины
   */
  static transformCartData(products: Array<any>): CartData {
    const transformedProducts: CartProduct[] = products.map((product: any) => ({
      id: product.id.toString(),
      name: product.title,
      cost: product.price,
      currency: product.currency,
      image_url: product.image_url,
      old_cost: product.original_price ?? undefined,
      discount: product.discount ?? undefined,
      quantity: product.count,
      isSelected: product.is_selected,
      isSingleItem: product.count === 1,
      is_liked: product.is_liked,
      url: `${CART_URLS.urlOfProduct}${product.id}`,
      weight: product.weight ?? 0,  // Добавьте weight, если это обязательное поле
      delivery_date: product.delivery_date ?? null,  // Добавьте delivery_date, если это обязательное поле
    }));

    return {
      selectedCount: transformedProducts.filter(product => product.isSelected).length,
      products: transformedProducts,
    };
  }

  /**
   * Удаление продукта из корзины.
   *
   * @param {string} productId - ID продукта
   * @returns {Promise<void>}
   */
  static async deleteProduct(productId: string): Promise<void> {
    return csrf.delete(`${backurl}${CART_URLS.deleteProduct.route}${productId}`)
      .then(res => {

        if (res.status !== 204) {
          throw new Error(`Ошибка при удалении продукта: ${res.status} - ${res.body}`);
        }

        return Promise.resolve();
      })
  }
}
