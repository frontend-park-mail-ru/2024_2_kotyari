import { Route } from './route.js';
import { User } from '../types/types.js';
import { AUTH_URLS } from '../../scripts/components/auth-menu/api/config.js';

export default class Router {
  private routes: Route[] = [];
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
    this.navigate(window.location.pathname);
  }

  private onPopState(): void {
    this.navigate(window.location.pathname);
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

  private isFirstNavigation: boolean = true;
  navigate(path: string): void {
    const url = this.getFormattedURL(path);

    if (this.isFirstNavigation) {
      history.replaceState({ page: url }, '', url);
      this.isFirstNavigation = false;
    } else {
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

  private async resolveRoute(url: string): Promise<void> {
    const route = this.routes.find((route) => route.matches(url));

    if (!route) {
      console.error(`No route found for ${url}`);
      this.navigate('/error/404');
      return;
    }

    if (route.loginRequired) {
      const user = await this.isAuth(url);
      if (!user) {
        console.error('Пользователь не авторизован, перенаправление на /login');
        this.navigate(AUTH_URLS.LOGIN.route);
        return;
      }
    }

    if (route.logoutRequired) {
      const user = await this.isAuth(url);
      if (user.name !== '') {
        console.log('Пользователь вошел в аккаунт');

        history.back();
      }
    }

    this.clearContainer();
    route.handler();
  }

  private listen(): void {
    window.addEventListener('popstate', (event) => {
      const path = event.state ? event.state.page : window.location.pathname;
      this.resolveRoute(path)
        .then(() => {
          console.log('Navigation successful');
        })
        .catch((error) => {
          console.error('Navigation error', error);
        });
    });
  }

  private getFormattedURL(path: string): string {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return new URL(path, window.location.origin).pathname;
  }

  private clearContainer(): void {
    if (this.container) {
      console.log(this.container);
      this.container.innerHTML = '';
    }
  }
}