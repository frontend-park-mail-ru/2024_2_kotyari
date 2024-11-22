import reviewsTemplate from './reviews.hbs?raw';
import reviewsListTemplate from './reviews-card.hbs?raw';
import Handlebars from 'handlebars';
import { ReviewsViewInterface } from "../types/types";
import {ReviewsApi} from "../api/api";
import {Helper} from "../../../utils/helper";
import {isAuth} from "../../../../services/storage/user";

const DEFAULT_DISPLAYED_COUNT = 5;
const DISPLAY_INCREMENT = 10;
const MAX_VISIBLE_LINES = 3;
const SMOOTH_SCROLL_BEHAVIOR = 'smooth';
const SORT_ORDER_ASC = 'asc';

/**
 * Класс для работы с представлением отзывов.
 * @implements {ReviewsViewInterface}
 */
export class ReviewsView implements ReviewsViewInterface {
    /**
     * @private
     * @type {HandlebarsTemplateDelegate}
     */
    private readonly compiled: HandlebarsTemplates;

    /**
     * @private
     * @type {HandlebarsTemplateDelegate}
     */
    private readonly compiledList: HandlebarsTemplates;

    /**
     * @private
     * @type {string}
     */
    private readonly rootId: string;

    /**
     * Конструктор класса ReviewsView.
     * @param {string} rootId - Идентификатор корневого элемента, в который будет рендериться представление.
     */
    constructor(rootId: string) {
        this.compiled = Handlebars.compile(reviewsTemplate);
        this.compiledList = Handlebars.compile(reviewsListTemplate);
        this.rootId = rootId;
    }

