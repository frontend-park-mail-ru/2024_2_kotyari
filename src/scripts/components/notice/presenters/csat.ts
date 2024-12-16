import Handlebars from 'handlebars';
import csatTemplate from './csat.hbs';
import {csatView, csatViewInterface} from "../view/csat";
import {CsatApi} from "../api/csat";

export interface csatPresenterInterface {
    render(): void;
}

export class csatPresenter implements csatPresenterInterface {
    private readonly compile: HandlebarsTemplates;
    private readonly title: HTMLElement;
    private readonly text: HTMLElement;
    private readonly view: any;

    constructor(containerId: string) {
        this.view = new csatView(containerId);

        this.startPolling();
    }

    private startPolling() {
        this.updateData();
        setInterval(() => this.updateData(), 60 * 1000); // Раз в минут
    }

    private async updateData() {
        try {
            const data = await CsatApi.getData();

            if (data && data.orders_updates) {
                this.render(data.orders_updates);
            }
        } catch {
            return;
        }
    }

    public render(data: any) {
        this.view.render(data);
    }
}
