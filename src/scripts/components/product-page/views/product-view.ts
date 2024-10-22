import product from './product-page.hbs?raw';
import Handlebars from 'handlebars';
import { contentRenderId } from '../../../../services/app/config';

const compiled = Handlebars.compile(product);

export async function renderProductPage(data: any) {
  const rootElement = document.getElementById(contentRenderId) as HTMLElement;
  if (!rootElement) {
    console.error(`Элемент root ${contentRenderId} -- ${rootElement}`);
  }
  rootElement.innerHTML = '';
  const templateElement = document.createElement('div');
  templateElement.innerHTML = compiled(data);
  rootElement.appendChild(templateElement);
}

export function updatePriceDisplay(button: HTMLButtonElement, priceElement: HTMLElement) {
  const price = button.getAttribute('data-price');
  priceElement.textContent = `${price} ₽`;
}

export function updateConditionSelection(selectedButton: HTMLButtonElement, buttons: HTMLButtonElement[]) {
  buttons.forEach((btn) => btn.classList.remove('selected'));
  selectedButton.classList.add('selected');
}

export function updateColorSelection(selectedButton: HTMLButtonElement, buttons: HTMLButtonElement[]) {
  buttons.forEach((btn) => btn.classList.remove('selected'));
  selectedButton.classList.add('selected');
}

export function updateCartButton(cartButton: HTMLElement) {
  cartButton.textContent = 'Товар в корзине';
  cartButton.style.backgroundColor = 'white';
  cartButton.style.color = '#7a16d5';
  cartButton.setAttribute('disabled', 'true');
}

export function updateFavoriteIcon(favoriteIcon: HTMLElement) {
  if (favoriteIcon.textContent === 'favorite_border_outlined') {
    favoriteIcon.textContent = 'favorite';
  } else {
    favoriteIcon.textContent = 'favorite_border_outlined';
  }
}

export class Carousel {
  slides: NodeListOf<HTMLElement>;
  thumbnails: NodeListOf<HTMLElement>;
  list: HTMLElement;
  carousel: HTMLElement;
  currentIndex: number;
  position: number;
  visibleCount: number;
  thumbnailHeight: number;

  constructor() {
    this.slides = document.querySelectorAll('.product-page__slide');
    this.thumbnails = document.querySelectorAll('.product-page__thumbnail');
    this.list = document.querySelector('.product-page__gallery ul')!;
    this.carousel = document.getElementById('carousel')!;
    this.currentIndex = 0;
    this.position = 0;
    this.visibleCount = 4;

    const thumbnailElement = this.thumbnails[0];
    const computedStyles = getComputedStyle(thumbnailElement);
    this.thumbnailHeight = parseInt(computedStyles.height, 10) + parseInt(computedStyles.marginBottom, 10);

    this.initializeEventListeners();
    this.showSlide(this.currentIndex);
  }

  initializeEventListeners() {
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        this.currentIndex = index;
        this.showSlide(this.currentIndex);
      });
    });

    document.getElementById('product-page__next-button')?.addEventListener('click', () => {
      this.currentIndex = this.getNextIndex(this.currentIndex, this.slides.length);
      this.showSlide(this.currentIndex);
    });

    document.getElementById('product-page__prev-button')?.addEventListener('click', () => {
      this.currentIndex = this.getPrevIndex(this.currentIndex, this.slides.length);
      this.showSlide(this.currentIndex);
    });

    this.carousel.querySelector('.prev')?.addEventListener('click', () => {
      if (this.position < 0) {
        this.position = this.scrollPrev();
      }
    });

    this.carousel.querySelector('.next')?.addEventListener('click', () => {
      if (this.position > -(this.thumbnailHeight * (this.thumbnails.length - this.visibleCount))) {
        this.position = this.scrollNext();
      }
    });
  }

  showSlide(index: number) {
    this.updateSlideVisibility();
    this.updateThumbnailSelection(index);
    this.scrollToThumbnail(index);
  }

  updateSlideVisibility() {
    this.slides.forEach((slide, i) => {
      slide.style.opacity = i === this.currentIndex ? '1' : '0';
    });
  }

  updateThumbnailSelection(index: number) {
    this.thumbnails.forEach((thumbnail) => thumbnail.classList.remove('active-thumbnail'));
    this.thumbnails[index].classList.add('active-thumbnail');
  }

  scrollToThumbnail(index: number) {
    const startVisibleIndex = Math.abs(this.position / this.thumbnailHeight);
    const endVisibleIndex = startVisibleIndex + this.visibleCount - 1;

    if (index < startVisibleIndex) {
      this.position = -index * this.thumbnailHeight;
    } else if (index > endVisibleIndex) {
      this.position = -(index - this.visibleCount + 1) * this.thumbnailHeight;
    }
    this.list.style.marginTop = `${this.position}px`;
  }

  getNextIndex(currentIndex: number, length: number) {
    return (currentIndex + 1) % length;
  }

  getPrevIndex(currentIndex: number, length: number) {
    return (currentIndex - 1 + length) % length;
  }

  scrollPrev() {
    this.position += this.thumbnailHeight;
    this.list.style.marginTop = `${Math.min(this.position, 0)}px`;
    return this.position;
  }

  scrollNext() {
    this.position -= this.thumbnailHeight;
    this.list.style.marginTop = `${Math.max(this.position, -this.thumbnailHeight * (this.thumbnails.length - this.visibleCount))}px`;
    return this.position;
  }
}
