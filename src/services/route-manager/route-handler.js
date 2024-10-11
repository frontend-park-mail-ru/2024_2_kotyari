import { buildCards } from '../../scripts/components/card/card.js';
import { soon } from '../../scripts/components/custom-messages/soon/soon.js';
import { buildAuthMenu } from '../../scripts/components/auth-menu/menu.js';
import { menuSignIn, menuSignUp } from '../../scripts/components/auth-menu/menu-config.js';
import { handleSignIn, handleSignUp } from '../client/auth/auth.js';
import { handleLogout } from '../../scripts/layouts/body.js';

export class RouteHandler {
  constructor(renderer) {
    this.renderer = renderer; // Рендерер передаётся в конструктор
  }

  catalog = () => {
    return this.renderer.renderWithHandlers(() => buildCards()); // Вызываем buildCards для каталога
  };

  records = () => {
    return this.renderer.renderWithHandlers(() => soon()); // Заглушка "в разработке"
  };

  basket = () => {
    return this.renderer.renderWithHandlers(() => soon()); // Заглушка для корзины
  };

  favorites = () => {
    return this.renderer.renderWithHandlers(() => soon()); // Заглушка для избранного
  };

  changeCity = () => {
    return this.renderer.renderWithHandlers(() => soon()); // Изменение города
  };

  product = (id) => {
    return this.renderer.renderWithHandlers(() => soon()); // Страница товара
  };

  signup = () => {
    return this.renderer
      .renderWithHandlers(() => buildAuthMenu(menuSignUp))
      .then(() => {
        document.getElementById(menuSignUp.formId).addEventListener('submit', handleSignUp);
      })
      .catch((err) => {
        console.error('Signup error:', err);
      });
  };

  login = () => {
    return this.renderer
      .renderWithHandlers(() => buildAuthMenu(menuSignIn))
      .then(() => {
        document.getElementById(menuSignIn.formId).addEventListener('submit', handleSignIn);
      })
      .catch((err) => {
        console.error('Login error:', err);
      });
  };

  personalAccount = () => {
    return this.renderer.renderWithHandlers(() => soon()); // Личный кабинет
  };

  logout = () => {
    return this.renderer.renderWithHandlers(() => handleLogout()); // Выход пользователя
  };

  error = (message) => {
    return this.renderer.renderWithHandlers(() => `<h1>Error: ${message}</h1>`); // Страница ошибки
  };
}
