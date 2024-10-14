import { Route } from './route.js';
import { RouteConfig } from './route-config.js';

const urlAttribute = 'href';

export class Router {
  constructor(routes, routeHandler, authService, historyManager) {
    this.routeHandler = routeHandler;
    this.authService = authService;
    this.historyManager = historyManager;

    this._routes = Object.values(routes).map(({ route, handler, isProtected }) => {
      return new Route(
        route,
        this.routeHandler[handler],
        isProtected);
    });
  }

  init = () => {
    // Обрабатываем изменения истории
    this.historyManager.onPopState((path) => {
      this.dispatch(path);
    });

    // Первичная загрузка страницы
    const initialPath = window.location.pathname;
    this.dispatch(initialPath);
  };

  // Метод обработки и диспетчеризации маршрута
  dispatch = (path) => {
    const route = this._routes.find((route) => route.matches(path));

    if (!route) {
      // Если маршрут не найден, показываем ошибку 404
      this.handleNotFound();
      return;
    }

    if (route.isProtected && !this.authService.isAuthenticated(path)) {
      // Защищённый маршрут, но пользователь не аутентифицирован
      this.navigate(RouteConfig.LOGIN.route);
      return;
    }

    // Вызываем обработчик маршрута
    route.handler();
  };

  // Метод для навигации через HistoryManager
  navigate = (path) => {
    this.historyManager.navigate(path);
    this.dispatch(path);
  };

  handleNotFound = () => {
    this.navigate(RouteConfig.ERROR.route);
  };

  /**
   * Обработчик нажатий на ссылки.
   * Перехватывает нажатие на ссылку, предотвращает стандартное поведение
   * и передает управление роутеру для обработки маршрута.
   *
   * @param {Event} event - Событие клика на ссылку.
   */
  handler = (event) => {
    let url = new URL(event.currentTarget.getAttribute(urlAttribute), window.location.origin);

    this.dispatch(url.pathname);

    event.preventDefault(); // Предотвращает стандартную навигацию браузера
  };
}
