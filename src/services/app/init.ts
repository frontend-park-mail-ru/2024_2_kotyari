import Router from './router.ts';
import { backurl, rootId } from './config.ts';
import AuthAPI from '@/scripts/components/auth-menu/api/auth.ts';
import { User } from '../types/types.ts';
import AuthView from '@/scripts/components/auth-menu/views/auth.ts';
import { LoginPresenter } from '@/scripts/components/auth-menu/presenters/login.ts';
import { SignUpPresenter } from '@/scripts/components/auth-menu/presenters/signup.ts';
import { AuthValidate } from '@/scripts/components/auth-menu/presenters/auth-validate.ts';
import { AUTH_URLS } from '@/scripts/components/auth-menu/api/config.ts';
import { buildBody } from '@/scripts/layouts/body.ts';
import { CARD_URLS } from '@/scripts/components/card/api/config';
import CardAPI from '@/scripts/components/card/api/card';
import { CardView } from '@/scripts/components/card/view/card';
import { CardPresenter } from '@/scripts/components/card/presenter/card';
import { menuSignIn, menuSignUp } from '@/scripts/components/auth-menu/views/configs';
import { errorPage } from '@/scripts/components/custom-messages/error/error';
import { buildSingleOrderPage } from '../../scripts/components/single-order/single-order';
import { singleOrder } from '../../scripts/components/single-order/single-order-config';
import Handlebars from 'handlebars';
import { storageUser } from '../storage/user';
import {cart, cartBuilder} from '../../../src/scripts/components/cart/cart.js';
const reg = (): void => {
  /**
   * Хелпер 'eq' для сравнения двух значений.
   *
   * @param {*} a - Первое значение для сравнения.
   * @param {*} b - Второе значение для сравнения.
   * @returns {boolean} Возвращает true, если значения равны, иначе false.
   */
  // eslint-disable-next-line no-undef
  Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });
};

reg();

export const buildMain = (user: { name: string; city: string }): Promise<void> => {
  if (!user) {
    user = { name: '', city: 'Москва' };
  }

  const { name, city } = user;

  return buildBody({ rootId, name, city });
};

export const isAuth = (): User => {
  console.log(storageUser.getUserData(), '123s');

  return storageUser.getUserData();
};

export const router = new Router('/login', isAuth, rootId);

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
router.addRoute(AUTH_URLS.LOGIN.route, () => loginPresenter.init(), new RegExp('^/login$'), false, true);

router.addRoute(AUTH_URLS.SIGNUP.route, () => signUpPresenter.init(), new RegExp('^/signup$'), false, true);

router.addRoute('', () => cardPresenter.init(), new RegExp('^/$'), false, false);

router.addRoute(CARD_URLS.CATALOG.route, () => cardPresenter.init(), new RegExp('^/catalog$'), false, false);

router.addRoute('/error/404', () => errorPage('404'), new RegExp('^/error/404$'));

router.addRoute('/logout', () => loginPresenter.logout(), new RegExp('^/logout$'), true, false);

router.addRoute('/order/:id', () => buildSingleOrderPage(singleOrder), new RegExp('^/order/d+$'), true, false);

router.addRoute('/cart', () => cartBuilder(), new RegExp('^/cart$'), false, false);

router.addRoute('/order', () => cartBuilder(), new RegExp('^/order$'), false, false);
