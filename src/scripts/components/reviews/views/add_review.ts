import {ReviewData} from "../types/types";

/**
 * @class AddReviewView
 * @description Управляет отображением и взаимодействием элементов интерфейса добавления отзывов.
 */
export class AddReviewView {
    private stars: NodeListOf<HTMLElement>;
    private submitButton: HTMLButtonElement;
    private commentInput: HTMLTextAreaElement;
    private anonymousCheckbox: HTMLInputElement;
    private messageBox: HTMLDivElement;

    // Константы
    private static readonly MESSAGE_TIMEOUT = 3000; // Время отображения сообщения (мс)
    private static readonly DEFAULT_ANONYMOUS_NAME = "Аноним";

    /**
     * Конструктор класса AddReviewView.
     *
     */
    constructor(name: string) {
        this.stars = document.querySelectorAll('.review__star');
        this.submitButton = document.querySelector('.review__submit') as HTMLButtonElement;
        this.commentInput = document.querySelector('.review__comment') as HTMLTextAreaElement;
        this.anonymousCheckbox = document.querySelector('.review__anonymous-checkbox') as HTMLInputElement;
        this.messageBox = document.querySelector('.review__message-box') as HTMLDivElement;
        this.name = name;
    }

    /**
     * Привязывает обработчик клика по звездам рейтинга.
     * @param {function} handler - Функция-обработчик, принимающая рейтинг.
     */
    bindStarClick(handler: (rating: number) => void): void {
        this.stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-value')!);
                handler(rating);
            });
        });
    }

    /**
     * Привязывает обработчик отправки отзыва.
     * @param {function} handler - Функция-обработчик, принимающая данные отзыва.
     */
    bindSubmit(handler: (data: ReviewData) => void): void {
        this.submitButton.addEventListener('click', () => {
            const rating = Array.from(this.stars).filter(star => star.classList.contains('review__star--active')).length;
            const comment = this.commentInput.value;
            const anonymous = this.anonymousCheckbox.checked;
            handler({ rating, comment, anonymous });
        });
    }

    /**
     * Выделяет звезды в соответствии с заданным рейтингом.
     * @param {number} rating - Количество выделяемых звезд.
     */
    highlightStars(rating: number): void {
        this.stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('review__star--active');
            } else {
                star.classList.remove('review__star--active');
            }
        });
    }

    /**
     * Отображает начальные данные в форме отзыва.
     * @param {ReviewData} data - Данные отзыва для отображения.
     */
    displayInitialData(data: ReviewData): void {
        this.highlightStars(data.rating);
        this.commentInput.value = data.comment;
        this.anonymousCheckbox.checked = data.anonymous;
    }

    /**
     * Отображает сообщение пользователю.
     * @param {string} message - Сообщение для отображения.
     * @param {boolean} [isError=false] - Если true, сообщение отображается как ошибка.
     */
    displayMessage(message: string, isError: boolean = false): void {
        if (this.messageBox) {
            this.messageBox.textContent = message;
            this.messageBox.classList.remove('error', 'success');
            this.messageBox.classList.add(isError ? 'error' : 'success');
            this.messageBox.style.display = 'block';

            // Скрыть сообщение через 3 секунды
            setTimeout(() => {
                this.messageBox.style.display = 'none';
            }, AddReviewView.MESSAGE_TIMEOUT);
        }
    }
}
