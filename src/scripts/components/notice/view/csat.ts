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

    public render = (data_in: any) => {
        let text: string = '';

        for (const key in data_in) {
            text += `\n<div class='order-status'>Статус заказа <b class='order-id'>${data_in[key].order_id}</b> изменился на <span class='order-status__highlight'>"${this.switchOrderStatus(data_in[key].new_status)}"</span></div>`;
        }

        const data = {
            "title": `Изменения значений:`,
            "text": text.trim(),
        };

        // Style container for mobile responsiveness
        this.container.style.display = 'flex';
        this.container.style.maxHeight = '400px';
        this.container.style.overflowY = 'auto';
        this.container.style.borderRadius = '10px';
        this.container.style.padding = '10px';

        // Adjust for mobile screens
        if (window.innerWidth <= 768) {

        }

        this.title.innerHTML = data.title;
        this.text.innerHTML = data.text;

        // Ensure content does not overflow and IDs break correctly
        this.text.style.wordWrap = 'break-word';
        const orderIds = this.text.querySelectorAll('.order-id');
        orderIds.forEach((id) => {
            id.style.wordBreak = 'break-all';
        });
    }
}