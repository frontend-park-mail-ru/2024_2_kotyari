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
        setInterval(() => this.updateData(), 5 * 60 * 1000); // Раз в 5 минут
    }

    private async updateData() {
        try {
            const data = await CsatApi.getData();

            if (data && data.order_id && data.new_status) {
                this.render(data.order_id, data.new_status);
            }
        } catch {
            return;
        }
    }

    public render(id: string, status: string) {
        this.view.render(id, status);
    }
}
