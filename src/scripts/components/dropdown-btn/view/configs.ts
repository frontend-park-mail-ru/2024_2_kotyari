
export interface DropdownConfig {
  apiEndpoint: string;
  defaultTriggerText: string;
  options: { value: string; text: string }[];
}

export const PRODUCTS_CONFIG = {
  apiEndpoint: '',
  defaultTriggerText: 'Выберите сортировку',
  options: [
    { value: 'expensive', text: 'Подороже' },
    { value: 'cheap', text: 'Подешевле' },
    { value: 'high_rating', text: 'С высоким рейтингом' },
  ],
};

