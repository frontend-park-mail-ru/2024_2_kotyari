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
  public readonly handler: (params?: { [key: string]: string }) => void;

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
    const path = url.split('?')[0];

    return this.pattern.test(path);
  };

  /**
   * Извлекает параметры из URL на основе маршрута.
   *
   * @param url - URL для извлечения параметров.
   * @returns Объект с параметрами или null, если параметры не найдены.
   */
  getParams(url: string): { [key: string]: string } | undefined {
    const params: { [key: string]: string } = {};

    const pathMatch = this.pattern.exec(url.split('?')[0]);
    if (pathMatch) {
      const keys = this.route.match(/:(\w+)/g) || [];
      keys.forEach((key, index) => {
        params[key.substring(1)] = pathMatch[index + 1];
      });
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    queryParams.forEach((value, key) => {
      params[key] = value;
    });

    return Object.keys(params).length ? params : undefined;
  }
}
