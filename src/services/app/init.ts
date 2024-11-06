import Router from './router';
import { backurl, rootId } from './config.ts';
import AuthAPI from '@/scripts/components/auth-menu/api/auth.ts';
import AuthView from '@/scripts/components/auth-menu/views/auth.ts';
import { LoginPresenter } from '@/scripts/components/auth-menu/presenters/login.ts';
import { SignUpPresenter } from '@/scripts/components/auth-menu/presenters/signup.ts';
import { AuthValidate } from '@/scripts/components/auth-menu/presenters/auth-validate.ts';
import { AUTH_URLS } from '@/scripts/components/auth-menu/api/config.ts';
import { CARD_URLS } from '@/scripts/components/card/api/config';
import CardAPI from '@/scripts/components/card/api/card';
import { CardView } from '@/scripts/components/card/view/card';
import { CardPresenter } from '@/scripts/components/card/presenter/card';
import { menuSignIn, menuSignUp } from '@/scripts/components/auth-menu/views/configs';
import { errorPage } from '@/scripts/components/custom-messages/error/error';
import { ProductPageBuilder } from '../../scripts/components/product-page/presenters/product-page';
import { singleOrder } from '../../scripts/components/single-order/single-order-config';
import { storageUser } from '../storage/user';
import { CartBuilder } from "@/scripts/components/cart/view/cart-builder";
import { OrderPlacementBuilder } from "@/scripts/components/order-placement/view/order-placement-builder";
import { buildOrderList } from '@/scripts/components/order-list/order-list';
import { orderList } from '@/scripts/components/order-list/order-list-config';
import Handlebars from 'handlebars';
import { CategoryView } from '../../scripts/components/category/view/category';
import { CategoryApi } from '../../scripts/components/category/api/category';
import { CategoryPresenter } from '../../scripts/components/category/presenter/category';
import { AccountPresenter } from '../../scripts/components/personal-account/presenters/account';
import { soon } from '../../scripts/components/custom-messages/soon/soon';
import { OrderListPresenter } from '../../scripts/components/order-list/presenters/order-list';
import { SingleOrderPresenter } from '../../scripts/components/single-order/presenter/single-order';

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



export const isAuth = (): boolean => {
  const user = storageUser.getUserData();

  return user.username !== '';
};

reg();

export const router = new Router('/login', isAuth, rootId);

const authAPI = new AuthAPI(backurl);
const SignUpView = new AuthView(menuSignUp);
export const LoginView = new AuthView(menuSignIn);

const signUpValidate = new AuthValidate(SignUpView);
const loginValidate = new AuthValidate(LoginView);

const loginPresenter = new LoginPresenter(LoginView, authAPI, LoginView, loginValidate, router);
const signUpPresenter = new SignUpPresenter(SignUpView, authAPI, SignUpView, signUpValidate, router);

const cardAPI = new CardAPI(backurl);
const cardView = new CardView();
const cardPresenter = new CardPresenter(cardAPI, cardView);

const cartBuilder = new CartBuilder();
const orderPlacementBuilder = new OrderPlacementBuilder();

const categoryAPI = new CategoryApi();
const categoryView = new CategoryView(cardView);
const categoryPresenter = new CategoryPresenter(categoryAPI, categoryView, cardView, router);

const accountPresenter = new AccountPresenter(backurl, rootId);

const orderListPresenter = new OrderListPresenter(rootId);

const singleOrderPresenter = new SingleOrderPresenter(rootId)

router.addRoute(AUTH_URLS.LOGIN.route, () => loginPresenter.init(), new RegExp('^/login$'), false, true);

router.addRoute(AUTH_URLS.SIGNUP.route, () => signUpPresenter.init(), new RegExp('^/signup$'), false, true);

router.addRoute('', () => cardPresenter.init(), new RegExp('^/$'), false, false);

router.addRoute(CARD_URLS.CATALOG.route, () => cardPresenter.init(), new RegExp('^/catalog$'), false, false);

router.addRoute('/error/404', () => errorPage('404'), new RegExp('^/error/404$'));

router.addRoute('/product/:id', () => {
  const productPageBuilder = new ProductPageBuilder();
  productPageBuilder.build();
}, new RegExp('^\\/product\\/(\\d+)$'), false, false);

router.addRoute('/account', () => accountPresenter.initialize(), new RegExp('^/account$'), true, false);

router.addRoute('/order_list', () => orderListPresenter.initialize(), new RegExp('^/order_list$'), true, false)

router.addRoute('/order/:id/:deliveryDate', () => {
  singleOrderPresenter.initialize();
}, new RegExp('^\\/order\\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\\/(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d+Z)$'), true, false)

router.addRoute('/soon', () => soon(), new RegExp('^/soon$'), false, false);

// router.addRoute('/order_list', () => buildOrderList(orderList), new RegExp('^/order_list$'), true, false);

router.addRoute('/cart', () => cartBuilder.buildCart(), new RegExp('^/cart$'), true, false);

router.addRoute('/order', () => orderPlacementBuilder.buildOrderPlacement(), new RegExp('^/order$'), true, false);
router.addRoute('/category', () => generateCategories(categoryConfig),new RegExp('^/category/[^/]+$'), false, false);
router.addRoute('/favorites', () => soon(), new RegExp('^/favorites$'), false, false);

router.addRoute('/logout', () => loginPresenter.logout(), new RegExp('^/logout$'), true, false);

router.addRoute(
  '/category',
  () => categoryPresenter.renderCategories(),
  new RegExp('^/category$'),
  false,
  false
);

// Route for displaying products in a specific category based on `link` parameter
router.addRoute(
  '/category/:link',
  () => categoryPresenter.loadCategoryProducts(),
  new RegExp('^/category/([^/]+)$'),
  false,
  false
);