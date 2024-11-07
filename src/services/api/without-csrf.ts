import { apiResponse, parseJsonResponse } from './utils';
import { requestGetInfo, requestGetWithCredInfo, requestPostInfo } from './config';

/**
 * Функция выполняет GET-запрос с использованием настроек для аутентифицированных запросов.
 *
 * @param {string} url - URL-адрес, к которому будет отправлен запрос.
 * @returns {Promise<apiResponse>} Возвращает промис, который разрешается в объект apiResponse.
 */
export const getWithCred = (url: string): Promise<apiResponse> => {
  return fetch(url, requestGetWithCredInfo)
    .then(parseJsonResponse);
};

/**
 * Функция выполняет стандартный GET-запрос.
 *
 * @param {string} url - URL-адрес, к которому будет отправлен запрос.
 * @returns {Promise<apiResponse>} Возвращает промис, который разрешается в объект apiResponse.
 */
export const get = (url: string): Promise<apiResponse> => {
  return fetch(url, requestGetInfo)
    .then(parseJsonResponse);
}

/**
 * Функция выполняет POST-запрос.
 *
 * @param {string} url - URL-адрес, к которому будет отправлен запрос.
 * @returns {Promise<apiResponse>} Возвращает промис, который разрешается в объект apiResponse.
 */
export const post = (url: string): Promise<apiResponse> => {
  return fetch(url, requestPostInfo)
    .then(parseJsonResponse);
}