import * as Handlebars from 'handlebars';

// Декларируем класс HandlebarManager и его методы
export declare class HandlebarManager {
  /**
   * Регистрирует partial-шаблон.
   * @param name - Название partial-шаблона.
   * @param content - Содержимое partial-шаблона.
   */
  static registerPartial(name: string, content: string): void;

  /**
   * Регистрирует helper для Handlebars.
   * @param name - Название хелпера.
   * @param func - Функция-хелпер.
   */
  static registerHelper(name: string, func: Handlebars.HelperDelegate): void;

  /**
   * Компилирует шаблон Handlebars.
   * @param templateSource - Исходный код шаблона.
   * @returns Функция, которая принимает данные и возвращает сгенерированный HTML.
   */
  static compile(templateSource: string): Handlebars.TemplateDelegate;
}
