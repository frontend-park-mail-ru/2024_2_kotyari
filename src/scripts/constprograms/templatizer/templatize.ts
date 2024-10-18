import {HandlebarManager} from "../../../../src/scripts/constprograms/handlebars/handlebars.js";
import {errors} from "../../../../src/scripts/errors/errors.js";
import {partials} from "../../../../src/scripts/constprograms/templatizer/partials.js";
import {helpers} from "../../../../src/scripts/constprograms/templatizer/helpers.js";
import {HelperFunctions, Partials} from "../../../../src/scripts/constprograms/templatizer/types/types";

export class TemplateManager {
    private static registeredPartials: Set<string> = new Set();
    private static registeredHelpers: Set<string> = new Set();

    /**
     * Загружает partial-шаблон по указанному URL.
     *
     * @param url - URL для загрузки partial-шаблона.
     * @returns {Promise<string>} - Промис с содержимым partial-шаблона.
     * @throws {Error} - Если не удалось загрузить partial-шаблон.
     */
    private static async loadPartial(url: string): Promise<string> {
        try {
            const response = await fetch(url);
            return await response.text();
        } catch (err) {
            throw new Error(`Ошибка загрузки partial: ${url} - ${err}`);
        }
    }

    /**
     * Регистрирует partial-шаблоны, включая их вложенные partials.
     *
     * @param partialList - Список объектов partial-шаблонов для регистрации.
     * @returns {Promise<void>} - Промис, который завершится после регистрации всех partial-шаблонов.
     */
    public static async registerPartials(partialList: Partials[]): Promise<void> {
        const partialPromises = partialList.map(async (partial) => {
            if (!this.registeredPartials.has(partial.name)) {
                const partialContent = await this.loadPartial(partial.partial);
                HandlebarManager.registerPartial(partial.name, partialContent);
                this.registeredPartials.add(partial.name);

                // Проверяем вложенные partial-шаблоны
                if (partial.partial in partials) {
                    await this.registerPartials(partials[partial.partial]);
                }
            }
        });

        await Promise.all(partialPromises);
    }

    /**
     * Регистрирует хелперы для Handlebars.
     *
     * @param helperList - Список объектов хелперов для регистрации.
     */
    public static registerHelpers(): void {
        helpers.forEach((helper) => {
            const helperName = helper.name as keyof HelperFunctions;
            if (!this.registeredHelpers.has(helperName)) {
                HandlebarManager.registerHelper(helperName, helper.function);
                this.registeredHelpers.add(helperName);
            }
        });
    }

    /**
     * Загружает и рендерит Handlebars-шаблон.
     *
     * @param root - Корневой HTML-элемент, в который будет рендериться шаблон.
     * @param url - URL основного шаблона для загрузки.
     * @param data - Данные для рендеринга шаблона.
     * @returns {Promise<void>} - Промис, который завершится после рендеринга шаблона.
     */
    public static async templatize(root: HTMLElement, url: string, data: object): Promise<void> {
        try {
            if (url in partials) {
                await this.registerPartials(partials[url]);
            }

            const response = await fetch(url);
            const templateSource = await response.text();

            const template = HandlebarManager.compile(templateSource);
            root.innerHTML = template(data);
        } catch (err) {
            errors.ShablonError(err);
        }
    }
}
