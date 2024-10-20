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
const productPageTemplateURL = '/src/scripts/components/product-page/views/product-page.hbs';

export async function buildProductPage() {
  try {
    // const data = await getProductData(productId);
    await renderProductPage(productPageTemplateURL, productData);

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
  const conditionButtons = Array.from(document.querySelectorAll('.condition-buttons button')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
  );

  const currentPriceElement = document.querySelector('.current-price-product-page') as HTMLElement;

  conditionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      updateConditionSelection(button, conditionButtons);
      updatePriceDisplay(button, currentPriceElement);
    });
  });
}

function initializeColorButtons() {
  const colorButtons = Array.from(document.querySelectorAll('.colors .color-button')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement
  );

  colorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      updateColorSelection(button, colorButtons);
    });
  });
}

function initializeCartButton() {
  const cartButton = document.querySelector('.cart-button') as HTMLButtonElement;

  cartButton.addEventListener('click', () => {
    updateCartButton(cartButton);
  });
}

function initializeFavoriteIcon() {
  const favoriteIcon = document.querySelector('.favorite-icon') as HTMLElement;

  favoriteIcon.addEventListener('click', () => {
    updateFavoriteIcon(favoriteIcon);
  });
}
