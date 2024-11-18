import reviewsTemplate from './reviews.hbs?raw';
import Handlebars from 'handlebars';
import { ReviewsViewInterface } from "../types/types";

export class ReviewsView implements ReviewsViewInterface {
    private readonly compiled: any;
    private readonly rootId: string;

    constructor(rootId: string) {
        this.compiled = Handlebars.compile(reviewsTemplate);
        this.rootId = rootId;
    }

    render = (data: { reviews: any[]; total_review_count: number; total_review_rating: number }): void => {
        console.log(data)

        const rootElement = document.getElementById(this.rootId);
        if (!rootElement) {
            console.error(`Ошибка: rootElement не найден, rootId: ${this.rootId}`);
            return;
        }

        // Проверка структуры данных
        if (!Array.isArray(data.reviews)) {
            console.error('Ошибка: data.reviews должен быть массивом, получено:', data.reviews);
            data.reviews = [];
        }

        rootElement.innerHTML = '';
        const templateElement = document.createElement('div');

        console.log({
            reviews: data.reviews.slice(0, 5), // Первые 5 отзывов
            total_review_count: data.total_review_count,
            total_review_rating: data.total_review_rating,
        })

        // Генерация шаблона с проверкой и передачей параметров
        templateElement.innerHTML = this.compiled({
            reviews: data.reviews.slice(0, 5),
            total_review_count: data.total_review_count,
            total_review_rating: data.total_review_rating,
        });

        rootElement.appendChild(templateElement);

        const sortButtons = document.querySelectorAll('.reviews__sort-button');
        sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                sortButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        const mainSort = document.getElementById('main-sort');
        mainSort.classList.add('active');

        // Логика для "Показать ещё товары"
        const loadMoreButton = document.querySelector('.show-more-products');
        let displayedCount = 5;

        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                displayedCount += 10;
                const newReviews = data.reviews.slice(0, displayedCount);

                if (newReviews.length >= data.reviews.length) {
                    loadMoreButton.style.display = 'none';
                }

                this.render({ reviews: newReviews });
            });
        }

        // Логика для "Показать больше"
        const showMoreButtons = document.querySelectorAll('.product-card__show-more');
        showMoreButtons.forEach(button => {
            const parent = button.closest('.product-card');
            const textElement = parent.querySelector('.product-card__text');

            button.addEventListener('click', () => {
                const isTruncated = textElement.dataset.truncated === 'true';
                if (isTruncated) {
                    textElement.style.maxHeight = 'none'; // Полностью раскрыть
                    button.textContent = 'Скрыть';
                    textElement.dataset.truncated = 'false';
                } else {
                    textElement.style.maxHeight = '60px'; // Свернуть
                    button.textContent = 'Показать больше';
                    textElement.dataset.truncated = 'true';
                }
            });
        });
    };

    renderError = (errorMessage: string): void => {
        const rootElement = document.getElementById(this.rootId);
        if (!rootElement) {
            console.log(`Ошибка: rootElement ${rootElement} -- rootId ${this.rootId}`);
            return;
        }

        rootElement.innerHTML = `<div class="error-message">${errorMessage}</div>`;
    };

    addNewReview = (newReview: any): void => {
        const reviewsContainer = document.querySelector('.reviews');
        if (!reviewsContainer) return;

        const reviewHtml = this.compiled({
            reviews: [newReview], // Шаблон для одного отзыва
        });

        // Вставляем новый отзыв в начало списка
        reviewsContainer.insertAdjacentHTML('afterbegin', reviewHtml);
    }
}
