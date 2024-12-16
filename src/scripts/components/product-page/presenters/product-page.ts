import { ProductPage } from '../views/product-view.js';
import { Carousel } from '../../carousel/presenters/carousel';
import { ProductPageApi } from '../api/product-page';
import { backurl } from '../../../../services/app/config';
import { router } from '../../../../services/app/init';
import { ProductData } from '../types/types';
import { isAuth } from '../../../../services/storage/user';
import { csrf } from '../../../../services/api/CSRFService';
import { ReviewsView } from '../../reviews/views/reviews';
import { ReviewsPresenter } from '../../reviews/presenters/reviews';
import { ReviewsApi } from '../../reviews/api/api';
import { WishlistApi } from '../../wish-list/api/wish-list';
import {ReviewsView} from "../../reviews/views/reviews";
import {ReviewsPresenter} from "../../reviews/presenters/reviews";
import {ReviewsApi} from "../../reviews/api/api";
import {Recommendations} from "../../recomendations/presenter/recommendations";
import {RecommendationsView} from "../../recomendations/view/recomendations";
import {CardView} from "../../card/view/card";
import {RecommendationsApi} from "../../recomendations/api/recommendations";
import {productData} from "./data";

export class ProductPageBuilder {
  private readonly reviewsId = 'reviews';
  private readonly recommendationsId = 'recommendations-page';

  private productPage: ProductPage;
  private api = new ProductPageApi();
  private reviewsPresenter: ReviewsPresenter;
  private wishlistModal: HTMLElement | null = null;
  private wishlistCheckboxes: NodeListOf<HTMLInputElement> | null = null;
  private reviewsPresenter: ReviewsPresenter
  private recommendations: Recommendations;

  constructor() {
    this.productPage = new ProductPage();

    new ReviewsApi();
    const reviewsView = new ReviewsView(this.reviewsId);
    this.reviewsPresenter = new ReviewsPresenter(reviewsView);
    const cardView = new CardView();
    const recommendationsView = new RecommendationsView(cardView);
    const recommendationsApi = new RecommendationsApi();
    this.recommendations = new Recommendations(recommendationsApi, recommendationsView);
  }

