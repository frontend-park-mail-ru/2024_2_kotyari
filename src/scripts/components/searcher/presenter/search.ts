import { SearcherApiInterface } from '../api/search';
import { SearcherViewInterface } from '../view/search';
import { backurl } from '../../../../services/app/config';
import { router } from '../../../../services/app/init';
import { DropdownConfig, DropdownPresenter } from '../../dropdown-btn/presenter/dropdown';
import { DropdownAPI } from '../../dropdown-btn/api/dropdown';


export class Searcher {
  private api: SearcherApiInterface;
  private view: SearcherViewInterface;
  private debounceTimeout: any;
  private apiEndpoint = '/search/catalog';
  private dropdownPresenter: DropdownPresenter;
  private readonly config: DropdownConfig;

  constructor(api: SearcherApiInterface, view: SearcherViewInterface) {
    this.api = api;
    this.view = view;

    this.config = {
      containerId: 'sort-container',
      sortOptions: [
        { value: 'price_asc', text: 'Сначала дешевле' },
        { value: 'price_desc', text: 'Сначала дороже'},
        { value: 'rating', text: 'По рейтингу' },
      ],
      apiEndpoint: this.apiEndpoint,
      defaultSort: 'cost',
      defaultOrder: 'asc',
      onSortChange: this.handleSortChange,
    };
  }

  private handleSortChange = (sortOrder: string): void => {
    const query = (document.getElementById('search-input') as HTMLInputElement)?.value.trim();

    if (!query) return;

    // Маппинг значений sortOrder в параметры sort и order
    let sort: string;
    let order: string;

    switch (sortOrder) {
      case 'price_asc':
        sort = 'price';
        order = 'asc';
        break;
      case 'price_desc':
        sort = 'price';
        order = 'desc';
        break;
      default:
        sort = 'rating';
        order = 'desc';
        break;
    }

    // Формирование URL для маршрута
    const searchUrl = `${backurl}${this.apiEndpoint}?q=${query}&sort=${sort}&order=${order}`;

    if (query) {
      router.navigate(`${this.apiEndpoint}?q=${query}&sort=${sort}&order=${order}`);

      DropdownAPI.sortProducts(`${backurl}${this.apiEndpoint}?q=${query}`, sort, order)
        .then((productsApi) => {
          // console.log(productsApi);
          const products = productsApi.body;
          products.forEach((card) => {
            card.image_url = `${backurl}/${card.image_url}`;
          });


          this.view.renderProducts({products: products}, query, this.config);
        })
        .catch((error) => {
          // console.error('Ошибка сортировки:', error);
        });
    }
  };

  public initializeListeners() {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const searchButton = document.getElementById('search-button') as HTMLButtonElement;
    const suggestionsList = document.getElementById('suggestions') as HTMLUListElement;

    if (!searchInput || !searchButton|| !suggestionsList) {
      // console.error('Search input or button not found');
      return;
    }

    const q = router.getQueryParam('q');
    if (q) {
      searchInput.value = q;
    }

    searchInput.addEventListener('input', () => this.debounceSuggest(searchInput.value, 200));

    searchInput.addEventListener('focus', () => {
      const query = searchInput.value.trim();
      if (query) {
        this.debounceSuggest(query, 200);
      }
    });

    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        const param = new URLSearchParams({
          q: query,
        });

        router.navigate('/search/catalog?' + param.toString())
        this.hideSuggestions();
      }
    });

    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          const param = new URLSearchParams({
            q: query,
          });

          router.navigate('/search/catalog?' + param.toString())
          this.hideSuggestions();
        }
      }
    });

    document.addEventListener('click', (event) => {
      if (!searchInput.contains(event.target as Node) && !suggestionsList.contains(event.target as Node)) {
        this.view.displaySuggestions([]);
      }
    });

    document.addEventListener('click', (event) => {
      if (!searchInput.contains(event.target as Node)
        && !suggestionsList.contains(event.target as Node)) {
        this.view.displaySuggestions([]);
      }
    });

    suggestionsList.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName === 'LI') {

        this.hideSuggestions();
      }
    });
  }

  public searchProducts(query: string, sort: string, order: string) {
    const searchUrl = `${backurl}${this.apiEndpoint}?q=${query}&sort=${sort}&order=${order}`;

    // console.log(sort, order);

    this.api
      .getProductsByQuery(searchUrl)
      .then((products) => {
        if (products) {
          products.forEach((card) => {
            card.image_url = `${backurl}/${card.image_url}`;
          });

          // Рендерим товары
          this.view.renderProducts({ products }, query, this.config);
          this.updateBreadcrumbs(`Результаты поиска: ${query}`, `/search/catalog?q=${query}&sort=${sort}&order=${order}`);
        } else {
          // console.error('No products found');
        }
      })
      .catch((e) => {
        // console.error('Error fetching products:', e);
      });
  }

  private debounceSuggest(query: string, delay: number) {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      if (query) {
        this.api.getSuggestions(query)
          .then(suggestions => {
            if (suggestions.length > 0) {
              this.view.displaySuggestions(suggestions);
            } else {
              this.view.displaySuggestions([]);
            }
          })
          .catch(e => {/*console.error('Error fetching suggestions:', e)*/});
      } else {
        this.view.displaySuggestions([]);
      }
    }, delay);
  }

  private updateBreadcrumbs = (label: string, url: string) => {
    // console.log(`Updating breadcrumbs with label: ${label} and url: ${url}`);
  };

  private hideSuggestions() {
    // console.log(111111);
    this.view.displaySuggestions([]);
  }

  public clearSearchInput() {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = ''; // Очищаем поле ввода
    }
  }
}