import Handlebars from 'handlebars';

export const HandlebarsRegEqual = (): void => {
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
};
