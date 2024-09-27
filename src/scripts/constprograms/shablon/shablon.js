import {errors} from "../../errors/errors.js";
import {partials} from "./partials.js";

// Функция для асинхронной загрузки partial по URL
function loadPartial(url) {
    return fetch(url)
        .then(response => response.text())
        .catch(err => {
            throw new Error(`Ошибка загрузки partial: ${url} - ${err}`);
        });
}

// Регистрация partials перед рендерингом шаблона
async function registerPartials(partialList) {
    // Регистрируем все переданные partials
    const partialPromises = partialList.map(async (partial) => {
        const partialContent = await loadPartial(partial.partial);
        Handlebars.registerPartial(partial.name, partialContent);

        // Проверяем, есть ли вложенные partials для текущего partial
        if (partial.partial in partials) {
            // Рекурсивно загружаем вложенные partials
            await registerPartials(partials[partial.partial]);
        }
    });

    return Promise.all(partialPromises);
}


// Основная функция templatize
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
        const template = Handlebars.compile(templateSource);
        root.innerHTML = template(data);
    } catch (err) {
        // Обработка ошибок
        errors.ShablonError(err);
    }
}