import { ProductPage } from '../views/product-view.js';
import { productData } from './data.js';
import { Carousel } from '../../carousel/presenters/carousel';

export class ProductPageBuilder {
  private productPage: ProductPage;

  constructor() {
    this.productPage = new ProductPage();
  }

  async build() {
    try {
      await this.productPage.render(productData);
      this.initializeConditionButtons();
      this.initializeColorButtons();
      this.initializeCartButton();
      this.initializeFavoriteIcon();
      new Carousel();
    } catch (error) {
      console.error('Error building product page:', error);
    }
  }

  private initializeConditionButtons() {
    const conditionButtons = Array.from(document.querySelectorAll('.product-page__condition-buttons button')).filter(
      (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
    );

    const currentPriceElement = document.querySelector('.product-page__current-price-product-page') as HTMLElement;

    conditionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.productPage.updateConditionSelection(button, conditionButtons);
        this.productPage.updatePriceDisplay(button, currentPriceElement);
      });
    });
  }

  private initializeColorButtons() {
    const colorButtons = Array.from(document.querySelectorAll('.product-page__colors .product-page__color-button')).filter(
      (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
    );

    colorButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.productPage.updateColorSelection(button, colorButtons);
      });
    });
  }

  private initializeCartButton() {
    const cartButton = document.querySelector('.product-page__cart-button') as HTMLButtonElement;

    cartButton.addEventListener('click', () => {
      this.productPage.updateCartButton(cartButton);
    });
  }

  private initializeFavoriteIcon() {
    const favoriteIcon = document.querySelector('.product-page__favorite-icon') as HTMLElement;

    favoriteIcon.addEventListener('click', () => {
      this.productPage.updateFavoriteIcon(favoriteIcon);
    });
  }
}
