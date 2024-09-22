import {errors} from "../errors/errors.js";

export function templatize(root, url, data) {
    // Загружаем шаблон через AJAX
    return fetch(url)
        .then(response => response.text())
        .then(templateSource => {
            // Компилируем шаблон
            const template = Handlebars.compile(templateSource);

            // Вставляем сгенерированный HTML в каталог
            root.innerHTML = template(data);
        })
        .catch(err => {
            errors.ShablonError(err)
        });
}
