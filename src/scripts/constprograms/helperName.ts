import {Helper} from "./helper";
import Handlebars from "handlebars";

/**
 * Интерфейс для описания объекта помощника, содержащего имя и функцию.
 *
 * @interface iHelper
 */
interface iHelper {
    /**
     * Имя функции-помощника.
     * @type {string}
     */
    name: string,
    /**
     * Функция, зарегистрированная как помощник.
     * @type {(...args: any[]) => string | boolean}
     */
    function: (...args: any[]) => string | boolean
}

/**
 * Массив помощников с именами и соответствующими функциями.
 * @type {Array<iHelper>}
 */
const helperName: Array<iHelper> = [
    {
        name: 'formatDate',
        function: Helper.formatDate.bind(Helper)
    }, {
        name: 'pluralize',
        function: Helper.pluralize.bind(Helper)
    }, {
        name: 'eq',
        function: Helper.eq.bind(Helper)
    }
];

/**
 * Регистрирует функции-помощники в Handlebars.
 *
 * @async
 * @returns {Promise<boolean>} Возвращает true в случае успешной регистрации,
 * иначе false при ошибке.
 */
export async function registerFunctions(): Promise<Boolean> {
    try {
        helperName.forEach((helpFunction: iHelper) => {
            Handlebars.registerHelper(helpFunction.name, helpFunction.function);
        })
    } catch (error) {
        console.error(error);

        return false;
    }

    return true;
}