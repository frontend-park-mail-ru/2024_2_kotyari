import product from './new-pr-page.hbs?raw';
import Handlebars from 'handlebars';
import { rootId } from '../../../../services/app/config';
import carouselSliderTemplate from '../../carousel/views/carousel-slider.hbs?raw';

export class ProductPage {
  private rootElement: HTMLElement | null;
  private compiledTemplate: Handlebars.TemplateDelegate;

  constructor() {
    this.rootElement = document.getElementById(rootId);
    this.compiledTemplate = Handlebars.compile(product);
  }

  async render(data: any) {
    if (!this.rootElement) {
      console.error(`Элемент root ${rootId} не найден`);
      return;
    }
    Handlebars.registerPartial('carousel-slider', carouselSliderTemplate);
    this.rootElement.innerHTML = '';
    const templateElement = document.createElement('div');
    templateElement.innerHTML = this.compiledTemplate(data);
    this.rootElement.appendChild(templateElement);

  }

  updateSizeSelection(selectedButton: HTMLButtonElement, buttons: HTMLButtonElement[]) {
    buttons.forEach((btn) => btn.classList.remove('selected'));
    selectedButton.classList.add('selected');
  }

  updateTextOptionSelection(selectedLink: HTMLAnchorElement, links: HTMLAnchorElement[]) {
    links.forEach((link) => link.classList.remove('selected'));
    selectedLink.classList.add('selected');
  }

  updatePriceDisplay(button: HTMLButtonElement, priceElement: HTMLElement) {
    const price = button.getAttribute('data-price');
    if (price) {
      priceElement.textContent = `${price} ₽`;
    }
  }

  updateConditionSelection(selectedButton: HTMLButtonElement, buttons: HTMLButtonElement[]) {
    buttons.forEach((btn) => btn.classList.remove('selected'));
    selectedButton.classList.add('selected');
  }

  updateColorSelection(selectedButton: HTMLButtonElement, buttons: HTMLButtonElement[]) {
    buttons.forEach((btn) => btn.classList.remove('selected'));
    selectedButton.classList.add('selected');
  }

  updateCartButton(cartButton: HTMLElement) {
    cartButton.textContent = 'Товар в корзине';
    cartButton.style.backgroundColor = 'white';
    cartButton.style.color = '#7a16d5';
    cartButton.setAttribute('disabled', 'true');
  }

  updateFavoriteIcon(favoriteIcon: HTMLElement) {
    if (favoriteIcon.textContent === 'favorite_border_outlined') {
      favoriteIcon.textContent = 'favorite';
    } else {
      favoriteIcon.textContent = 'favorite_border_outlined';
    }
  }
}
