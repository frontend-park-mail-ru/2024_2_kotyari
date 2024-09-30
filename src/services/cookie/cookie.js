import {backurl} from "../router/settings.js";
import {errors} from "../../scripts/errors/errors.js";

/**
 * Константа времени жизни cookie в миллисекундах (20 минут).
 * @constant {number}
 */
export const COOKIEEXPIRATION = 20 * 60 * 1000;

/**
 * Устанавливает cookie с указанным именем, значением и временем истечения.
 *
 * @param {string} name - Имя cookie.
 * @param {Object} value - Значение, которое будет сохранено в cookie (объект сериализуется в JSON).
 * @param {number} expirationTime - Время жизни cookie в миллисекундах.
 */
export const setCookie = (name, value, expirationTime) => {
    let date = new Date();
    date.setTime(date.getTime() + expirationTime);
    document.cookie = `${name}=${JSON.stringify(value)};expires=${date.toUTCString()};path=/`;
};

/**
 * Получает значение cookie по его имени.
 *
 * @param {string} name - Имя cookie для получения.
 * @returns {Object|null} - Значение cookie, если оно существует, или null, если cookie не найдено.
 */
export const getCookie = (name) => {
    let result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
};

/**
 * Удаляет cookie по его имени.
 *
 * @param {string} name - Имя cookie, которое нужно удалить.
 */
export const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999;path=/`;
};

/**
 * Отправляет GET запрос на бекенд и при успешном ответе устанавливает cookie 'user'.
 */
export const fetchUserDataAndSetCookie = async () => {
    try {
        const response = await fetch(backurl + '');

        if (response.ok) {
            const data = await response.json(); // Парсим JSON из ответа

            // Проверяем наличие поля username в ответе
            if (data.username) {
                // Устанавливаем cookie с именем пользователя и городом 'Москва'
                setCookie('user', { city: 'Москва', name: data.username }, COOKIEEXPIRATION);
            } else {
                errors.GetUsername();
            }
        }
    } catch (err) {
        errors.BadGet(err);
    }
};
