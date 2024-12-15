import Handlebars from 'handlebars';
import csatTemplate from './csat.hbs'

export interface csatViewInterface {
    render(id: string, status: string): void;
    switchOrderStatus(status: string): string;
}

export class csatView implements csatViewInterface {
    private readonly compile: HandlebarsTemplates;
    private readonly title: HTMLElement;
    private readonly text: HTMLElement;
    private container: HTMLElement | null;

    constructor(containerId: string) {
        this.compile = Handlebars.compile(csatTemplate)

        this.container = document.getElementById(containerId);

        this.container.innerHTML = this.compile({title: '', text: ''})

        this.title = document.getElementById('voting-frame__title__text');
        this.text = document.getElementById('content');

        const backButton = document.getElementById('voting-frame__back');
        const closeButton = document.getElementById('frame__title__close');

        backButton.addEventListener('click', (data) => {
            this.container.style.display = 'none';
        });

        closeButton?.addEventListener('click', () => {
            this.container.style.display = 'none';
        });
    }

    public switchOrderStatus(status: string): string {
        switch (status) {
            case 'awaiting_payment':
                return 'Ожидает оплаты';
            case 'paid':
                return 'Оплачен';
            case 'delivered':
                return 'Доставлен';
            case 'cancelled':
                return 'Отменен';
            default:
                return '';
        }
    }

    public render = (id: string, status: string) => {
        const data = {
            "title": `Заказ - ${id}`,
            "text": `Статус заказа изменился на "${this.switchOrderStatus(status)}"`,
        }

        this.container.style.display = 'flex';

        this.title.innerHTML = data.title;
        this.text.innerHTML = data.text;
    }
}