    /**
     * Основной метод для рендера отзывов.
     * @param {string} id - Идентификатор товара или сущности, для которой загружаются отзывы.
     * @param {Object} data - Данные для рендера.
     * @param {Array} data.reviews - Массив отзывов.
     * @param {number} data.total_review_count - Общее количество отзывов.
     * @param {number} data.total_review_rating - Общая оценка отзывов.
     */
    render = (id: string, data: { reviews: any[]; total_review_count: number; total_review_rating: number }): void => {
        const reviewsElement = document.getElementById('reviews');
        document.querySelectorAll(".reviews-header-scroll").forEach((el) => {
            el.addEventListener('click', () => {
                if (reviewsElement) {
                    reviewsElement.scrollIntoView({ behavior: SMOOTH_SCROLL_BEHAVIOR});
                }
            });
        });

        document.getElementById("reviews-header").innerHTML = data.total_review_count + ' ' + Helper.pluralize(data.total_review_count, 'отзыв', 'отзыва', 'отзывов')
        document.getElementById("rating-header").innerHTML = data.total_review_rating

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

        let flag = false;
        let value = 'Прокомментировать';
        if (!isAuth()) {
            flag = true;
            value = 'Войдите в аккаунт'
        }

        // Генерация шаблона с проверкой и передачей параметров
        templateElement.innerHTML = this.compiled({
            total_review_count: data.total_review_count,
            total_review_rating: data.total_review_rating,
            flag: flag,
            value: value
        });

        rootElement.appendChild(templateElement);

        this.rerenderList(id, data);

        // Логика для показа и скрытия выпадающего списка
        const dropdownButton = document.querySelector('#main-sort');
        const dropdownOptions = document.querySelector('.reviews__sort-dropdown-options');

        dropdownButton.addEventListener('click', () => {
            dropdownOptions.style.display = dropdownOptions.style.display === 'none' ? 'block' : 'none';
        });

        // Закрытие выпадающего списка при клике вне его
        document.addEventListener('click', (event) => {
            if (!dropdownButton.contains(event.target) && !dropdownOptions.contains(event.target)) {
                dropdownOptions.style.display = 'none';
            }
        });

        // Обработка выбора опции
        dropdownOptions.querySelectorAll('.reviews__sort-dropdown-option').forEach(option => {
            option.addEventListener('click', () => {
                const selectedSort = option.dataset.sort;
                dropdownButton.textContent = option.textContent;
                dropdownButton.appendChild(document.createElement('span')).classList.add('material-icons');
                dropdownButton.querySelector('span').textContent = 'expand_more';
                dropdownButton.dataset.sort = selectedSort;
                dropdownOptions.style.display = 'none';

                // Получение порядка сортировки (по возрастанию/убыванию)
                const sortOrder = document.querySelector('.reviews__sort-button.active')?.dataset.sortOrder || SORT_ORDER_ASC;

                // Отправка запроса на бэкэнд с выбранным параметром
                this.loadSortedReviews(id, selectedSort, sortOrder);
            });
        });

        // Логика для кнопок сортировки по возрастанию/убыванию
        document.querySelectorAll('.reviews__sort-button[data-sort-order]').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.reviews__sort-button[data-sort-order]').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const currentSort = dropdownButton.dataset.sort;

                this.loadSortedReviews(id, currentSort, button.dataset.sortOrder);
            });
        });
    };

    /**
     * Перерисовка списка отзывов.
     * @param {string} id - Идентификатор сущности.
     * @param {Object} data - Данные для рендера.
     * @param {number} [displayedCount=DEFAULT_DISPLAYED_COUNT] - Количество отображаемых отзывов.
     * @param {number} [displayedStart=0] - Индекс начала отображения.
     * @param {number} [num=0] - Порядковый номер группы отзывов.
     */
    rerenderList = (id: string, data: { reviews: any[]; total_review_count: number; total_review_rating: number }, displayedCount: number = DEFAULT_DISPLAYED_COUNT, displayedStart: number = 0, num: number = 0) => {
        document.getElementById('review-list').innerHTML = this.compiledList({ // TODO: +=
            reviews: data.reviews
                .slice(displayedStart, displayedCount)
                .map((review) => {
                    review.num = num;
                    return review;
                }),
            displayedCount: displayedCount - 1,
        })

        // Логика для "Показать ещё товары"
        const loadMoreButton = document.querySelector('.show-more-products');

        if (loadMoreButton) {
            const newLoadMoreButton = loadMoreButton.cloneNode(true) as HTMLElement;
            loadMoreButton.replaceWith(newLoadMoreButton);

            newLoadMoreButton.addEventListener('click', () => {
                displayedStart = displayedCount
                displayedCount += DISPLAY_INCREMENT;

                if (displayedCount >= data.reviews.length) {
                    newLoadMoreButton.style.display = 'none';
                    displayedCount = data.reviews.length + 1;
                }

                this.rerenderList(id, data, displayedCount, 0, num + 1);
            });
        }

        const cards = document.querySelectorAll(".product-card__text");

        cards.forEach((card, index) => {
            const lineHeight = parseFloat(getComputedStyle(card).lineHeight);
            const maxVisibleHeight = lineHeight * MAX_VISIBLE_LINES;

            if (card.scrollHeight > maxVisibleHeight) {
                card.setAttribute("data-truncated", "true");

                const button = document.createElement("button");
                button.className = `product-card__show-more-${index}`;
                button.innerHTML = 'Показать больше <span class="material-icons">keyboard_arrow_down</span>';
                button.addEventListener("click", () => {
                    const isExpanded = card.style.maxHeight === "none";

                    console.log("card: ", card)

                    card.style.maxHeight = isExpanded ? `${maxVisibleHeight}px` : "none";
                    button.innerHTML = isExpanded
                        ? 'Показать больше <span class="material-icons">keyboard_arrow_down</span>'
                        : 'Скрыть <span class="material-icons">keyboard_arrow_up</span>';
                });

                card.parentElement.appendChild(button);
            }
        });
    }

    /**
     * Метод для загрузки отзывов с учетом сортировки.
     * @param {string} id - Идентификатор сущности.
     * @param {string} sortBy - Поле для сортировки.
     * @param {string} sortOrder - Порядок сортировки (asc/desc).
     */
    loadSortedReviews = async (id: string, sortBy: string, sortOrder: string) => {
        try {
            console.log('data: ', sortBy, sortOrder)
            const response = await ReviewsApi.fetchReviews(id, sortBy, sortOrder);
            this.rerenderList(id, response);
        } catch (error) {
            console.error('Ошибка при загрузке отсортированных отзывов:', error);
            this.renderError('Не удалось загрузить отзывы. Попробуйте позже.');
        }
    };

    /**
     * Метод для отрисовки ошибок.
     * @param errorMessage
     */
    renderError = (errorMessage: string): void => {
        const rootElement = document.getElementById(this.rootId);
        if (!rootElement) {
            console.log(`Ошибка: rootElement ${rootElement} -- rootId ${this.rootId}`);
            return;
        }

        rootElement.innerHTML = `<div class="error-message">${errorMessage}</div>`;
    };
}
