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
    console.log(123);

    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    const searchButton = document.querySelector('.search-button') as HTMLButtonElement;
    const suggestionsList = document.getElementById('suggestions') as HTMLUListElement;

    console.log(searchInput, searchButton);

    if (!searchInput || !searchButton) {
      console.error('Search input or button not found');
      return;
    }

    searchInput.addEventListener('input', () => this.debounceSuggest(searchInput.value, 300));

    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        this.searchProducts(query);
      }
    });

    document.addEventListener('click', (event) => {
      if (!searchInput.contains(event.target as Node) && !suggestionsList.contains(event.target as Node)) {
        this.view.displaySuggestions([]); // Clear suggestions
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