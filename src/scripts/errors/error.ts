/**
 * Объект `errors` содержит функции для обработки различных типов ошибок,
 * с выводом сообщения в консоль для каждой из них.
 *
 * @namespace errors
 */
export const errors = {
  /**
   * Обрабатывает ошибки, связанные с загрузкой шаблона.
   *
   * @function
   * @memberof errors
   * @param {Error} error - Объект ошибки, которая возникла при загрузке шаблона.
   */
  TemplatizerError: (error: Error):void => {
    console.error('Ошибка загрузки шаблона:', error);
  },

  /**
   * Обрабатывает ошибки, связанные с получением данных о товарах с сервера.
   *
   * @function
   * @memberof errors
   * @param {Error} error - Объект ошибки, которая возникла при получении товаров.
   */
  GetCardsError: (error: Error):void => {
    console.error('Не удалось получить товары с сервера:', error);
  },

  /**
   * Функция для обработки ошибки, если имя пользователя не найдено в ответе.
   * @function
   */
  GetUsername: ():void => {
    console.error('Ошибка: username не найден в ответе');
  },

  /**
   * Функция для обработки ошибок при выполнении запроса.
   * @function
   * @param {Error} error - Ошибка, возникшая при выполнении запроса.
   */
  BadGet: (error: Error):void => {
    console.error('Ошибка при выполнении запроса:', error);
  },
};
