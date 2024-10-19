import { Route } from './route.js';
import { User } from '../types/types.js';
import { AUTH_URLS } from '../../scripts/components/auth-menu/api/config.js';
import { CLICK_CLASSES, urlAttribute } from './config.js';


export default class Router {
  public routes: Route[] = [];
  readonly root: string;
  readonly isAuth: (path: string) => Promise<User>;
  private readonly containerId: string;
  private container: HTMLElement | null = null;

  constructor(root: string, isAuth: (path: string) => Promise<User>, containerId: string) {
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
    this.resolveRoute(path)
      .then(() => {

        console.log('State restored:', path);
      })
      .catch((error) => {
        console.error('State restoration error', error);
      });
  }

  addRoute(
    path: string,
    handler: () => void,
    pattern: RegExp,
    loginRequired = false,
    logoutRequired = false,
  ): void {
    const route = new Route(path, handler, pattern, loginRequired, logoutRequired);
    this.routes.push(route);
  }

  navigate(path: string, pushState: boolean = true): void {
    const url = this.getFormattedURL(path);

    if (pushState) {
      history.pushState({ page: url }, '', url);
    }

    this.resolveRoute(url)
      .then(() => {
        console.log('Navigation successful');
      })
      .catch((error) => {
        console.error('Navigation error', error);
      });
  }

  private addHandlers = () => {
    let routes = document.querySelectorAll(`[router="${CLICK_CLASSES.overrideable}"]`);

    routes.forEach(route => {
      let href = route.getAttribute(urlAttribute);
      if (href) {
        route.addEventListener('click', event => {
          event.preventDefault();
          if (href)
            this.navigate(href, true);
        });
      }
    });
  }

  private async resolveRoute(url: string): Promise<void> {
    const route = this.routes.find((route) => route.matches(url));

    if (!route) {
      this.navigate('/error/404', false);
      history.replaceState(null, '', window.location.pathname);
      return;
    }

    if (route.loginRequired) {
      const user = await this.isAuth(url);
      if (!user) {
        console.error('Пользователь не авторизован, перенаправление на /login');
        this.navigate(AUTH_URLS.LOGIN.route, true); // Переход на страницу логина с пушем состояния
        return;
      }
    }

    if (route.logoutRequired) {
      const user = await this.isAuth(url);
      console.log(user);
      if (user.name) {
        console.log('Пользователь вошел в аккаунт');
        history.back();
        return;
      }
    }

    this.clearContainer();

    route.handler();

    setTimeout(() => {
      this.addHandlers();
    }, 100);
  }

  private listen(): void {
    window.addEventListener('popstate', this.onPopState.bind(this)); // Слушаем popstate для кнопок назад/вперед
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

    routes.forEach(route => {
      let href = route.getAttribute(urlAttribute);
      if (href) {
        route.removeEventListener('click', event => {
          event.preventDefault();
          if (href)
            this.navigate(href, true);
        });
      }
    });
  }
}
