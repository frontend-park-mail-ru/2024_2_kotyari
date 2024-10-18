import {TemplateManager} from "/dist/scripts/constprograms/shablon/templatize.js";

const returnPage = '/';

/**
 * Отображает шаблон 'soon' в основной области контента.
 *
 * Эта функция загружает шаблон 'soon' и вставляет его в 'main'.
 *
 * @returns {Promise} Промис, который разрешается после успешного отображения шаблона.
 */
export function soon() {
    return TemplateManager.templatize(document.getElementById('main'), '/src/scripts/components/custom-messages/soon/soon.hbs', {
        return: returnPage
    });
}