  async build({ hash }: { hash?: string }) {
    try {
      const id = this.getProductId();

      try {
        await csrf.refreshToken();
      } catch {

      }

      if (id === '') {
        router.navigate('/');
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
      this.initializeCartButtons(productData.in_cart, productData.count);
      // this.initializeFavoriteIcon();
      new Carousel();

      this.recommendations.render(productData.id, productData.title, this.recommendationsId);

      this.reviewsPresenter.init(id, hash);

      this.initializeFavoriteButton();

    } catch (error) {
      // console.error('Error building product page:', error);
    }
  }

  private initializeFavoriteButton() {
    const favoriteButton = document.querySelector('.product-page__favorite-button') as HTMLElement;

    favoriteButton?.addEventListener('click', () => {
      this.openWishlistModal();
    });
  }

  private openWishlistModal() {
    this.wishlistModal = document.querySelector('.modal-add-wish') as HTMLElement;
    this.wishlistCheckboxes = this.wishlistModal?.querySelectorAll('.modal-add-wish__checkbox') as NodeListOf<HTMLInputElement>;

    if (this.wishlistModal) {
      this.wishlistModal.classList.add('modal-add-wish--open');
      console.log('Modal opened');
      this.loadUserWishlists().then(() => this.attachModalCloseEvent());
    } else {
      console.error('Modal not found');
    }
  }

  private closeWishlistModal() {
    if (this.wishlistModal) {
      this.wishlistModal.classList.remove('modal-add-wish--open');
    }
  }

  private async loadUserWishlists() {
    const response = await WishlistApi.getWishlists();

    this.populateWishlistCheckboxes(response);

    const submitButton = this.wishlistModal?.querySelector('.modal-add-wish__submit-button') as HTMLElement;
    submitButton?.addEventListener('click', (event) => {
      event.preventDefault();
      this.saveSelectedWishlists();
    });
  }


  private populateWishlistCheckboxes(wishlists: any[]) {
    const wishlistContainer = document.getElementById('wishlistCheckboxes');
    if (wishlistContainer) {
      wishlistContainer.innerHTML = ''; // очищаем контейнер

      wishlists.forEach((wishlist) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('modal-add-wish__checkbox');
        checkbox.setAttribute('data-wishlist-link', wishlist.link); // сохраняем ссылку

        const label = document.createElement('label');
        label.textContent = wishlist.name;

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);

        wishlistContainer.appendChild(checkboxWrapper);
      });
    } else {
      console.error('Wishlist container not found');
    }
  }


  private saveSelectedWishlists() {
    const wishlistContainer = document.getElementById('wishlistCheckboxes');
    if (!wishlistContainer) {
      console.error('Wishlist container not found');
      return;
    }

    // Получаем все выбранные чекбоксы и извлекаем их ссылки (data-wishlist-link)
    const selectedWishlists = Array.from(wishlistContainer.querySelectorAll('.modal-add-wish__checkbox:checked'))
      .map((checkbox) => (checkbox as HTMLInputElement).getAttribute('data-wishlist-link')); // извлекаем ссылку

    if (selectedWishlists.length === 0) {
      console.log('zero');
      return;
    }

    const productId = this.getProductId();
    const numId = Number(productId);

    if (!numId) {
      console.error('Invalid product ID');
      return;
    }

    WishlistApi.addProductToWishlist(numId, selectedWishlists)
      .then((result) => {
        if (result.status === 201) {
          console.log('Product added to wishlist');
          this.closeWishlistModal();
        } else {
          console.error('Failed to add product to wishlist');
        }
      })
      .catch((error) => {
        console.error('Error saving wishlists:', error);
      });
  }

  private handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (this.wishlistModal && !this.wishlistModal.contains(target)) {
      this.closeWishlistModal();
      document.removeEventListener('click', this.handleDocumentClick); // Убираем обработчик после закрытия
    }
  };


  private attachModalCloseEvent() {
    const closeButton = this.wishlistModal?.querySelector('.modal-add-wish__close-button') as HTMLElement;

    closeButton?.addEventListener('click', () => {
      this.closeWishlistModal();
    });

    document.addEventListener('click', this.handleDocumentClick);
  }

  private initializeConditionButtons() {
    const conditionButtons = Array.from(document.querySelectorAll('.product-page__condition-buttons button')).filter(
      (el): el is HTMLButtonElement => el instanceof HTMLButtonElement,
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
      (el): el is HTMLButtonElement => el instanceof HTMLButtonElement,
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
      (el): el is HTMLButtonElement => el instanceof HTMLButtonElement,
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
      (el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement,
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

  private getProductId = (): string => {
    const keys = router.getRouteParams();
    if (keys === null) {
      return '';
    }

    return keys['id'];
  };

  private initializeCartButtons(isInCart: boolean, count: number = 0) {
    const cartButton = document.querySelector('.product-page__cart-button') as HTMLButtonElement;
    const incrementButton = document.createElement('button');
    incrementButton.textContent = '+';
    incrementButton.className = 'product-page__increment-button';
    incrementButton.style.display = isInCart ? 'inline-block' : 'none';

    if (isInCart) {
      cartButton.textContent = `Удалить из корзины (${count})`;
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
    if (id === '') {
      router.navigate('/');
      return;
    }

    const result = await this.api.addToCart(id)

    if (result.unauthorized) {
      cartButton.textContent = 'Войдите в аккаунт';
      cartButton.setAttribute('router', 'changed-active');
      cartButton.setAttribute('href', '/login');
      return;
    }

    if (result.ok) {
      cartButton.textContent = `Удалить из корзины (1)`;
      incrementButton.style.display = 'inline-block';
      this.productPage.setButtonPressedState(cartButton);
    }
  }

  private async removeFromCart(cartButton: HTMLElement, incrementButton: HTMLElement) {
    const id = this.getProductId();
    if (id === '') {
      router.navigate('/');
      return;
    }

    this.api.rmFromCart(id)
      .then((result) => {
        // console.log(result);

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
      const count = await ProductPageApi.updateProductQuantity(id);

      cartButton.textContent = `Удалить из корзины (${count.count})`;
    } catch (error) {
      // console.error('Ошибка при обновлении количества:', error);
    }
  }

  private initializeFavoriteIcon() {
    const favoriteIcon = document.querySelector('.product-page__favorite-icon') as HTMLElement;

    favoriteIcon.addEventListener('click', () => {
      this.productPage.updateFavoriteIcon(favoriteIcon);
    });
  }
}