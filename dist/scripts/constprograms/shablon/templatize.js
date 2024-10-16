var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HandlebarManager } from "../handlebars/handlebars.js";
import { errors } from "../../../../src/scripts/errors/errors.js";
import { partials } from "../../../../src/scripts/constprograms/shablon/partials.js";
import { helpers } from "../../../../src/scripts/constprograms/shablon/helpers.js";
export class TemplateManager {
    /**
     * Загружает partial-шаблон по указанному URL.
     *
     * @param url - URL для загрузки partial-шаблона.
     * @returns {Promise<string>} - Промис с содержимым partial-шаблона.
     * @throws {Error} - Если не удалось загрузить partial-шаблон.
     */
    static loadPartial(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(url);
                return yield response.text();
            }
            catch (err) {
                throw new Error(`Ошибка загрузки partial: ${url} - ${err}`);
            }
        });
    }
    /**
     * Регистрирует partial-шаблоны, включая их вложенные partials.
     *
     * @param partialList - Список объектов partial-шаблонов для регистрации.
     * @returns {Promise<void>} - Промис, который завершится после регистрации всех partial-шаблонов.
     */
    static registerPartials(partialList) {
        return __awaiter(this, void 0, void 0, function* () {
            const partialPromises = partialList.map((partial) => __awaiter(this, void 0, void 0, function* () {
                if (!this.registeredPartials.has(partial.name)) {
                    const partialContent = yield this.loadPartial(partial.partial);
                    HandlebarManager.registerPartial(partial.name, partialContent);
                    this.registeredPartials.add(partial.name);
                    // Проверяем вложенные partial-шаблоны
                    if (partial.partial in partials) {
                        yield this.registerPartials(partials[partial.partial]);
                    }
                }
            }));
            yield Promise.all(partialPromises);
        });
    }
    /**
     * Регистрирует хелперы для Handlebars.
     *
     * @param helperList - Список объектов хелперов для регистрации.
     */
    static registerHelpers() {
        helpers.forEach((helper) => {
            if (!this.registeredHelpers.has(helper.name)) {
                HandlebarManager.registerHelper(helper.name, helper.function);
                this.registeredHelpers.add(helper.name);
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
    static templatize(root, url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (url in partials) {
                    yield this.registerPartials(partials[url]);
                }
                const response = yield fetch(url);
                const templateSource = yield response.text();
                const template = HandlebarManager.compile(templateSource);
                root.innerHTML = template(data);
            }
            catch (err) {
                errors.ShablonError(err);
            }
        });
    }
}
TemplateManager.registeredPartials = new Set();
TemplateManager.registeredHelpers = new Set();
//# sourceMappingURL=templatize.js.map