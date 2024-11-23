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
    }

    showRatingForm(container: HTMLElement, data: any): void {
        console.log(data)

        container.innerHTML = this.csatTemplate(data);
    }

    showError(message: string): void {
        alert(message);
    }
}
