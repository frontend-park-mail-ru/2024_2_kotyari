import { Route } from './route.js';
import { AUTH_URLS } from '../../scripts/components/auth-menu/api/config.js';
import { CLICK_CLASSES, urlAttribute } from './config.js';
import { isAuth } from './init';

export default class Router {
  public routes: Route[] = [];
  readonly root: string;
  readonly isAuth: () => boolean;
  private readonly containerId: string;
  private container: HTMLElement | null = null;

  constructor(root: string, isAuth: () => boolean, containerId: string) {
    this.root = root || '/';
    this.isAuth = isAuth;
    this.containerId = containerId;
    this.listen();
  }

  init(): void {
    window.addEventListener('popstate', this.onPopState.bind(this));
    this.container = document.getElementById(this.containerId) as HTMLElement;
    this.navigate(window.location.pathname, false); // false означает, что не нужно пушить состояние
  }

  addRoute(path: string, handler: () => void, pattern: RegExp, loginRequired = false, logoutRequired = false): void {
    const route = new Route(path, handler, pattern, loginRequired, logoutRequired);
    this.routes.push(route);
  }

  clearHistory = (): void => {
    history.replaceState(null, '', this.root);

    history.pushState(null, '', this.root);
  }

  back = (): void => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigate(this.root, false);
    }
  };

  navigate(path: string, pushState: boolean = true, replaceState: boolean = false): void {
    const url = this.getFormattedURL(path);

    if (replaceState) {
      history.replaceState({ page: url }, '', url);
    } else if (pushState) {
      history.pushState({ page: url }, '', url);
    }

    this.clearContainer();
    this.resolveRoute(url);
    this.addHandlers();
  }

  getRouteParams(url: string = window.location.pathname): { [key: string]: string } | null {
    const route = this.routes.find((route) => route.matches(url));
    return route ? route.getParams(url) : null;
  }

  private addHandlers = () => {
    const checkDOMAndAddListeners = () => {
      let routes = document.querySelectorAll(`[router="${CLICK_CLASSES.overrideable}"]`);

      routes.forEach((route) => {
        let href = route.getAttribute(urlAttribute);
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

  private resolveRoute(url: string): void {
    const route = this.routes.find((route) => route.matches(url));

    if (!route) {
      this.navigate('/error/404', false, true);
      history.replaceState(null, '', window.location.pathname);
      return;
    }

    if (route.loginRequired) {
      const flag = isAuth();

      if (!flag) {
        console.error('Пользователь не авторизован, перенаправление на /login');
        this.navigate(AUTH_URLS.LOGIN.route, true);
        return;
      }
    }

    if (route.logoutRequired) {
      const flag = isAuth();

      if (flag) {
        console.log('Пользователь вошел в аккаунт', );
        this.navigate('/', false);
        return;
      }
    }

    route.handler();
  }
  private listen(): void {
    window.addEventListener('popstate', this.onPopState.bind(this));
  }

  private getFormattedURL(path: string): string {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return new URL(path, window.location.origin).pathname;
  }

  private clearContainer(): void {
    if (this.container) {
      this.removeHandlers();
      this.container.innerHTML = '';
    }
  }

  private removeHandlers() {
    let routes = document.querySelectorAll(`[router="${CLICK_CLASSES.overrideable}"]`);

    routes.forEach((route) => {
      let href = route.getAttribute(urlAttribute);
      if (href) {
        route.removeEventListener('click', (event) => {
          event.preventDefault();
          if (href) this.navigate(href, true);
        });
      }
    });
  }

  private onPopState(event: PopStateEvent): void {
    const path = event.state ? event.state.page : window.location.pathname;
    this.clearContainer();
    this.resolveRoute(path);
  }
}
