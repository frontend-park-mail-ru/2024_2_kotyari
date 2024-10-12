import {errors} from "../../errors/errors.js";
import {partials} from "./partials.js";
import {helpers} from "./helpers.js";

/**
 * Загружает partial-шаблон по указанному URL.
 *
 * @function loadPartial
 * @param {string} url - URL для загрузки partial-шаблона.
 * @returns {Promise<string>} - Возвращает промис с содержимым partial-шаблона.
 * @throws {Error} - Возникает ошибка при загрузке partial-шаблона.
 */
function loadPartial(url) {
    return fetch(url)
        .then(response => response.text())
        .catch(err => {
            throw new Error(`Ошибка загрузки partial: ${url} - ${err}`);
        });
}

/**
 * Асинхронно регистрирует partial-шаблоны, включая их вложенные partials.
 *
 * @async
 * @function registerPartials
 * @param {Array<Object>} partialList - Список объектов partial-шаблонов для регистрации.
 * Каждый объект должен содержать имя partial и URL для загрузки.
 * @returns {Promise<void>} - Возвращает промис, который завершится после регистрации всех partial-шаблонов.
 * @throws {Error} - Возникает ошибка при регистрации partial-шаблонов.
 */
async function registerPartials(partialList) {
    // Регистрируем все переданные partials
    const partialPromises = partialList.map(async (partial) => {
        const partialContent = await loadPartial(partial.partial);
        // eslint-disable-next-line no-undef
        Handlebars.registerPartial(partial.name, partialContent);

        // Проверяем, есть ли вложенные partials для текущего partial
        if (partial.partial in partials) {
            // Рекурсивно загружаем вложенные partials
            await registerPartials(partials[partial.partial]);
        }
    });

    return Promise.all(partialPromises);
}

/**
 * Регистрирует хелперы в Handlebars.
 *
 * @function registerHelpers
 * @param {Array<Object>} helperList - Список объектов хелперов для регистрации.
 * Каждый объект должен содержать имя хелпера и ссылку на функцию.
 */
function registerHelpers(helperList) {
    helperList.forEach((helper) => {
        Handlebars.registerHelper(helper.name, helper.function);
    });
}

/**
 * Основная функция для загрузки и рендеринга Handlebars-шаблона.
 *
 * @async
 * @function templatize
 * @param {HTMLElement} root - Корневой HTML-элемент, в который будет рендериться шаблон.
 * @param {string} url - URL основного шаблона для загрузки.
 * @param {Object} data - Данные, которые будут использоваться для рендеринга шаблона.
 * @returns {Promise<void>} - Возвращает промис, который завершится после рендеринга шаблона.
 * @throws {Error} - Возникает ошибка при загрузке или рендеринге шаблона.
 */
export async function templatize(root, url, data) {
    try {
        if (url in partials) {
            // Регистрируем partials
            await registerPartials(partials[url]);
        }

        // Загружаем основной шаблон через AJAX
        const response = await fetch(url);
        const templateSource = await response.text();

        // Компилируем и рендерим шаблон
        // eslint-disable-next-line no-undef
        const template = Handlebars.compile(templateSource);
        root.innerHTML = template(data);
    } catch (err) {
        // Обработка ошибок
        errors.ShablonError(err);
    }
}

// Регистрируем хелперы для Handlebars
registerHelpers(helpers);

// TODO: предотвратить повторность загрузки (добавить {name: bool})
