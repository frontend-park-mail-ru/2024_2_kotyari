import { ProductPage } from '../views/product-view.js';
import { productData } from './data.js';
import { Carousel } from '../../carousel/presenters/carousel';
import { getProductData } from '../api/product-page';
import { backurl } from '../../../../services/app/config';
import { router } from '../../../../services/app/init';

export class ProductPageBuilder {
  private productPage: ProductPage;

  constructor() {
    this.productPage = new ProductPage();
  }

  async build() {
    try {
      const keys = router.getRouteParams();
      if (keys === null) {
        return
      }

      const id = keys["id"];
      console.log(id);
      const productData = await getProductData(id);

      if (productData.seller && productData.seller.logo && !productData.seller.logo.startsWith('http')) {
        productData.seller.logo = `${backurl}/${productData.seller.logo}`;
      }

      console.log(productData);

      productData.images.forEach((image) => {
        image.url = `${backurl}/${image.url}`;
      });


      await this.productPage.render(productData);


      this.initializeConditionButtons();
      this.initializeOptionButtons();
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

  private initializeOptionButtons() {
    // Обработка цветовых кнопок
    const colorButtons = Array.from(document.querySelectorAll('.product-page__color-button')).filter(
      (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
    );

    colorButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.productPage.updateColorSelection(button, colorButtons);
        const link = button.getAttribute('data-link');
        if (link) {
          window.location.href = link;
        }
      });
    });

    // Обработка кнопок размера
    const sizeButtons = Array.from(document.querySelectorAll('.product-page__size-button')).filter(
      (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
    );

    sizeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.productPage.updateSizeSelection(button, sizeButtons);
        const link = button.getAttribute('data-link');
        if (link) {
          window.location.href = link;
        }
      });
    });

    // Обработка текстовых опций (ссылок)
    const textOptions = Array.from(document.querySelectorAll('.product-page__text-option')).filter(
      (el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement
    );

    textOptions.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.productPage.updateTextOptionSelection(link, textOptions);
        const href = link.getAttribute('href');
        if (href) {
          window.location.href = href;
        }
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