import { CartData, CartProduct } from '../types/types'; // Импорт интерфейсов
//import { backurl } from "../../../../services/app/config";
//import { CART_URLS } from "./config";
import { cartDataTest } from "./test_date/date";

export class CartApiInterface {
  /**
   * Получение данных корзины.
   *
   * @returns {Promise<CartData>} Возвращает данные корзины
   */
  static async getCartData(): Promise<CartData> {
    return cartDataTest;
    /*
    try {
      const response = await fetch(`${backurl}${CART_URLS.getCarts.route}`, {
        method: CART_URLS.getCarts.method,
        headers: CART_URLS.getCarts.headers,
      });

      if (!response.ok) {
        throw new Error(`Ошибка при получении данных: ${response.status}`);
      }

      const data = await response.json();
      return CartApiInterface.transformCartData(data.body.products);
    } catch (error) {
      console.error('Ошибка:', error);
      throw error;
    }*/
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
      name: product.name,
      cost: product.cost,
      currency: product.currency,
      image_url: product.image_url,
      old_cost: product.old_cost ?? undefined,
      discount: product.discount ?? undefined,
      weight: product.weight,
      is_liked: product.is_liked,
      delivery_date: product.delivery_date,
      quantity: 1,
      isSingleItem: true,
      isSelected: true,
      url: `/catalog/product/${product.id}`,
    }));

    return {
      selectedCount: transformedProducts.filter(product => product.isSelected).length,
      products: transformedProducts,
    };
  }
}
