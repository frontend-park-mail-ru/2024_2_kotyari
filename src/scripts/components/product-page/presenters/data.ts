import { Product } from '../types/types.js'; // Путь к файлу с интерфейсом может варьироваться

export const productData: Product = {
  name: 'Футболка MICONIC с минипигом',
  images: [
    'https://ir.ozone.ru/s3/multimedia-q/wc1000/6623687078.jpg',
    'https://ir.ozone.ru/s3/multimedia-2/wc1000/6623687126.jpg',
    'https://ir.ozone.ru/s3/multimedia-4/wc1000/6414442480.jpg',
    'https://ir.ozone.ru/s3/multimedia-b/wc1000/6734804555.jpg',
    'https://ir.ozone.ru/s3/multimedia-v/wc1000/6734804539.jpg',
    'https://ir.ozone.ru/s3/multimedia-g/wc1000/6734804560.jpg',
  ],
  selectedImage: 'blob:null/24135918-71be-41e8-84a2-c60a45b16ad4',
  rating: 4.5,
   reviewCount: 125,
  videoCount: 10,
  brand: {
    name: 'MICONIC',
    logo: 'https://static-basket-01.wbbasket.ru/vol1/sellers/brands/3C22B6B92AA62185.webp',
  },
  isUsedAvailable: true,
  isNewSelected: true,
  newPrice: 555,
  usedPrice: 444,
  colors: [
    { code: '#ff0000', selected: false },
    { code: '#ffffff', selected: true },
    { code: '#00ffc4', selected: false },
  ],
  description: [
    { key: 'Цвет', value: 'белый' },
    { key: 'Состав', value: '100% хлопок' },
    { key: 'Страна производства', value: 'Россия' },
    { key: 'Особенности модели', value: 'DTF - принт' },
    { key: 'Вырез горловины', value: 'Округлый' },
    { key: 'Покров', value: 'Прямой' },
    { key: 'Уход за вещами', value: 'Деликатная стирка' },
  ],
  article: '123456',
  currentPrice: 555,
  oldPrice: 1111,
};
