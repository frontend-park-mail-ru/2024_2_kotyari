import { ProductPage } from '../views/product-view.js';
import { Carousel } from '../../carousel/presenters/carousel';
import { ProductPageApi } from '../api/product-page';
import { backurl } from '../../../../services/app/config';
import { router } from '../../../../services/app/init';
import { ProductData } from '../types/types';
import { isAuth } from '../../../../services/storage/user';
import { csrf } from '../../../../services/api/CSRFService';
import {ReviewsView} from "../../reviews/views/reviews";
import {ReviewsPresenter} from "../../reviews/presenters/reviews";
import {ReviewsApi} from "../../reviews/api/api";

export class ProductPageBuilder {
  private readonly reviewsId = 'reviews';

  private productPage: ProductPage;
  private api = new ProductPageApi();
  private reviewsPresenter: ReviewsPresenter

  constructor() {
    this.productPage = new ProductPage();

    new ReviewsApi();
    const reviewsView = new ReviewsView(this.reviewsId);
    this.reviewsPresenter = new ReviewsPresenter(reviewsView);
  }

  async build({ hash }: { hash?: string }) {
    try {
      console.log(hash);

      const id = this.getProductId();

      await csrf.refreshToken();

      if (id === ''){
        router.navigate('/')
        return;
      }

      const productRes = await this.api.getProductData(id);

      if (!productRes.ok) {
        router.navigate('/');
      }

      const productData = productRes.body as ProductData;

      if (productData.seller && productData.seller.logo && !productData.seller.logo.startsWith('http')) {
        productData.seller.logo = `${backurl}/${productData.seller.logo}`;
      }

      productData.images.forEach((image) => {
        image.url = `${backurl}/${image.url}`;
      });

      await this.productPage.render(productData);

      this.initializeConditionButtons();
      // this.initializeOptionButtons();
      this.initializeCartButtons(productData.in_cart);
      // this.initializeFavoriteIcon();
      new Carousel();

      this.reviewsPresenter.init(id, hash);



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

  private getProductId = (): string =>{
    const keys = router.getRouteParams();
    if (keys === null) {
      return '';
    }

    return keys['id'];
  }

  private initializeCartButtons(isInCart: boolean) {
    const cartButton = document.querySelector('.product-page__cart-button') as HTMLButtonElement;
    const incrementButton = document.createElement('button');
    incrementButton.textContent = '+';
    incrementButton.className = 'product-page__increment-button';
    incrementButton.style.display = isInCart ? 'inline-block' : 'none';

    if (isInCart) {
      cartButton.textContent = 'Удалить из корзины';
      this.productPage.setButtonPressedState(cartButton);
    } else {
      if (!isAuth()) {
        cartButton.textContent = 'Войдите в аккаунт';
        cartButton.setAttribute('router', 'changed-active');
        cartButton.setAttribute('href', '/login');
        return;
      } else {
        cartButton.textContent = 'В корзину';
        this.productPage.setButtonDefaultState(cartButton);
      }
    }

    cartButton.addEventListener('click', async () => {
      if (cartButton.textContent === 'В корзину') {
        await this.addToCart(cartButton, incrementButton);
      } else {
        await this.removeFromCart(cartButton, incrementButton);
      }
    });

    incrementButton.addEventListener('click', async () => {
      await this.increaseCartCount(cartButton, incrementButton);
    });

    cartButton.after(incrementButton);
  }

  private async addToCart(cartButton: HTMLElement, incrementButton: HTMLElement) {
    const id = this.getProductId();
    if (id === ''){
      router.navigate('/')
      return;
    }

    this.api.addToCart(id)
      .then((result) => {
        if (result.unauthorized) {
          cartButton.textContent = 'Войдите в аккаунт';
          cartButton.setAttribute('router', 'changed-active');
          cartButton.setAttribute('href', '/login');
          return;
        }

        if (result.ok) {
          cartButton.textContent = 'Удалить из корзины';
          incrementButton.style.display = 'inline-block';
          this.productPage.setButtonPressedState(cartButton);
        }
      });
  }

  private async removeFromCart(cartButton: HTMLElement, incrementButton: HTMLElement) {
    const id = this.getProductId();
    if (id === ''){
      router.navigate('/')
      return;
    }

    this.api.rmFromCart(id)
      .then((result) => {
        console.log(result);

        if (result.unauthorized) {
          cartButton.textContent = 'Войдите в аккаунт';
          cartButton.setAttribute('router', 'changed-active');
          cartButton.setAttribute('href', '/login');
          return;
        }

        if (result.ok) {
          cartButton.textContent = 'В корзину';
          incrementButton.style.display = 'none';
          this.productPage.setButtonDefaultState(cartButton);
        }
    });
  }

  private async increaseCartCount(cartButton: HTMLElement, incrementButton: HTMLElement) {
    const id = this.getProductId();
    if (id === '') {
      return;
    }

    try {
      await ProductPageApi.updateProductQuantity(id);
      cartButton.textContent = 'Удалить из корзины';
    } catch (error) {
      console.error('Ошибка при обновлении количества:', error);
    }
  }

  private initializeFavoriteIcon() {
    const favoriteIcon = document.querySelector('.product-page__favorite-icon') as HTMLElement;

    favoriteIcon.addEventListener('click', () => {
      this.productPage.updateFavoriteIcon(favoriteIcon);
    });
  }
}