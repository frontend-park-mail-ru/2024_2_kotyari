import { Category } from '../../scripts/components/category/api/category';

/**
 * Класс CategoryStorage отвечает за хранение и управление категориями.
 */
class CategoryStorage {
  /**
   * Хранилище для категорий.
   * @private
   */
  private storage: Category[] = [];

  /**
   * Устанавливает список категорий в хранилище.
   *
   * @param categories - Массив объектов типа Category для сохранения.
   */
  setCategories(categories: Category[]): void {
    this.storage = categories;
  }

  /**
   * Получает категорию по ссылке.
   *
   * @param link - Ссылка, по которой необходимо найти категорию.
   * @returns Объект типа Category, если категория найдена, иначе undefined.
   */
  getCategoryByLink(link: string): Category | undefined {
    return this.storage.find(category => category.link_to === link);
  }

  /**
   * Получает категорию по названию.
   *
   * @param name - Название категории для поиска.
   * @returns Объект типа Category, если категория найдена, иначе undefined.
   */
  getCategoryByName(name: string): Category | undefined {
    return this.storage.find(category => category.name === name);
  }
}

export const categoryStorage = new CategoryStorage();