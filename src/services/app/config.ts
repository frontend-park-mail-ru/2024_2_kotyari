export const rootId: string = 'app';
/**
 * URL-адрес бекенд-сервера, используемый для отправки запросов с фронтенда.
 *
 * @constant {string}
 * @default 'http://localhost:8000/'
 */
export const backurl = 'http://localhost:8000';
// export const backurl = 'http://94.139.246.241:8000';

/**
 * Значение атрибуда router для элементов с кликабельными ссылками.
 * @enum {string}
 */
export const CLICK_CLASSES = {
  stability: 'stability-active',
  overrideable: 'changed-active',
};

/**
 * Атрибут для получения URL из элемента.
 * @type {string}
 */
export const urlAttribute = 'href';
