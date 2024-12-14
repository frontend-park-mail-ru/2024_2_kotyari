import Handlebars from 'handlebars';
import csatTemplate from './csat.hbs'

export interface csatViewInterface {
    private render(id: string, status: string);
}

export class csatView implements csatViewInterface {
    private readonly compile: HandlebarsTemplates;
    private readonly title: HTMLElement;
    private readonly text: HTMLElement;

    constructor(containerId: string) {
        this.compile = Handlebars.compile(csatTemplate)

        const container = document.getElementById(containerId);

        container?.innerHTML = this.compile()

        this.title = document.getElementById('voting-frame__title__text');
        this.text = document.getElementById('content');

        const backButton = document.getElementById('voting-frame__back');
        const closeButton = document.getElementById('frame__title__close');

        this.backButton.addEventListener('click', (data) => {
            container.innerHTML = '';
            this.showRatingForm(container, data);
        });

        this.closeButton?.addEventListener('click', () => {
            container.innerHTML = '';
            container.style.display = 'none';
        });
    }

    private render = (id: string, status: string) => {
        const data = {
            "title": `Заказ - ${id}`,
            "text": `Статус заказа изменился на "${status}"`,
        }

        this.title.innerHTML = data.title;
        this.text.innerHTML = data.text;
    }
}