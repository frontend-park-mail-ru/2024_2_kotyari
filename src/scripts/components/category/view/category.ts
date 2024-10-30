import category from './category.hbs?raw';
import { rootId } from '../../../../services/app/config';
import Handlebars from 'handlebars';

interface Category {
  name: string;
  image: string;
}

export function generateCategories(config: Array<Category>): void {
  // Предположим, что мы используем Handlebars для рендеринга

  // Чтение шаблона hbs файла
  const templateContent = category;
  const template = Handlebars.compile(templateContent);

  // Создание контекста с категориями из конфигурации
  const context = { categories: config };

  // Генерация HTML страницы с использованием шаблона
  const htmlContent = template(context);

  const root = document.getElementById(rootId);

  root.innerHTML = htmlContent;
}

// Пример конфигурации категорий
export const categoryConfig: Array<Category> = [
  { name: "Технологии", image: "https://cache-limeshop.cdnvideo.ru/limeshop/aa/7584034295a65c7a7b16611ee83c700155dc81e05.jpeg?q=85&w=849" },
  { name: "Здоровье", image: "https://cache-limeshop.cdnvideo.ru/limeshop/aa/7584034295a65c7a7b16611ee83c700155dc81e05.jpeg?q=85&w=849" },
  { name: "Спорт", image: "https://cache-limeshop.cdnvideo.ru/limeshop/aa/7584034295a65c7a7b16611ee83c700155dc81e05.jpeg?q=85&w=849" },
];

// Вызов функции для генерации категорий
