import { CartData, CartProduct } from '../types/types'; // Импорт интерфейсов
import { backurl } from "../../../../services/app/config";
import { CART_URLS } from "./config";

export class CartApiInterface {
  /**
   * Получение данных корзины.
   *
   * @returns {Promise<CartData>} Возвращает данные корзины
   */
  static async getCartData(): Promise<CartData> {
    try {
      const response = await fetch(`${backurl}${CART_URLS.getCarts.route}`, {
        method: CART_URLS.getCarts.method,
        credentials: 'include',
        headers: CART_URLS.getCarts.headers,
      });

      if (!response.ok) {
        throw Error(`Ошибка при получении данных: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);

      return CartApiInterface.transformCartData(data.body.products);
    } catch (error) {
      console.error('Ошибка:', error);
      throw error;
    }
  }

  /**
   * Обновление количества продукта в корзине.
   *
   * @param {string} productId - ID продукта
   * @param {number} count - Новое количество
   * @returns {Promise<void>}
   */
  static async updateProductQuantity(productId: string, count: number): Promise<void> {
    const response = await fetch(`${backurl}${CART_URLS.updateProductQuantity.route}${productId}`, {
      method: CART_URLS.updateProductQuantity.method,
      credentials: 'include',
      headers: CART_URLS.updateProductQuantity.headers,
      body: JSON.stringify({ count }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка при обновлении количества: ${response.status}`);
    }
  }

  /**
   * Выбор конкретного продукта.
   *
   * @param {string} productId - ID продукта
   * @param {boolean} isSelected - Статус выбора
   * @returns {Promise<void>}
   */
  static async selectProduct(productId: string, isSelected: boolean): Promise<void> {
    const response = await fetch(`${backurl}${CART_URLS.selectProduct.route}${productId}`, {
      method: CART_URLS.selectProduct.method,
      credentials: 'include',
      headers: CART_URLS.selectProduct.headers,
      body: JSON.stringify({ 'is_selected' :isSelected }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка при выборе продукта: ${response.status}`);
    }
  }

  /**
   * Выбор всех продуктов.
   *
   * @param {boolean} is_selected - Статус выбора
   * @returns {Promise<void>}
   */
  static async selectAllProducts(is_selected: boolean): Promise<void> {
    const response = await fetch(`${backurl}${CART_URLS.selectAllProducts.route}`, {
      method: CART_URLS.selectAllProducts.method,
      credentials: 'include',
      headers: CART_URLS.selectAllProducts.headers,
      body: JSON.stringify({'is_selected': is_selected}),
    });

    if (!response.ok) {
      throw new Error(`Ошибка при выборе всех продуктов: ${response.status}`);
    }
  }

  /**
   * Удаление выбранных продуктов из корзины.
   *
   * @returns {Promise<void>}
   */
  static async deleteSelectedProducts(): Promise<void> {
    const response = await fetch(`${backurl}${CART_URLS.deleteSelectedProducts.route}`, {
      method: CART_URLS.deleteSelectedProducts.method,
      credentials: 'include',
      headers: CART_URLS.deleteSelectedProducts.headers,
    });

    if (!response.ok) {
      console.log('123');
      throw new Error(`Ошибка при удалении выбранных продуктов: ${response.status}`);
    }

    console.log('321');

    return Promise.resolve();
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
    const response = await fetch(`${backurl}${CART_URLS.deleteProduct.route}${productId}`, {
      method: CART_URLS.deleteProduct.method,
      credentials: 'include',
      headers: CART_URLS.deleteProduct.headers,
    });

    if (!response.ok) {
      console.log('123');
      throw new Error(`Ошибка при удалении продукта: ${response.status}`);
    }

    console.log('321');

    return Promise.resolve();
  }
}
