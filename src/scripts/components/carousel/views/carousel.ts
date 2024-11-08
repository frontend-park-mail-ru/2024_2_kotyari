import Handlebars from 'handlebars';
import carouselSliderTemplate from './carousel-slider.hbs?raw';

export class CarouselSlider {
  private readonly compiledTemplate: any;

  constructor() {
    this.compiledTemplate = Handlebars.compile(carouselSliderTemplate);
  }

  render(rootElement: HTMLElement, images: string[]) {
    const templateElement = document.createElement('div');
    templateElement.innerHTML = this.compiledTemplate({ images });
    rootElement.appendChild(templateElement);
  }
}