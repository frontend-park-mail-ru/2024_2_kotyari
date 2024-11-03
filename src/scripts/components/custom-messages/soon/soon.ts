import Handlebars from "handlebars";
import {rootId} from "../../../../services/app/config";
import soonTmp from './soon.hbs?raw';

const returnPage = '/';

/**
 * Отображает шаблон 'soon' в основной области контента.
 *
 * Эта функция загружает шаблон 'soon' и вставляет его в 'main'.
 *
 * @returns {Promise} Промис, который разрешается после успешного отображения шаблона.
 */
export function soon() {
    let config = {
        return: returnPage,
    };

    const compiled = Handlebars.compile(soonTmp);

    const rootElement = document.getElementById(rootId) as HTMLElement;
    if (!rootElement) {
        console.error(`Element ID = ${rootId} not found`);
    }

    rootElement.innerHTML = '';
    const templateElement = document.createElement('div');
    templateElement.innerHTML = compiled(config);
    rootElement.appendChild(templateElement);
}
