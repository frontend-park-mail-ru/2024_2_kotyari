export interface Product {
  name: string;
  images: string[];
  selectedImage: string;
  rating: number;
  reviewCount: number;
  videoCount: number;
  brand: {
    name: string;
    logo: string;
  };
  isUsedAvailable: boolean;
  isNewSelected: boolean;
  newPrice: number;
  usedPrice: number;
  colors: Array<{
    code: string;
    selected: boolean;
  }>;
  description: Array<{
    key: string;
    value: string;
  }>;
  article: string;
  currentPrice: number;
  oldPrice: number;
}

export interface ProductImage {
  url: string;
}

// Интерфейс для характеристик продукта
export interface ProductCharacteristics {
  color: string;
  size: string;
}

// Интерфейс для информации о продавце
export interface ProductSeller {
  name: string;
  logo: string;
}

interface ProductOptionLink {
  link: string;
  value: string;
}

interface ProductOption {
  title: string;
  type: 'color' | 'size' | 'text'; // Определяем тип опции
  options: ProductOptionLink[];
}

export interface ProductData {
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

export interface ApiResponse {
  status: number;
  body: ProductData;
}