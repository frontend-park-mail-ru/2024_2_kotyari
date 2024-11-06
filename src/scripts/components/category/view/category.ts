import category from './category.hbs?raw';
import { rootId } from '../../../../services/app/config';
import Handlebars from 'handlebars';
import { Category } from '../api/category';
import { CardViewInterface } from '../../card/view/card';


export interface CategoryViewInterface {
  build(config: {categories: Category[]}): void;
  renderCategoryProducts(products: { products: any[] }, link: string): void;
}

export class CategoryView implements CategoryViewInterface {
  private readonly template: any;
  private readonly cardView: any;

  constructor(cardView: CardViewInterface) {
    this.template = Handlebars.compile(category);
    this.cardView = cardView;
  }

  build = (config: {categories: Category[]}) =>{
    const htmlContent = this.template(config);

    const root = document.getElementById(rootId);

    root.innerHTML = htmlContent;
  }

  renderCategoryProducts = (products: { products: any[] }, link: string): void => {
    // products.page_title = category.category.name;
    this.cardView.render(products, link);
  }
}