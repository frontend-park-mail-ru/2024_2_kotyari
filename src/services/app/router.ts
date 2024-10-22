import { Route } from './route.js';
import { User } from '../types/types.js';
import { AUTH_URLS } from '../../scripts/components/auth-menu/api/config.js';
import { CLICK_CLASSES, urlAttribute } from './config.js';

export default class Router {
  public routes: Route[] = [];
  readonly root: string;
  readonly isAuth: () => User;
  private readonly containerId: string;
  private container: HTMLElement | null = null;

  constructor(root: string, isAuth: () => User, containerId: string) {
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

  private onPopState(event: PopStateEvent): void {
    const path = event.state ? event.state.page : window.location.pathname;
    this.resolveRoute(path);
  }

  addRoute(path: string, handler: () => void, pattern: RegExp, loginRequired = false, logoutRequired = false): void {
    const route = new Route(path, handler, pattern, loginRequired, logoutRequired);
    this.routes.push(route);
  }

  navigate(path: string, pushState: boolean = true): void {
    const url = this.getFormattedURL(path);

    if (pushState) {
      history.pushState({ page: url }, '', url);
    }

    this.clearContainer();
    this.resolveRoute(url);
    this.addHandlers();
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
      this.navigate('/error/404', false);
      history.replaceState(null, '', window.location.pathname);
      return;
    }

    console.log(route);
    if (route.loginRequired) {
      const user = this.isAuth();
      if (user.name === '') {
        console.error('Пользователь не авторизован, перенаправление на /login');
        this.navigate(AUTH_URLS.LOGIN.route, true);
        return;
      }
    }

    if (route.logoutRequired) {
      const user = this.isAuth();
      console.log(`USER ${user.name}`);

      if (user.name !== '') {
        console.log('Пользователь вошел в аккаунт');
        history.back();
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
}
