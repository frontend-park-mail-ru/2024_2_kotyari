import { backurl } from '../../../../services/app/config';
import { getWithCred } from '../../../../services/api/without-csrf';
import { csrf } from '../../../../services/api/CSRFService';

interface ProductOption {
  title: string;
  type: string;
  options: any[]; // Замените `any` на более конкретный тип, если известен
}

interface ProductImage {
  url: string;
}

interface ProductCharacteristics {
  color: string;
  size: string;
}

interface ProductSeller {
  name: string;
  logo: string;
}

// Основной интерфейс тела ответа `body`
interface ProductData {
  id: number;
  description: string;
  count: number;
  title: string;
  price: number;
  original_price: number;
  discount: number;
  rating: number;
  review_count: number;
  images: ProductImage[];
  options: {
    values: ProductOption[];
  };
  characteristics: ProductCharacteristics;
  seller: ProductSeller;
  in_cart: boolean;
}

export class ProductPageApi {
  getProductData = (productId: string): Promise< { ok: boolean, body: ProductData }> => {
    return getWithCred(`${backurl}/product/${productId}`)
      .then((res) => {
        switch (res.status) {
          case 200:
            return { ok: true, body: res.body };
          default:
            throw new Error(`${res.status} -- ${res.body.error_message}`);
        }
      })
      .catch(e => {
        console.error('Error fetching product data:', e);
        return { ok: false };
      })
  }

  addToCart = (productId: string): Promise<{ ok: boolean; unauthorized?: boolean }> =>{
    return csrf.post(`${backurl}/cart/product/${productId}`)
      .then((res) => {
        switch (res.status) {
          case 204:
            return { ok: true };
          case 401:
            return { ok: false, unauthorized: true };
          case 403:
            csrf.refreshToken()
              .catch(err => console.log(err));

            return { ok: false };
          case 409:
            return { ok: false };
          default:
            throw new Error(`${res.status} - ${res.body.error_message}`);
        }
      })
      .catch((error) => {
        console.error('Error adding to cart:', error);
        return { ok: false };
      });
  }

  rmFromCart = (productId: string): Promise<{ ok: boolean; unauthorized?: boolean }> => {
    const url = `${backurl}/cart/product/${productId}`;
    return csrf.delete(url)
      .then((res) => {
        switch (res.status) {
          case 204:
            return { ok: true };
          case 401:
            return { ok: false, unauthorized: true };
          case 403:
            csrf.refreshToken()
              .catch(err => console.log(err));

            return { ok: false };
          default:
            throw new Error(`${res.status} - ${res.body.error_message}`);
        }
      })
      .catch((error) => {
        console.error('Error removing from cart:', error);
        return { ok: false };
      });
  }

  static async updateProductQuantity(productId: string, count: number = 1): Promise<void> {
    return csrf.patch(`${backurl}/cart/product/${productId}`, { count })
      .then(res =>{
        switch (res.status) {
          case 204:
            return;
          case 403:
            csrf.refreshToken()
              .catch(err => console.log(err));
            
            return;
          default:
            throw new Error(`${res.status} - ${res.body.error_message}`);
        }
      })
      .catch((res) => {
        throw new Error(`Ошибка при обновлении количества: ${res}`);
      });
  }
}
