import { apiResponse } from '../../../../services/api/utils';
import { csrf } from '../../../../services/api/CSRFService';
import { backurl } from '../../../../services/app/config';
import { getWithCred } from '../../../../services/api/without-csrf';

export class WishlistApi {
  static async getWishlists() {
    try {
      const response = await getWithCred(`${backurl}/wishlists`);

      if (response.status === 404 || response.status === 400) {
        return [];
      }

      if (!response.status) {
        throw new Error(`Ошибка при получении списка вишлистов: ${response.status}`);
      }

      console.log(response.body);

      return await response.body;
    } catch (error) {
      console.error('Ошибка при получении списка вишлистов:', error);
      // В случае любой другой ошибки возвращаем пустой массив
      return [];
    }
  }

  static async getWishlist(link: string) {
    const response = await getWithCred(`${backurl}/wishlist/${link}`);
    if (response.status === 400) {
      return [];
    }

    return response.body;
  }

  /**
   * Создаёт новый вишлист.
   * @param name Название вишлиста.
   */
  static async createWishlist(name: string): Promise<apiResponse> {
    await csrf.refreshToken()

    return csrf.post(`${backurl}/wishlists`, { 'name': name });
  }

  /**
   * Удаляет вишлист.
   * @param link Уникальная ссылка на вишлист.
   */
  static async deleteWishlist(link: string): Promise<apiResponse> {
    const body = { link };
    await csrf.refreshToken()

    return csrf.delete(`${backurl}/wishlists`, body);
  }

  /**
   * Переименовывает вишлист.
   * @param link Уникальная ссылка на вишлист.
   * @param newName Новое название вишлиста.
   */
  static async renameWishlist(link: string, newName: string): Promise<apiResponse> {
    const body = { link, new_name: newName };
    await csrf.refreshToken()

    return csrf.patch(`${backurl}/wishlist`, body);
  }

  /**
   * Добавляет продукт в указанные вишлисты.
   * @param productId ID продукта.
   * @param links Ссылки на вишлисты.
   */
  static async addProductToWishlist(productId: number, links: string[]): Promise<apiResponse> {
    const body = { product_id: productId, links };
    await csrf.refreshToken()

    return csrf.post(`${backurl}/wishlists/product`, body);
  }

  /**
   * Удаляет продукт из указанных вишлистов.
   * @param productId ID продукта.
   * @param links Ссылки на вишлисты.
   */
  static async removeFromWishlist(productId: number, links: string[]): Promise<apiResponse> {
    const body = { product_id: productId, links };
    await csrf.refreshToken()

    return csrf.delete(`${backurl}/wishlists/product`, body);
  }

  /**
   * Копирует вишлист.
   * @param link Ссылка на вишлист.
   */
  static async copyWishlist(link: string): Promise<apiResponse> {
    const body = { link };
    await csrf.refreshToken()

    return csrf.post(`${backurl}/wishlist`, body);
  }
}


export class WishlistApiMock {
  async deleteItemFromWishlist(link: string, itemName: string) {


    return Promise.resolve();
  }

  async createWishlist(name: string) {
    console.log(`Создан вишлист с именем "${name}"`);
    return Promise.resolve({
      id: 'new-id',
      link: 'new-unique-link',
      name,
      lastOrderImage: 'https://via.placeholder.com/100',
    });
  }


  async getWishlists() {
    return [
      {
        id: '1',
        link: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Праздничный список',
        lastOrderImage: 'https://via.placeholder.com/100',
      },
      {
        id: '2',
        link: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Новый год 2024',
        lastOrderImage: 'https://via.placeholder.com/100',
      },
      {
        id: '1',
        link: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Праздничный список',
        lastOrderImage: 'https://via.placeholder.com/100',
      },
      {
        id: '2',
        link: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Новый год 2024',
        lastOrderImage: 'https://via.placeholder.com/100',
      },
      {
        id: '1',
        link: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Праздничный список',
        lastOrderImage: 'https://via.placeholder.com/100',
      },
      {
        id: '2',
        link: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Новый год 2024',
        lastOrderImage: 'https://via.placeholder.com/100',
      },
    ];
  }

  async getWishlist(link: string) {
    return {
      name: `Вишлист 111`,
      items: [
        { name: 'Ноутбук ASUS', image: 'https://via.placeholder.com/200', price: 2999 },
        { name: 'Наушники Sony', image: 'https://via.placeholder.com/200', price: 1999 },
        { name: 'Смартфон Samsung', image: 'https://via.placeholder.com/200', price: 3999 },
        { name: 'Ноутбук ASUS', image: 'https://via.placeholder.com/200', price: 2999 },
        { name: 'Наушники Sony', image: 'https://via.placeholder.com/200', price: 1999 },
        { name: 'Смартфон Samsung', image: 'https://via.placeholder.com/200', price: 3999 },
        { name: 'Ноутбук ASUS', image: 'https://via.placeholder.com/200', price: 2999 },
        { name: 'Наушники Sony', image: 'https://via.placeholder.com/200', price: 1999 },
        { name: 'Смартфон Samsung', image: 'https://via.placeholder.com/200', price: 3999 },
        { name: 'Ноутбук ASUS', image: 'https://via.placeholder.com/200', price: 2999 },
        { name: 'Наушники Sony', image: 'https://via.placeholder.com/200', price: 1999 },
        { name: 'Смартфон Samsung', image: 'https://via.placeholder.com/200', price: 3999 },

      ],
    };
  }

  // Пустые заглушки для удаления и обновления
  async deleteWishlist(link: string) {
    console.log(`Вишлист с link: ${link} удалён`);
    return Promise.resolve();
  }

  async renameWishlist(link: string, name: string) {
    console.log(`Вишлист с link: ${link} переименован в ${name}`);
    return Promise.resolve();
  }
}
