import category from './category.hbs?raw';
import { rootId } from '../../../../services/app/config';
import Handlebars from 'handlebars';
import { Category } from '../api/category';
import { CardViewInterface } from '../../card/view/card';


export interface CategoryViewInterface {
  build(config: {categories: Category[]}): void;

  renderCategoryProducts(products: { products: any[] }, link: string): void;

  renderBreadcrumbs(breadcrumbs: { title: string, link: string }[]);

  onBreadcrumbNavigate?: (index: number) => void;
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

  renderCategoryProducts = (products: { products: any[] , page_title?: string }, link: string): void => {
    products.page_title = 'Категория: ';

    this.cardView.render(products, link);
  }

  renderBreadcrumbs = (breadcrumbs: { title: string, link: string }[]) => {
    // const breadcrumbContainer = document.getElementById('breadcrumbs');
    // if (!breadcrumbContainer) {
    //   // console.error('Не найден контейнер для хлебных крошек');
    //   return;
    // }
    //
    // breadcrumbContainer.innerHTML = breadcrumbs.map((crumb, index) =>
    //   `<span class="breadcrumb" data-index="${index}">${crumb.title}</span>`,
    // ).join(' > ');
    //
    // document.querySelectorAll('.breadcrumb').forEach((element) => {
    //   element.addEventListener('click', () => {
    //     const index = parseInt((element as HTMLElement).getAttribute('data-index')!);
    //     this.onBreadcrumbClick(index);
    //   });
    // });
  };

  onBreadcrumbClick = (index: number) => {
    if (typeof this.onBreadcrumbNavigate === 'function') {
      this.onBreadcrumbNavigate(index);
    }
  };

  onBreadcrumbNavigate?: (index: number) => void;
}