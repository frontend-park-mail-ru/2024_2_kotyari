import { ProductPage } from '../views/product-view.js';
import { productData } from './data.js';
import { Carousel } from '../views/carousel';

export async function buildProductPage() {
  try {
    const productPage = new ProductPage();
    await productPage.render(productData);

    initializeConditionButtons(productPage);
    initializeColorButtons(productPage);
    initializeCartButton(productPage);
    initializeFavoriteIcon(productPage);
    new Carousel();
  } catch (error) {
    console.error('Error building product page:', error);
  }
}

function initializeConditionButtons(productPage: ProductPage) {
  const conditionButtons = Array.from(document.querySelectorAll('.product-page__condition-buttons button')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
  );

  const currentPriceElement = document.querySelector('.product-page__current-price-product-page') as HTMLElement;

  conditionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      productPage.updateConditionSelection(button, conditionButtons);
      productPage.updatePriceDisplay(button, currentPriceElement);
    });
  });
}

function initializeColorButtons(productPage: ProductPage) {
  const colorButtons = Array.from(document.querySelectorAll('.product-page__colors .product-page__color-button')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
  );

  colorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      productPage.updateColorSelection(button, colorButtons);
    });
  });
}

function initializeCartButton(productPage: ProductPage) {
  const cartButton = document.querySelector('.product-page__cart-button') as HTMLButtonElement;

  cartButton.addEventListener('click', () => {
    productPage.updateCartButton(cartButton);
  });
}

function initializeFavoriteIcon(productPage: ProductPage) {
  const favoriteIcon = document.querySelector('.product-page__favorite-icon') as HTMLElement;

  favoriteIcon.addEventListener('click', () => {
    productPage.updateFavoriteIcon(favoriteIcon);
  });
}
