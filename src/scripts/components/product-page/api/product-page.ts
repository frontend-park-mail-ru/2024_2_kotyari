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
}

// Основной интерфейс для общего ответа, включающий `status` и `body`
interface ApiResponse {
  status: number;
  body: ProductData;
}

async function fetchProductData(productId: number): Promise<ProductData> {
  try {
    const response = await fetch(`https://api.example.com/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    return result.body; // Возвращаем только `body`, как требуется
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // Пробрасываем ошибку дальше, чтобы обработать её при вызове
  }
}



export async function getProductData(productId: number): Promise<ProductData | { ok: false }> {
  const url = `${backurl}/product/${productId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching product data: ${response.statusText}`);
    }

    const result: ApiResponse = await response.json();
    return result.body;
  } catch (error) {
    console.error('Fetch error:', error);
    return { ok: false };
  }
}
