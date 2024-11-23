import csat from './csat.hbs?raw';
import Handlebars from "handlebars";
import {CSATTypes} from "./config";

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

        this.showRatingForm(container, CSATTypes[type]);

        const rating = new RatingCircles('rating-container');
    }

    showRatingForm(container: HTMLElement, data: any): void {
        console.log(data)

        container.innerHTML = this.csatTemplate(data);

        const circles = document.querySelectorAll('.rating-circles__circle');
        let activeIndex = -1;

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
            });
        });
    }

    showError(message: string): void {
        alert(message);
    }
}
