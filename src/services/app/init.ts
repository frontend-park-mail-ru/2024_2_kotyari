import Router from './router.js';
import { backurl } from '../configs/config.js';
import AuthAPI from '../../scripts/components/auth-menu/api/auth.js';
import { User } from '../types/types.js';
import AuthView from '../../scripts/components/auth-menu/views/auth.js';
import { LoginPresenter } from '../../scripts/components/auth-menu/presenters/login.js';
import { SignUpPresenter } from '../../scripts/components/auth-menu/presenters/signup.js';
import { AuthValidate } from '../../scripts/components/auth-menu/presenters/auth-validate.js';
import { AUTH_URLS } from '../../scripts/components/auth-menu/api/config.js';
import { registerFunctions } from '../../scripts/constprograms/templatizer/commands.js';
import { buildBody } from '../../scripts/layouts/new-body.js';
import { CARD_URLS } from '../../scripts/components/card/api/config.js';
import CardAPI from '../../scripts/components/card/api/card.js';
import { CardView } from '../../scripts/components/card/view/card.js';
import { CardPresenter } from '../../scripts/components/card/presenter/card.js';
import { menuSignIn, menuSignUp } from '../../scripts/components/auth-menu/views/configs.js';
import { errorPage } from '../../scripts/components/custom-messages/error/error.js';

export const buildMain = (user: { name: string; city: string }): Promise<void> => {
  if (!user) {
    user = { name: '', city: 'Москва' };
  }

  const { name, city } = user;

  return buildBody({ name, city });
};

registerFunctions();

export const isAuth = (): Promise<User> => {
  return fetch(backurl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(res => {
      console.log(res.status);

      if (res.ok) {
        return res.json()
          .then((data) => {
            console.log(data);
              return { name: data.username, city: 'Москва' };
            },
          );
      }

      if (res.status === 401) {
        return { name: '', city: 'Москва' };
      }

      throw Error(`Внутренняя ошибка сервера ${res.status}`);
    })
    .catch(err => {
      console.error(err);
      return { name: '', city: 'Москва' };
    });
};



export const router = new Router('/login', isAuth, 'main');

const authAPI = new AuthAPI(backurl);
const SignUpView = new AuthView(menuSignUp);
export const LoginView = new AuthView(menuSignIn);

const signUpValidate = new AuthValidate(SignUpView);
const loginValidate = new AuthValidate(LoginView);

const loginPresenter = new LoginPresenter(LoginView, authAPI, LoginView, loginValidate);
const signUpPresenter = new SignUpPresenter(SignUpView, authAPI, SignUpView, signUpValidate);

const cardAPI = new CardAPI(backurl);
const cardView = new CardView();
const cardPresenter = new CardPresenter(cardAPI, cardView);

// Определение маршрутов
router.addRoute(
  AUTH_URLS.LOGIN.route,
  () => loginPresenter.init(),
  new RegExp('^/login$'),
  false,
  true,
);

router.addRoute(
  AUTH_URLS.SIGNUP.route,
  () => signUpPresenter.init(),
  new RegExp('^/signup$'),
  false,
  true,
);

router.addRoute(
  '',
  () => cardPresenter.init(),
  new RegExp('^\/$'),
  false,
  false,
);

router.addRoute(
  CARD_URLS.CATALOG.route,
  () => cardPresenter.init(),
  new RegExp('^/catalog$'),
  false,
  false,
);

router.addRoute(
  '/error/404',
  () => errorPage('404'),
  new RegExp('^/error/404$'),
);


router.addRoute(
  '/logout',
  () => loginPresenter.logout(),
  new RegExp('^/logout$'),
  true,
  false,
)