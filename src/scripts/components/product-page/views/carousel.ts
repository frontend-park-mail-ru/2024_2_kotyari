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

  private initializeEventListeners() {
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

  private showSlide(index: number) {
    this.updateSlideVisibility();
    this.updateThumbnailSelection(index);
    this.scrollToThumbnail(index);
  }

  private updateSlideVisibility() {
    this.slides.forEach((slide, i) => {
      slide.style.opacity = i === this.currentIndex ? '1' : '0';
    });
  }

  private updateThumbnailSelection(index: number) {
    this.thumbnails.forEach((thumbnail) => thumbnail.classList.remove('active-thumbnail'));
    this.thumbnails[index].classList.add('active-thumbnail');
  }

  private scrollToThumbnail(index: number) {
    const startVisibleIndex = Math.abs(this.position / this.thumbnailHeight);
    const endVisibleIndex = startVisibleIndex + this.visibleCount - 1;

    if (index < startVisibleIndex) {
      this.position = -index * this.thumbnailHeight;
    } else if (index > endVisibleIndex) {
      this.position = -(index - this.visibleCount + 1) * this.thumbnailHeight;
    }
    this.list.style.marginTop = `${this.position}px`;
  }

  private getNextIndex(currentIndex: number, length: number) {
    return (currentIndex + 1) % length;
  }

  private getPrevIndex(currentIndex: number, length: number) {
    return (currentIndex - 1 + length) % length;
  }

  private scrollPrev() {
    this.position += this.thumbnailHeight;
    this.list.style.marginTop = `${Math.min(this.position, 0)}px`;
    return this.position;
  }

  private scrollNext() {
    this.position -= this.thumbnailHeight;
    this.list.style.marginTop = `${Math.max(this.position, -this.thumbnailHeight * (this.thumbnails.length - this.visibleCount))}px`;
    return this.position;
  }
}
