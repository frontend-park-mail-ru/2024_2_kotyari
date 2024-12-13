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
import { CartBuilder } from '@/scripts/components/cart/view/cart-builder';
import { OrderPlacementBuilder } from '@/scripts/components/order-placement/view/order-placement-builder';
import { CategoryView } from '../../scripts/components/category/view/category';
import { CategoryApi } from '../../scripts/components/category/api/category';
import { CategoryPresenter } from '../../scripts/components/category/presenter/category';
import { AccountPresenter } from '../../scripts/components/personal-account/presenters/account';
import { soon } from '../../scripts/components/custom-messages/soon/soon';
import { OrderListPresenter } from '../../scripts/components/order-list/presenters/order-list';
import { SingleOrderPresenter } from '../../scripts/components/single-order/presenter/single-order';
import { HandlebarsRegEqual } from '../../scripts/utils/handlebars-reg-equal';
import { isAuth } from '../storage/user';
import { PERSONAL_ACCOUNT } from '../../scripts/components/personal-account/configs/config';
import { SearcherApi } from '../../scripts/components/searcher/api/search';
import { SearcherView } from '../../scripts/components/searcher/view/search';
import { Searcher } from '../../scripts/components/searcher/presenter/search';
import {Recommendations} from "../../scripts/components/recomendations/presenter/recommendations";
import {RecommendationsApi} from "../../scripts/components/recomendations/api/recommendations";
import {RecommendationsView} from "../../scripts/components/recomendations/view/recomendations";

HandlebarsRegEqual();

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

const productPageBuilder = new ProductPageBuilder();
const cartBuilder = new CartBuilder();

const orderPlacementBuilder = new OrderPlacementBuilder();

const categoryAPI = new CategoryApi();
const categoryView = new CategoryView(cardView);
const categoryPresenter = new CategoryPresenter(categoryAPI, categoryView, cardView, router);

const accountPresenter = new AccountPresenter(backurl, rootId);

const orderListPresenter = new OrderListPresenter(rootId);

const singleOrderPresenter = new SingleOrderPresenter(rootId)

const searcherApi = new SearcherApi();
const searcherView = new SearcherView(cardView);
export const searcher = new Searcher(searcherApi, searcherView);

const recommendationsApi = new RecommendationsApi();
const recommendationsView = new RecommendationsView(cardView);
export const recommendations = new Recommendations(recommendationsApi, recommendationsView);

router.addRoute(
  '/search/catalog',
  () => {
    const query = router.getQueryParam('q');
    const sort = router.getQueryParam('sort') || 'price'; // Параметр сортировки по умолчанию
    const order = router.getQueryParam('order') || 'asc'; // Порядок сортировки по умолчанию

    if (query) {
      searcher.searchProducts(query, sort, order); // Передаем параметры в searchProducts
    } else {
      router.navigate('/'); // Перенаправляем на главную, если нет запроса
    }
  },
  new RegExp('^/search/catalog(\\?.*(&sort=.*&order=.*)?)?$'), // Обновляем RegExp для новых параметров
  false,
  false,
);

router.addRoute(
    '/recommendations/product',
    () => {
        const id = router.getQueryParam('id');
        const name = router.getQueryParam('title');
        const sort = router.getQueryParam('sort') || 'price'; // Параметр сортировки по умолчанию
        const order = router.getQueryParam('order') || 'asc'; // Порядок сортировки по умолчанию

        if (id) {
            recommendations.recommendationsProducts(id, name, sort, order); // Передаем параметры в searchProducts
        } else {
            router.navigate('/'); // Перенаправляем на главную, если нет запроса
        }
    },
    new RegExp('^/recommendations/product(\\?.*(&sort=.*&order=.*)?)?$'), // Обновляем RegExp для новых параметров
    false,
    false,
);

router.addRoute(AUTH_URLS.LOGIN.route,
  () => loginPresenter.init(),
  AUTH_URLS.LOGIN.REG_EXP,
  false, true);

router.addRoute(AUTH_URLS.SIGNUP.route,
  () => signUpPresenter.init(),
  AUTH_URLS.SIGNUP.REG_EXP,
  false, true);

router.addRoute(CARD_URLS.HOME.route,
  () => cardPresenter.init(),
  CARD_URLS.HOME.REG_EXP,
  false, false);

router.addRoute(CARD_URLS.CATALOG.route,
  () => cardPresenter.init(),
  CARD_URLS.CATALOG.REG_EXP,
  false, false);

router.addRoute('/error/404',
  () => errorPage('404'),
  new RegExp('^/error/404$'),
  false, false);

router.addRoute(
  '/product/:id:hash',
  (params) => {
    let hash = window.location.hash; // Извлекаем текущий хэш
    //console.log('Параметры маршрута:', params, 'Хэш:', hash);
    if (hash) hash = hash.replace(/^#/, '');
    productPageBuilder.build({ hash }).catch(e => {/*console.error(e)*/});
  },
  new RegExp('^\\/product\\/(\\d+)(#.*)?$'), // Регулярное выражение с поддержкой хэша
  false,
  false
);

router.addRoute(PERSONAL_ACCOUNT.MAIN.ROUTE,
  () => accountPresenter.initialize(),
  PERSONAL_ACCOUNT.MAIN.REG_EXP,
  true, false);

router.addRoute('/order_list',
  () => orderListPresenter.initialize(),
  new RegExp('^/order_list$'),
  true, false)

router.addRoute('/order/:id',
  () => singleOrderPresenter.initialize(),
  new RegExp('^\\/order\\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$'),
  true, false)

router.addRoute('/soon',
  () => soon(),
  new RegExp('^/soon$'),
  false, false);

router.addRoute('/cart',
  () => cartBuilder.buildCart(),
  new RegExp('^/cart$'),
  true, false);

router.addRoute('/order',
  () => orderPlacementBuilder.buildOrderPlacement(),
  new RegExp('^/order$'),
  true, false);

router.addRoute('/favorites',
  () => soon(),
  new RegExp('^/favorites$'),
  false, false);

router.addRoute('/logout', () => loginPresenter.logout(),
  new RegExp('^/logout$'),
  true, false);

router.addRoute('/category',
  () => categoryPresenter.renderCategories(),
  new RegExp('^/category$'),
  false, false);

router.addRoute(
  '/category/:link',
  () => {
    const routeParams = router.getRouteParams();
    if (!routeParams) {
      router.navigate('category');
      return;
    }

    const link = routeParams['link'];

    // Извлекаем параметры сортировки из URL (если их нет, оставляем null)
    const sort = router.getQueryParam('sort') || null;
    const order = router.getQueryParam('order') || null;

    // Загружаем продукты
    categoryPresenter.loadCategoryProducts(link, sort, order);
  },
  new RegExp('^/category/([^/]+)$'),
  false,
  false
);