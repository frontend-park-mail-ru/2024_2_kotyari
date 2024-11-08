/**
 * Класс Route представляет маршрут в приложении.
 */
export class Route {
  /**
   * Путь маршрута.
   */
  public readonly route: string;

  /**
   * Функция-обработчик маршрута.
   */
  public readonly handler: () => void;

  /**
   * Флаг, указывающий, требуется ли вход пользователя для доступа к маршруту.
   */
  public readonly loginRequired: boolean;

  /**
   * Флаг, указывающий, требуется ли выход пользователя для доступа к маршруту.
   */
  public readonly logoutRequired: boolean;

  /**
   * Регулярное выражение для сопоставления URL с маршрутом.
   */
  public readonly pattern: RegExp;

  /**
   * Создаёт экземпляр маршрута.
   *
   * @param path - Путь маршрута.
   * @param handler - Функция-обработчик маршрута.
   * @param pattern - Регулярное выражение для сопоставления URL.
   * @param loginRequired - Флаг, указывающий, требуется ли вход пользователя (по умолчанию false).
   * @param logoutRequired - Флаг, указывающий, требуется ли выход пользователя (по умолчанию false).
   */
  constructor(
    path: string,
    handler: () => void,
    pattern: RegExp,
    loginRequired = false,
    logoutRequired = false
  ) {
    this.route = path;
    this.handler = handler;
    this.loginRequired = loginRequired;
    this.logoutRequired = logoutRequired;
    this.pattern = pattern;
  }

  /**
   * Проверяет, соответствует ли заданный URL шаблону маршрута.
   *
   * @param url - URL для проверки.
   * @returns Возвращает true, если URL соответствует шаблону, иначе false.
   */
  matches = (url: string): boolean => {
    return this.pattern.test(url);
  };

  /**
   * Извлекает параметры из URL на основе маршрута.
   *
   * @param url - URL для извлечения параметров.
   * @returns Объект с параметрами или null, если параметры не найдены.
   */
  getParams(url: string): { [key: string]: string } | null {
    const match = this.pattern.exec(url);
    if (match) {
      const params: { [key: string]: string } = {};
      const keys = this.route.match(/:(\w+)/g) || [];
      keys.forEach((key, index) => {
        params[key.substring(1)] = match[index + 1]; // index + 1, так как первый элемент - полное совпадение
      });
      return params;
    }
    return null;
  }
}
