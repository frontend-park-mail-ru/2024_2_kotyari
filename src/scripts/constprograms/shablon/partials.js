/**
 * Объект `partials` содержит маппинг основных шаблонов и их подшаблонов (partials).
 * Используется для динамической подстановки частичных шаблонов в Handlebars.
 *
 * @namespace partials
 * @property {Object[]} '/src/scripts/layouts/body.hbs' - Частичные шаблоны для основного шаблона body.
 * @property {Object[]} '/src/scripts/layouts/header/header.hbs' - Частичные шаблоны для шаблона header.
 *
 * Каждый объект в массиве содержит следующие свойства:
 *
 * @property {string} name - Имя подшаблона, которое будет использоваться в основном шаблоне.
 * @property {string} partial - Путь к файлу подшаблона, который будет подключен.
 */
export const partials = {
    '/src/scripts/layouts/body.hbs': [{
        name: 'header',
        partial: '/src/scripts/layouts/header/header.hbs'
    }, {
        name: 'footer',
        partial: '/src/scripts/layouts/footer/footer.hbs'
    }],

    '/src/scripts/layouts/header/header.hbs': [{
        name: 'searcher',
        partial: '/src/scripts/components/elements/searcher/searcher.hbs'
    }]
}
