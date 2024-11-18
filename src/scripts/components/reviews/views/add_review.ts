import {ReviewData} from "../types/types";

export class AddReviewView {
    private stars: NodeListOf<HTMLElement>;
    private submitButton: HTMLButtonElement;
    private commentInput: HTMLTextAreaElement;
    private anonymousCheckbox: HTMLInputElement;
    private messageBox: HTMLDivElement;

    constructor() {
        this.stars = document.querySelectorAll('.review__star');
        this.submitButton = document.querySelector('.review__submit') as HTMLButtonElement;
        this.commentInput = document.querySelector('.review__comment') as HTMLTextAreaElement;
        this.anonymousCheckbox = document.querySelector('.review__anonymous-checkbox') as HTMLInputElement;
        this.messageBox = document.querySelector('.review__message-box') as HTMLDivElement;
    }

    bindStarClick(handler: (rating: number) => void): void {
        this.stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-value')!);
                handler(rating);
            });
        });
    }

    bindSubmit(handler: (data: ReviewData) => void): void {
        this.submitButton.addEventListener('click', () => {
            const rating = Array.from(this.stars).filter(star => star.classList.contains('review__star--active')).length;
            const comment = this.commentInput.value;
            const anonymous = this.anonymousCheckbox.checked;
            const name = anonymous ? 'Аноним' : 'Иван';
            handler({ rating, comment, anonymous, name });
        });
    }

    highlightStars(rating: number): void {
        this.stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('review__star--active');
            } else {
                star.classList.remove('review__star--active');
            }
        });
    }

    displayInitialData(data: ReviewData): void {
        this.highlightStars(data.rating);
        this.commentInput.value = data.comment;
        this.anonymousCheckbox.checked = data.anonymous;
    }

    displayMessage(message: string, isError: boolean = false): void {
        if (this.messageBox) {
            this.messageBox.textContent = message;
            this.messageBox.classList.remove('error', 'success');
            this.messageBox.classList.add(isError ? 'error' : 'success');
            this.messageBox.style.display = 'block';

            // Скрыть сообщение через 3 секунды
            setTimeout(() => {
                this.messageBox.style.display = 'none';
            }, 3000);
        }
    }
}
