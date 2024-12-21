import { Route } from './route.js';
import { AUTH_URLS } from '../../scripts/components/auth-menu/api/config.js';
import { CLICK_CLASSES, urlAttribute } from './config.js';
import { isAuth } from '../storage/user';

export default class Router {
  /**
   * Массив доступных маршрутов.
   */
  public routes: Route[] = [];

  /**
   * Корневой путь приложения.
   */
  readonly root: string;

  /**
   * Функция для проверки аутентификации пользователя.
   */
  readonly isAuth: () => boolean;

  /**
   * Идентификатор контейнера для отображения содержимого маршрута.
   */
  private readonly containerId: string;

  /**
   * Ссылка на HTML-элемент контейнера.
   */
  private container: HTMLElement | null = null;

  /**
   * Создаёт экземпляр роутера.
   *
   * @param root - Корневой путь приложения.
   * @param isAuth - Функция для проверки аутентификации пользователя.
   * @param containerId - Идентификатор контейнера для отображения содержимого маршрута.
   */
  constructor(root: string, isAuth: () => boolean, containerId: string) {
    this.root = root || '/';
    this.isAuth = isAuth;
    this.containerId = containerId;
    this.listen();
  }

  /**
   * Инициализирует роутер, устанавливая обработчики событий и выполняя начальную навигацию.
   */
  init(): void {
    window.addEventListener('popstate', this.onPopState.bind(this));
    this.container = document.getElementById(this.containerId) as HTMLElement;
    this.navigate(window.location.pathname, false); // false означает, что не нужно пушить состояние
  }

  /**
   * Добавляет новый маршрут в роутер.
   *
   * @param path - Путь маршрута.
   * @param handler - Функция-обработчик маршрута.
   * @param pattern - Регулярное выражение для сопоставления URL.
   * @param loginRequired - Флаг, указывающий, требуется ли вход пользователя (по умолчанию false).
   * @param logoutRequired - Флаг, указывающий, требуется ли выход пользователя (по умолчанию false).
   */
  addRoute(
    path: string,
    handler: (params?: { [key: string]: string }) => void,
    pattern: RegExp,
    loginRequired = false,
    logoutRequired = false
  ): void {
    const route = new Route(path, handler, pattern, loginRequired, logoutRequired);
    this.routes.push(route);
  }

  /**
   * Очищает историю браузера, заменяя текущее состояние на корневой путь.
   */
  clearHistory = (): void => {
    history.replaceState(null, '', this.root);
    history.pushState(null, '', this.root);
  };

  /**
   * Возвращается на предыдущую страницу в истории браузера или на корневой путь, если истории нет.
   */
  back = (): void => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigate(this.root, false);
    }
  };

  /**
   * Навигирует к указанному пути.
   *
   * @param path - Путь для навигации.
   * @param pushState - Флаг, указывающий, нужно ли добавлять состояние в историю (по умолчанию true).
   * @param replaceState - Флаг, указывающий, нужно ли заменить текущее состояние (по умолчанию false).
   */
  navigate(path: string, pushState: boolean = true, replaceState: boolean = false): void {
    const [url, hash] = path.split('#');
    const formattedUrl = this.getFormattedURL(url) + (hash ? `#${hash}` : '');

    if (replaceState) {
      history.replaceState({ page: formattedUrl }, '', formattedUrl);
    } else if (pushState) {
      history.pushState({ page: formattedUrl }, '', formattedUrl);
    }

    this.clearContainer();
    this.resolveRoute(url);
    this.addHandlers();
  }

  /**
   * Получает параметры маршрута из текущего URL.
   *
   * @param url - URL для извлечения параметров (по умолчанию текущий путь).
   * @returns Объект с параметрами или null, если параметры не найдены.
   */
  getRouteParams(url: string = window.location.pathname): { [key: string]: string } | null {
    const route = this.routes.find((route) => route.matches(url));

    const params = route ? route.getParams(url) : null;
    return params !== undefined ? params : null;
  }

  getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /**
   * Добавляет обработчики событий для элементов с атрибутом router.
   */
  private addHandlers = () => {
    const checkDOMAndAddListeners = () => {
      const routes = document.querySelectorAll(`[router="${CLICK_CLASSES.overrideable}"]`);

      routes.forEach((route) => {
        const href = route.getAttribute(urlAttribute);
        if (href && !route.hasAttribute('data-listener-added')) {
          route.addEventListener('click', (event) => {
            event.preventDefault();
            if (href) {
              this.navigate(href, true);
            }
          });

          route.setAttribute('data-listener-added', 'true');
        }
      });
    };

    setInterval(checkDOMAndAddListeners, 50);
  };

  /**
   * Разрешает маршрут, выполняя соответствующий обработчик или перенаправляя при необходимости.
   *
   * @param url - URL маршрута.
   */
  private resolveRoute(url: string): void {
    const route = this.routes.find((route) => route.matches(url));

    if (!route) {
      this.navigate('/error/404', false, true);
      history.replaceState(null, '', window.location.pathname);
      return;
    }

    if (route.loginRequired && !isAuth()) {
      this.navigate(AUTH_URLS.LOGIN.route, true);
      return;
    }

    if (route.logoutRequired && isAuth()) {
      this.navigate('/', false);
      return;
    }

    const params = route.getParams(url);
    route.handler(params);
  }

  /**
   * Устанавливает слушателя событий для изменения истории браузера.
   */
  private listen(): void {
    window.addEventListener('popstate', this.onPopState.bind(this));
  }

  /**
   * Форматирует путь, гарантируя, что он начинается с '/'.
   *
   * @param path - Исходный путь.
   * @returns Отформатированный путь.
   */
  private getFormattedURL(path: string): string {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return path;
  }

  /**
   * Очищает содержимое контейнера и удаляет обработчики событий.
   */
  private clearContainer(): void {
    if (this.container) {
      this.removeHandlers();
      this.container.innerHTML = '';
    }
  }

  /**
   * Удаляет обработчики событий с элементов маршрутов.
   */
  private removeHandlers() {
    const routes = document.querySelectorAll(`[router="${CLICK_CLASSES.overrideable}"]`);

    routes.forEach((route) => {
      const href = route.getAttribute(urlAttribute);
      if (href) {
        route.removeEventListener('click', (event) => {
          event.preventDefault();
          if (href) this.navigate(href, true);
        });
      }
    });
  }

  /**
   * Обработчик события popstate, вызываемый при изменении истории браузера.
   *
   * @param event - Событие PopStateEvent.
   */
  private onPopState(event: PopStateEvent): void {
    const path = event.state ? event.state.page : window.location.pathname;
    this.clearContainer();
    this.resolveRoute(path);
  }
}
