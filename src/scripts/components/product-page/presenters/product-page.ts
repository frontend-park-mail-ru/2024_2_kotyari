import {
  renderProductPage,
  updateConditionSelection,
  updatePriceDisplay,
  updateColorSelection,
  updateCartButton,
  updateFavoriteIcon,
  Carousel,
} from '../views/product-view.js';

// import { getProductData } from '../api/product-page';


import { productData } from './data.js';

export async function buildProductPage() {
  try {
    // const data = await getProductData(productId);
    await renderProductPage(productData);

    initializeConditionButtons();
    initializeColorButtons();
    initializeCartButton();
    initializeFavoriteIcon();
    new Carousel();
  } catch (error) {
    console.error('Error building product page:', error);
  }
}

function initializeConditionButtons() {
  const conditionButtons = Array.from(document.querySelectorAll('.product-page__condition-buttons button')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
  );

  const currentPriceElement = document.querySelector('.product-page__current-price-product-page') as HTMLElement;

  conditionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      updateConditionSelection(button, conditionButtons);
      updatePriceDisplay(button, currentPriceElement);
    });
  });
}

function initializeColorButtons() {
  const colorButtons = Array.from(document.querySelectorAll('.product-page__colors .product-page__color-button')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
  );

  colorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      updateColorSelection(button, colorButtons);
    });
  });
}

function initializeCartButton() {
  const cartButton = document.querySelector('.product-page__cart-button') as HTMLButtonElement;

  cartButton.addEventListener('click', () => {
    updateCartButton(cartButton);
  });
}

function initializeFavoriteIcon() {
  const favoriteIcon = document.querySelector('.product-page__favorite-icon') as HTMLElement;

  favoriteIcon.addEventListener('click', () => {
    updateFavoriteIcon(favoriteIcon);
  });
}
