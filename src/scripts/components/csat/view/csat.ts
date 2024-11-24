import csat from './csat.hbs?raw';
import Handlebars from "handlebars";
import {CSATTypes} from "../types/config";
import {CSATApi} from "../api/api";
import string from "vite-plugin-string";
import {RatingRequest} from "../types/types";

export class CSATView {
    private readonly csatTemplate: HandlebarsTemplates;

    constructor() {
        this.csatTemplate = Handlebars.compile(csat);
    }

    render(containerId: string, type: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error("Container not found");
        }

        this.showRatingForm(container, CSATTypes[type], type);
    }

    showRatingForm(container: HTMLElement, data: any, type: string): void {
        container.style.display = 'flex';

        container.innerHTML = this.csatTemplate(data);

        const circles = container.querySelectorAll('.rating-circles__circle');
        const voteButton = document.getElementById("voting-frame__submit");
        const questionArea = document.createElement('textarea');
        const backButton = document.getElementById('voting-frame__back');
        const closeButton = container.querySelector('.voting-frame__title__close');
        let activeIndex = -1;

        questionArea.className = 'voting-frame__textarea';
        questionArea.style.display = 'none';

        voteButton!.classList.add('disabled');

        circles.forEach((circle, index) => {
            circle.addEventListener('click', () => {
                activeIndex = index;
                circles.forEach((c, i) => {
                    if (i <= index) {
                        c.classList.add(`rating-circles__circle--active`);
                    } else {
                        c.classList.remove(`rating-circles__circle--active`);
                    }
                });

                voteButton!.classList.remove('disabled');
            });
        });

        let sub = () => {
            if (activeIndex === -1) return;

            questionArea.style.display = 'block';
            backButton.style.display = 'block';

            document.getElementById("voting-frame__back").style.width = "125px";
            document.getElementById("voting-frame__submit").style.width = "125px";
            questionArea.placeholder = activeIndex > 5
                ? 'Пожалуйста, напишите почему!'
                : 'Пожалуйста, напишите чтобы Вы хотели увидеть другим...';

            const titleElement = document.getElementById('voting-frame__title__text');
            if (titleElement) {
                titleElement.innerHTML = `${activeIndex > 5
                    ? 'Что вам понравилось?'
                    : 'Что вам не понравилось?'}`;
            }

            document.getElementById("rating-circles").innerHTML = '';
            document.getElementById("rating-circles").appendChild(questionArea);

            document.getElementById("back").appendChild(backButton);

            voteButton!.removeEventListener('click', sub);

            voteButton!.addEventListener('click', submitRating);
        }

        voteButton!.addEventListener('click', sub);

        const submitRating = async () => {
            if (activeIndex === -1) return;

            const rating = activeIndex + 1; // Assuming 0-based index for circles
            const comment = questionArea.value.trim() || null;

            try {
                await this.submitRating(container, rating, type, comment);
            } catch (error) {
                this.showError('Ошибка при отправке рейтинга');
            }
        };

        backButton.addEventListener('click', () => {
            container.innerHTML = '';
            this.showRatingForm(container, data);
        });

        closeButton?.addEventListener('click', () => {
            container.innerHTML = '';
            container.style.display = 'none';
        });
    }

    async submitRating(container: HTMLElement, rating: number, type: string, comment: string | null): Promise<void> {
        const request: RatingRequest = { rating, comment, type: type };
        const response = await CSATApi.voteCSAT(request);

        console.log(2)

        if (response.status === 200) {
            const stats = await CSATApi.getRatingStats();
            if (stats.status === 200 && stats.body) {
                //this.view.showStats(stats.body.rating);
            }
        } else {
            this.showError(response.message);
        }

        container.innerHTML = '';
        container.style.display = 'none';
    }

    showError(message: string): void {
        console.log(message);
    }
}
