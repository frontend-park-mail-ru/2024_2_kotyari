/**
 * Регистрация пользовательских функций-хелперов для Handlebars.
 *
 * В данном случае регистрируется хелпер 'eq', который позволяет сравнивать два значения
 * внутри шаблонов Handlebars.
 *
 * Пример использования:
 *
 * ```handlebars
 * {{#if (eq value1 value2)}}
 *   Значения равны
 * {{else}}
 *   Значения не равны
 * {{/if}}
 * ```
 *
 * @function
 */
export function registrFunctions () {
    /**
     * Хелпер 'eq' для сравнения двух значений.
     *
     * @param {*} a - Первое значение для сравнения.
     * @param {*} b - Второе значение для сравнения.
     * @returns {boolean} Возвращает true, если значения равны, иначе false.
     */
    // eslint-disable-next-line no-undef
    Handlebars.registerHelper('eq', function (a, b) {
        return a === b;
    });
}