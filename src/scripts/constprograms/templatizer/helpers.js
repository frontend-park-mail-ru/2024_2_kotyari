import { Helper } from '../../../../dist/scripts/constprograms/templatizer/helps/helper.js';

/**
 * Массив вспомогательных функций (хелперов), которые могут быть использованы в проекте.
 *
 * @typedef {Object} Helper
 * @property {string} name - Название хелпера, которое будет использоваться для вызова функции.
 * @property {Function} function - Ссылка на саму функцию хелпера.
 *
 * Экспортируемый массив `helpers` содержит объекты с именем и ссылкой на функцию хелпера.
 * В данном случае, массив содержит хелпер для работы с множественными формами существительных.
 *
 * @example
 * // Пример использования:
 * helpers.find(helper => helper.name === 'pluralize').function(5, 'товар', 'товара', 'товаров');
 *
 * @exports helpers
 */
export const helpers = [{
    name: 'pluralize',
    function: Helper.pluralize,
}, {
    name: 'formatDate',
    function: Helper.formatDate,
}, {
    name: 'eq',
    function: Helper.eq,
}]