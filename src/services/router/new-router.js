import {Route} from '../route-manager/route.js';

export class Router {
  constructor(routes, routeHandler, renderer, authService, historyManager) {
    this.routes = routes; // Список маршрутов
    this.routeHandler = routeHandler; // Обработчики маршрутов
    this.renderer = renderer; // Класс рендеринга
    this.authService = authService; // Сервис авторизации
    this.routes = [];
    this.historyManager = historyManager; // Инициализация HistoryManager
  }

  init = () => {
    // Инициализируем маршруты
    this._routes = Object.values(this.routes).map(({ route, handler, isProtected }) => {
      return new Route(route, this.routeHandler[handler].bind(this.routeHandler), isProtected);
    });

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

    if (route) {
      if (route.isProtected && !this.authService.isAuthenticated()) {
        // Защищённый маршрут, но пользователь не аутентифицирован
        this.renderer.render(this.routeHandler.error('403 Forbidden'));
      } else {
        // Вызываем обработчик маршрута
        const content = route.handler();
        this.renderer.render(content);
      }
    } else {
      // Если маршрут не найден, показываем ошибку 404
      this.renderer.render(this.routeHandler.error('404 Not Found'));
    }
  };

  // Метод для навигации через HistoryManager
  navigate = (path) => {
    this.historyManager.navigate(path);
    this.dispatch(path);
  };

  handleNotFound() {
    console.error('404 Not Found');
  }
}
