import Handlebars from 'handlebars';
import csatTemplate from './csat.hbs';
import {csatView, csatViewInterface} from "../view/csat";

export interface presenterInterface {
    private updateData(): void;
}

export class presenter implements presenterInterface {
    private readonly compile: HandlebarsTemplates;
    private readonly title: HTMLElement;
    private readonly text: HTMLElement;
    private readonly endpoint: string;
    private readonly view: csatViewInterface;

    constructor(containerId: string, endpoint: string) {
        this.view = csatView()

        this.startPolling();
    }

    private startPolling() {
        this.updateData();
        setInterval(() => this.updateData(), 5 * 60 * 1000); // Раз в 5 минут
    }

    private async updateData() {
        try {
            const response = await fetch(this.endpoint);

            if (!response.ok) {
                console.error(`Ошибка запроса: ${response.statusText}`);
                return;
            }

            const data = await response.json();

            if (data && data.id && data.status) {
                this.render(data.id, data.status);
            }
        } catch (error) {
            console.error('Ошибка при запросе данных:', error);
        }
    }

    private render(id: string, status: string) {
        this.view.render(id, status);
    }
}
