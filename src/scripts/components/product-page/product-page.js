import { templatize } from '../../constprograms/templatizer/templatizer.js';

const productPageTemplateURL = '/src/scripts/components/product-page/product-page.hbs';

/**
 * Рендерит страницу продукта с использованием предоставленных данных.
 * @async
 * @param {Object} data - Данные, необходимые для рендеринга страницы продукта.
 */
export async function buildProductPage(data) {
  await templatize(document.getElementById('main'), productPageTemplateURL, data);
  addConditionButtonListeners();
  addColorButtonListeners();

  let currentIndex = 0;
  const slides = document.querySelectorAll('.slide');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const images = data.images;
  const thumbnailHeight = 200;
  const visibleCount = 4;
  const list = document.querySelector('.gallery ul');
  let position = 0;

  // Получаем элемент карусели
  const carousel = document.getElementById('carousel');

  /**
   * Отображает слайд по указанному индексу.
   * @param {number} index - Индекс слайда для отображения.
   */
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? 1 : 0;
    });
    thumbnails.forEach((thumbnail) => thumbnail.classList.remove('active-thumbnail'));
    thumbnails[index].classList.add('active-thumbnail');
    scrollCarouselToThumbnail(index);
  }

  /**
   * Выбирает изображение по указанному источнику и обновляет карусель.
   * @param {string} src - Источник выбранного изображения.
   */
  function selectImage(src) {
    currentIndex = images.indexOf(src);
    showSlide(currentIndex);
  }

  /**
   * Прокручивает карусель, чтобы убедиться, что миниатюра с указанным индексом видна.
   * @param {number} index - Индекс миниатюры, к которой нужно прокрутить.
   */
  function scrollCarouselToThumbnail(index) {
    const startVisibleIndex = Math.abs(position / thumbnailHeight);
    const endVisibleIndex = startVisibleIndex + visibleCount - 1;

    if (index < startVisibleIndex) {
      position = -index * thumbnailHeight;
    } else if (index > endVisibleIndex) {
      position = -(index - visibleCount + 1) * thumbnailHeight;
    }
    list.style.marginTop = `${position}px`;
  }

  /**
   * Переключает карусель на следующий слайд.
   */
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  /**
   * Переключает карусель на предыдущий слайд.
   */
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => selectImage(images[index]));
  });

  document.getElementById('next-button').addEventListener('click', nextSlide);
  document.getElementById('prev-button').addEventListener('click', prevSlide);

  showSlide(currentIndex);

  // Обработчики событий для кнопок прокрутки карусели
  carousel.querySelector('.prev').onclick = function () {
    position += thumbnailHeight;
    position = Math.min(position, 0);
    list.style.marginTop = `${position}px`;
  };

  carousel.querySelector('.next').onclick = function () {
    position -= thumbnailHeight;
    position = Math.max(position, -thumbnailHeight * (thumbnails.length - visibleCount));
    list.style.marginTop = `${position}px`;
  };
}

/**
 * Добавляет обработчики событий для кнопок условий на странице продукта.
 */
function addConditionButtonListeners() {
  const conditionButtons = document.querySelectorAll('.condition-buttons button');
  const currentPriceElement = document.querySelector('.current-price-product-page');

  conditionButtons.forEach((button) => {
    button.addEventListener('click', function () {
      conditionButtons.forEach((btn) => btn.classList.remove('selected'));
      this.classList.add('selected');
      const price = this.getAttribute('data-price');
      currentPriceElement.textContent = `${price} ₽`;
    });
  });
}

/**
 * Добавляет обработчики событий для кнопок цветов на странице продукта.
 */
function addColorButtonListeners() {
  const colorButtons = document.querySelectorAll('.colors .color-button');

  colorButtons.forEach((button) => {
    button.addEventListener('click', function () {
      colorButtons.forEach((btn) => btn.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
}
