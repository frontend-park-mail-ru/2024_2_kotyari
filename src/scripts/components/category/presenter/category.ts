import { CardViewInterface } from '../../card/view/card';
import { CategoryViewInterface } from '../view/category';
import { IRouter } from '../../../../services/types/types';
import { CategoryApiInterface, Product, ProductError } from '../api/category';
import { backurl } from '../../../../services/app/config';
import { DropdownConfig, DropdownPresenter } from '../../dropdown-btn/presenter/dropdown';
import { router } from '../../../../services/app/init';

export class CategoryPresenter {
  private api: CategoryApiInterface;
  private categoryView: CategoryViewInterface;
  private cardView: CardViewInterface;
  private router: IRouter;
  private breadcrumbs: { title: string, link: string }[] = []; // массив для хлебных крошек
  private dropdownPresenter: DropdownPresenter;
  private dropdownConfig: DropdownConfig;

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
        if (typeof data === 'string') {
          console.error(data);
        } else {
          data.forEach((card) => {
            card.picture = `${backurl}/${card.picture}`;
          });

          // Отрисовка категорий
          this.categoryView.build({ categories: data });

          this.updateBreadcrumbs('Каталог', '/categories');
        }
      });
  };

  private handleSortChange = (sortOrder: string): void => {
    const routeParams = this.router.getRouteParams();
    if (!routeParams) {
      router.navigate('/categories');
      return;
    }

    const categoryLink = routeParams['link'];

    // Маппинг значений sortOrder в параметры sort и order
    let sort: string | null = null;
    let order: string | null = null;

    switch (sortOrder) {
      case 'price_asc':
        sort = 'price';
        order = 'asc';
        break;
      case 'price_desc':
        sort = 'price';
        order = 'desc';
        break;
      case 'rating':
        sort = 'rating';
        order = 'desc';
        break;
      default:
        break; // Оставляем null, если сортировка не указана
    }

    // Формируем параметры URL
    const urlParams = new URLSearchParams();
    if (sort) urlParams.append('sort', sort);
    if (order) urlParams.append('order', order);

    const navigateUrl = `/category/${categoryLink}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    this.router.navigate(navigateUrl);

    // Загружаем продукты с новой сортировкой
    this.loadCategoryProducts(categoryLink, sort, order);
  };

  public loadCategoryProducts(categoryLink: string, sort: string | null, order: string | null) {
    const urlParams = new URLSearchParams();
    if (sort) urlParams.append('sort', sort);
    if (order) urlParams.append('order', order);

    const categoryUrl = `${backurl}/category/${categoryLink}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    console.log(categoryUrl);
    this.api.getCategoryProducts(categoryUrl)
      .then((products) => {
        if (Array.isArray(products)) {
          products.forEach((card) => {
            card.image_url = `${backurl}/${card.image_url}`;
          });

          // Используем categoryView для отображения продуктов
          this.categoryView.renderCategoryProducts({ products }, categoryLink);
          this.updateBreadcrumbs(`Категория: ${categoryLink}`, `/category/${categoryLink}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`);
        } else {
          console.error('No products found in category');
        }
      })
      .then(() => {
        const dropdownContainer = document.getElementById('sort-container');
        if (dropdownContainer) {
          this.dropdownConfig = {
            containerId: 'sort-container',
            sortOptions: [
              { value: 'price_asc', text: 'Сначала дешевле' },
              { value: 'price_desc', text: 'Сначала дороже'},
              { value: 'rating', text: 'По рейтингу' },
            ],
            apiEndpoint: '/category',
            defaultSort: '',
            defaultOrder: '',
            onSortChange: this.handleSortChange,
          };

          this.dropdownPresenter = new DropdownPresenter(this.dropdownConfig);
          this.dropdownPresenter.initView();

        } else {
          console.error('Dropdown container not found');
        }
      })
      .catch((e) => {
        console.error('Error fetching category products:', e);
      });
  }

  // Обновление хлебных крошек
  private updateBreadcrumbs(title: string, link: string) {
    this.breadcrumbs.push({ title, link });
    this.categoryView.renderBreadcrumbs(this.breadcrumbs);
  }

  goToBreadcrumb = (index: number): void => {
    const breadcrumb = this.breadcrumbs[index];
    if (breadcrumb) {
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
      this.router.navigate(breadcrumb.link);
    }
  };
}


function isProductArray(res: Product[] | ProductError): res is Product[] {
  return Array.isArray(res);
}