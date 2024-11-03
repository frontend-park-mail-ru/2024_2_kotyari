import { CardViewInterface } from '../../card/view/card';
import { CategoryViewInterface } from '../view/category';
import { IRouter } from '../../../../services/types/types';
import { CategoryApiInterface, Product, ProductError } from '../api/category';
import { backurl } from '../../../../services/app/config';
import { categoryStorage } from '../../../../services/storage/category';

export class CategoryPresenter {
  private api: CategoryApiInterface;
  private categoryView: CategoryViewInterface;
  private cardView: CardViewInterface;
  private router: IRouter;

  constructor(
    api: CategoryApiInterface,
    categoryView: CategoryViewInterface,
    cardView: CardViewInterface,
    router: IRouter,
  ) {
    this.api = api;
    this.categoryView = categoryView;
    this.cardView = cardView;
    this.router = router;
  }


  renderCategories = (): void => {
    this.api.getCategories()

      .then((data) => {
        console.log('123', data);

        if (typeof data === 'string') {
          console.error(data);
        } else {
          data.forEach((card) => {
            card.picture = `${backurl}/${card.picture}`;
          });

          this.categoryView.build({ categories: data });
        }
      });
  };

  loadCategoryProducts = (): void => {
    const params = this.router.getRouteParams();
    if (params === null) {
      return;
    }

    const categoryLink = params['link'];

    this.api.getCategoryProducts(categoryLink)
      .then((res) => {
        if (isProductArray(res)) {
          res.forEach((card) => {
            card.image_url = `${backurl}/${card.image_url}`;
          });

          const category = categoryStorage.getCategoryByLink(categoryLink);
          if (!category?.name)
            return;

          this.categoryView.renderCategoryProducts({ products: res }, category.name);
          return;
        }

        console.log(res.error_message);
      })
  };


}

function isProductArray(res: Product[] | ProductError): res is Product[] {
  return Array.isArray(res);
}