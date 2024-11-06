import { backurl } from '../../../../services/app/config';

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

interface ApiResponse {
  status: number;
  body: ProductData;
}

export class ProductPageApi {

  getProductData = (productId: string): Promise< { ok: boolean, body: ProductData }> => {
    const url = `${backurl}/product/${productId}`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error fetching product data: ${res.statusText}`);
        }

        return res.json();
      })
      .then(data => {
        return {ok: true, body: data.body};
      })
      .catch(e => {
        console.error('Fetch error:', e);
        return { ok: false };
      })
  }

  addToCart = (productId: string): Promise<{ ok: boolean; unauthorized?: boolean }> =>{
    const url = `${backurl}/cart/product/${productId}`;
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 401) {
          return { ok: false, unauthorized: true };
        }
        return { ok: response.ok };
      })
      .catch((error) => {
        console.error('Error adding to cart:', error);
        return { ok: false };
      });
  }

  rmFromCart = (productId: string): Promise<{ ok: boolean; unauthorized?: boolean }> => {
    const url = `${backurl}/cart/product/${productId}`;
    return fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 401) {
          return { ok: false, unauthorized: true };
        }
        return { ok: response.ok };
      })
      .catch((error) => {
        console.error('Error removing from cart:', error);
        return { ok: false };
      });
  }

  static async updateProductQuantity(productId: string, count: number = 1): Promise<void>{
    const response = await fetch(`${backurl}/cart/product/${productId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка при обновлении количества: ${response.status}`);
    }
  }

}
