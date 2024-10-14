import { buildCards } from '../../scripts/components/card/card.js';
import { soon } from '../../scripts/components/custom-messages/soon/soon.js';
import { buildAuthMenu } from '../../scripts/components/auth-menu/menu.js';
import { menuSignIn, menuSignUp } from '../../scripts/components/auth-menu/menu-config.js';
import { buildOrderList } from '../../scripts/components/order-list/order-list.js';
import { orderList } from '../../scripts/components/order-list/order-list-config.js';
import { errorPage } from '../../scripts/components/custom-messages/error/error.js';

export class RouteHandler {
  constructor(renderer, authService) {
    this.renderer = renderer; // Рендерер передаётся в конструктор
    this.authService = authService;
  }

  catalog = () => {
    return this.renderer
      .renderWithHandlers(() => buildCards()); // Отрисовка каталога
  };

  order_list = () => {
    return this.renderer
      .renderWithHandlers(() => buildOrderList(orderList)); // Заглушка
  };

  cart = () => {
    return this.renderer
      .renderWithHandlers(() => soon()); // Заглушка
  };

  favorites = () => {
    return this.renderer
      .renderWithHandlers(() => soon()); // Заглушка
  };

  changeCity = () => {
    return this.renderer
      .renderWithHandlers(() =>soon()); // Заглушка
  };

  product = (id) => {
    return this.renderer
      .renderWithHandlers( () =>soon()); // Страница товара
  };

  signup = () => {
    return this.renderer
      .renderWithHandlers( () =>buildAuthMenu(menuSignUp, this.authService.signup()))
  };

  login = () => {
    return this.renderer
      .renderWithHandlers(() =>buildAuthMenu(menuSignIn, this.authService.login()))
  };

  account = () => {
    return this.renderer
      .renderWithHandlers(() =>soon()); // Личный кабинет
  };

  logout = () => {
    return this.authService.logout() // Выход пользователя
  };

  error = () => {
    return this.renderer
      .renderWithHandlers(() => errorPage('404')); // Страница ошибки
  };
}
