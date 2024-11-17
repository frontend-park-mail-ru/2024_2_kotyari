import { SearcherApiInterface } from '../api/search';
import { SearcherViewInterface } from '../view/search';
import { backurl } from '../../../../services/app/config';


export class Searcher {
  private api: SearcherApiInterface;
  private view: SearcherViewInterface;
  private debounceTimeout: any;

  constructor(api: SearcherApiInterface, view: SearcherViewInterface) {
    this.api = api;
    this.view = view;
  }

  public initializeListeners() {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const searchButton = document.getElementById('search-button') as HTMLButtonElement;
    const suggestionsList = document.getElementById('suggestions') as HTMLUListElement;

    console.log(searchInput, searchButton);

    if (!searchInput || !searchButton) {
      console.error('Search input or button not found');
      return;
    }

    // Слушатель для ввода текста
    searchInput.addEventListener('input', () => this.debounceSuggest(searchInput.value, 200));

    // Слушатель для фокуса (показываем предложения)
    searchInput.addEventListener('focus', () => {
      const query = searchInput.value.trim();
      if (query) {
        this.debounceSuggest(query, 200);
      }
    });

    // Слушатель для нажатия кнопки поиска
    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        this.searchProducts(query);
      }
    });

    // Обработчик нажатия клавиши Enter
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          this.searchProducts(query);
        }
      }
    });

    // Скрытие предложений при клике вне поля поиска или предложений
    document.addEventListener('click', (event) => {
      if (!searchInput.contains(event.target as Node) && !suggestionsList.contains(event.target as Node)) {
        this.view.displaySuggestions([]);
      }
    });
  }

  public searchProducts(query: string) {
    this.api.getProductsByQuery(query)
      .then((products) => {
        if (products) {
          products.forEach((card) => {
            card.image_url = `${backurl}/${card.image_url}`;
          });

          this.view.renderProducts({ products }, query);
          this.updateBreadcrumbs(`Результаты поиска: ${query}`, `/search?q=${query}`);
        } else {
          console.error('No products found');
        }
      })
      .catch(e => {
        console.error('Error fetching products:', e);
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
          .catch(e => console.error('Error fetching suggestions:', e));
      } else {
        this.view.displaySuggestions([]);
      }
    }, delay);
  }

  private updateBreadcrumbs = (label: string, url: string) => {
    console.log(`Updating breadcrumbs with label: ${label} and url: ${url}`);
  };
}