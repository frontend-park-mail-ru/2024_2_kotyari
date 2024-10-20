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
