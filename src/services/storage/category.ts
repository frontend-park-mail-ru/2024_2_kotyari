import { Category } from '../../scripts/components/category/api/category';

class CategoryStorage {
  private storage: Category[] = [];

  setCategories(categories: Category[]) {
    this.storage = categories;

    console.log(this.storage);
  }

  getCategoryByLink(link: string): Category | undefined {
    console.log(this.storage);

    return this.storage.find(category => category.link_to === link);
  }

  getCategoryByName(name: string): Category | undefined {
    return this.storage.find(category => category.name === name);
  }
}

export const categoryStorage = new CategoryStorage();