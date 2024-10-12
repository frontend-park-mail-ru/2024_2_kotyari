import {buildBody, handleLogout} from "../../scripts/layouts/body.js";
import {buildCards} from "../../scripts/components/card/card.js";
import {errorPage} from "../../scripts/components/custom-messages/error/error.js";
import {soon} from "../../scripts/components/custom-messages/soon/soon.js";
import {buildAuthMenu} from "../../scripts/components/auth-menu/menu.js";
import {menuSignIn, menuSignUp} from "../../scripts/components/auth-menu/menu-config.js";
import {fetchAndRender, handleSignIn, handleSignUp} from "../client/auth/auth.js";
import {fetchUserDataAndSetCookie, getCookie} from "../cookie/cookie.js";
import {registrFunctions} from "../../scripts/constprograms/shablon/commands.js";
import {AddDropDown} from "../../scripts/layouts/header/header.js";
import {cart} from "../../scripts/components/cart/cart.js";

/**
 * Собираемые для переработки пути.
 * @enum {string}
 */
const ROUTES = {
    HOME: '/',
    CATALOG: '/catalog',
    RECORDS: '/records',
    CHANGESITY: '/changeSity',
    CART: '/cart',
    FAVORITE: '/favorite',
    PRODUCT: '/catalog/product/:id',
    ERROR: '/error/:err',
    LOGOUT: '/logout',
    LOGIN: '/login',
    SIGNUP: '/signup',
    PERSONALACCOUNT: '/account',
};

/**
 * Значение атрибуда router для элементов с кликабельными ссылками.
 * @enum {string}
 */
const CLICKCLASSESES = {
    stability: 'stability-active',
    overrideable: 'changed-active'
};

/**
 * Атрибут для получения URL из элемента.
 * @type {string}
 */
const urlAttribute = 'href';

/**
 * Регулярные выражения для маршрутов.
 * @type {Object}
 * @property {RegExp} PARAMS - Регулярное выражение для параметров в маршруте.
 * @property {function(string): RegExp} ANY_ROUTE - Функция для создания регулярного выражения для маршрута с параметрами.
 */

const REGEX = {
    PARAMS: /:\w+/g,
    ANY_ROUTE: (route) => new RegExp('^' + route.replace(REGEX.PARAMS, '(\\w+)') + '$')
};

/**
 * Обработчик нажатий на ссылки.
 * Перехватывает нажатие на ссылку, предотвращает стандартное поведение
 * и передает управление роутеру для обработки маршрута.
 *
 * @param {Event} event - Событие клика на ссылку.
 */
export const handler = event => {
    let url = new URL(event.currentTarget.getAttribute(urlAttribute), window.location.origin);

    Router.dispatch(url.pathname);

    event.preventDefault(); // Предотвращает стандартную навигацию браузера
}

/**
 * Удаляет все обработчики событий клика на ссылки с классом, указанным в `CLICKCLASSESES.overrideable`.
 *
 * Эта функция находит все ссылки в документе с классом, указанным в `CLICKCLASSESES.overrideable`,
 * и снимает с них обработчики событий клика.
 */
const removeAllHandlers = () => {
    let anchors = document.querySelectorAll(CLICKCLASSESES.overrideable);

    anchors.forEach((anchor) => {
        anchor.onclick = null; // Удаляем обработчики событий
    });
};

// Класс Router для маршрутизации на клиенте
export const Router = {
    routes: {
        [ROUTES.HOME]: 'catalog',
        [ROUTES.CATALOG]: 'catalog',
        [ROUTES.RECORDS]: 'records',
        [ROUTES.CHANGESITY]: 'changeSity',
        [ROUTES.CART]: 'cart',
        [ROUTES.FAVORITE]: 'favorites',
        [ROUTES.PRODUCT]: 'product',
        [ROUTES.LOGOUT]: 'logout',
        [ROUTES.SIGNUP]: 'signup',
        [ROUTES.LOGIN]: 'login',
        [ROUTES.ERROR]: 'error',
        [ROUTES.PERSONALACCOUNT]: 'personalAccount',
    },

    /**
     * Инициализация маршрутов.
     *
     * Эта функция создает массив маршрутов, который связывает паттерны URL с соответствующими методами обработчика.
     * Также настраивает обработчик события изменения состояния истории для навигации назад и вперед.
     */
    init: function () {
        this._routes = [];
        for (let route in this.routes) {
            let method = this.routes[route];
            this._routes.push({
                pattern: REGEX.ANY_ROUTE(route),
                callback: this[method]
            });
        }

        // Обрабатываем событие изменения состояния истории (навигация назад/вперед)
        window.onpopstate = (event) => {
            const path = event.state ? event.state.path : window.location.pathname;
            this.dispatch(path);  // Отправляем маршрут на обработку
        };
    },


    /**
     * Обработка маршрута по пути.
     * @param {string} path - Путь для маршрутизации.
     */
    dispatch: function (path) {
        let i = this._routes.length;
        while (i--) {
            let args = path.match(this._routes[i].pattern);
            if (args) {
                this._routes[i].callback.apply(this, args.slice(1));
                break; // Останавливаем цикл после первого совпадения
            }
        }
    },

    /**
     * Изменяет URL без перезагрузки страницы и вызывает обработчик маршрута.
     * @param {string} path - Новый путь.
     */
    navigate: function (path) {
        if (path !== window.location.pathname) {
            history.pushState(null, null, path); // Изменяем URL без перезагрузки

            this.dispatch(path); // Обрабатываем маршрут
        }
    },

    /**
     * Основная функция для рендеринга тела страницы.
     * @param {Function} mainPart - Функция, возвращающая Promise для загрузки основной части страницы.
     * @returns {Promise<void>} - Возвращает Promise, который разрешается после загрузки и рендеринга.
     */
    body: function (mainPart) {
        let anchors = document.querySelectorAll(`[router=${CLICKCLASSESES.stability}]`);
        for (let anchor of anchors) anchor.onclick = null;
        const main = document.getElementById('main')

        main.classList.add('invisible');

        removeAllHandlers(); // Удаляем все события перед рендером новой страницы

        return mainPart().then(() => {
            let anchors = document.querySelectorAll(`[router=${CLICKCLASSESES.overrideable}]`);
            for (let anchor of anchors) {
                anchor.onclick = handler;
            }

            main.classList.add('show');

            setTimeout(function () {
                main.classList.remove('invisible');
                anchors = document.querySelectorAll(`[router=${CLICKCLASSESES.stability}]`);
                for (let anchor of anchors) anchor.onclick = handler;
            }, 500); // Небольшая задержка для срабатывания transition

            main.classList.remove('show');
        });
    },

    /**
     * Страница каталога товаров.
     * @returns {Promise<void>} - Возвращает Promise после загрузки каталога.
     */
    catalog: function () {
        this.navigate(ROUTES.CATALOG);  // Изменяем URL и обрабатываем маршрут
        return this.body(() => buildCards());  // Загружаем карточки
    },

    /**
     * Страница с заказами.
     * @returns {Promise<Response>} - Возвращает Promise после загрузки страницы.
     */
    records: function () {
        return fetchAndRender(ROUTES.RECORDS, ROUTES.LOGIN, ROUTES.RECORDS, () => this.body(() => soon()));
    },

    /**
     * Страница корзины.
     * @returns {Promise<Response>} - Возвращает Promise после загрузки страницы.
     */
    cart: function () {
        //return fetchAndRender(ROUTES.CART, ROUTES.LOGIN, ROUTES.CART, () => this.body(() => cart()));
        return this.body(() => cart());
    },

    /**
     * Страница избранного.
     * @returns {Promise<Response>} - Возвращает Promise после загрузки страницы.
     */
    favorites: function () {
        return fetchAndRender(ROUTES.FAVORITE, ROUTES.LOGIN, ROUTES.FAVORITE,() => this.body(() => soon()));
    },

    /**
     * Страница изменения города.
     * @returns {Promise<void>} - Возвращает Promise после загрузки страницы.
     */
    changeSity: function () {
        this.navigate(ROUTES.CHANGESITY);  // Изменяем URL
        return this.body(() => soon());
    },

    /**
     * Страница дичного кабинета.
     * @returns {Promise<void>} - Возвращает Promise после загрузки страницы.
     */
    personalAccount: function () {
        return fetchAndRender(ROUTES.PERSONALACCOUNT, ROUTES.LOGIN, ROUTES.PERSONALACCOUNT,() => this.body(() => soon()));
    },


    /**
     * Страница конкретного продукта.
     * @param {string} id - Идентификатор продукта.
     * @returns {Promise<void>} - Возвращает Promise после загрузки страницы.
     */
    product: function (id) {
        this.navigate(ROUTES.PRODUCT.replace(':id', id));  // Изменяем URL с параметром
        return this.body(() => soon());
    },

    /**
     * Метод для обработки выхода пользователя.
     * Если пользователь не авторизован, перенаправляет на главную страницу.
     * Если авторизован, изменяет URL на страницу выхода и выполняет логику выхода.
     *
     * @returns {Promise<void>} - Возвращает Promise, который разрешается после выполнения выхода.
     */
    logout: function () {
        if (getCookie('user') === null) {
            Router.navigate(ROUTES.HOME);
            return Promise.resolve();
        }

        this.navigate(ROUTES.LOGOUT);

        return this.body(() => {
            return handleLogout();
        });
    },


    /**
     * Метод для обработки входа пользователя.
     * Если пользователь уже авторизован, перенаправляет на главную страницу.
     * Если пользователь не авторизован, изменяет URL на страницу входа и загружает форму для авторизации.
     *
     * @returns {Promise<void>} - Возвращает Promise, который разрешается после загрузки формы входа.
     */
    /**
     * Handles user login. If the user is already logged in, redirects to the home page.
     * Otherwise, navigates to the login page, builds the login form, and attaches the sign-in handler.
     *
     * @returns {Promise<void>} - A promise that resolves when the login process is complete.
     */
    login: function () {
        if (getCookie('user') !== null) {
            Router.navigate(ROUTES.HOME);
            return Promise.resolve();
        }

        this.navigate(ROUTES.LOGIN);

        return this.body(() => buildAuthMenu(menuSignIn))
            .then(() => {
                document.getElementById(menuSignIn.formId).addEventListener('submit', handleSignIn);
            })
            .catch(err => {
                console.error('Login error:', err);
            });
    },


    /**
     * Метод для обработки регистрации пользователя.
     * Если пользователь уже авторизован, перенаправляет на страницу каталога.
     * Если пользователь не авторизован, изменяет URL на страницу регистрации и загружает форму для регистрации.
     *
     * @returns {Promise<void>} - Возвращает Promise, который разрешается после загрузки формы регистрации.
     */
    signup: function () {
        if (getCookie('user') !== null) {
            Router.navigate(ROUTES.CATALOG);
            return Promise.resolve();
        }

        this.navigate(ROUTES.SIGNUP);

        return this.body(() => buildAuthMenu(menuSignUp))
            .then(() => {
                document.getElementById(menuSignUp.formId).addEventListener('submit', handleSignUp);
            })
            .catch(err => {
                console.error('Signup error:', err);
            });
    },

    /**
     * Метод для обработки ошибок и отображения страницы ошибки.
     *
     * @param {string} err - Сообщение об ошибке, которое будет передано для отображения на странице ошибки.
     * @returns {Promise<void>} - Возвращает Promise, который разрешается после загрузки страницы ошибки.
     */
    error: function (err) {
        return this.body(() => errorPage(err));
    },

};

/**
 * Обработчик клика на ссылку выхода пользователя.
 * Выполняет перенаправление на страницу выхода и предотвращает стандартное поведение ссылки.
 *
 * @param {Event} event - Событие клика на ссылку.
 */
export const handlerLogout = event => {
    let url = new URL('/logout', window.location.origin);

    Router.dispatch(url.pathname);

    event.preventDefault();
};

registrFunctions();

let user = getCookie('user');
if (user === null) {
    user = {
        city: 'Москва'
    }
}

/**
 * Функция для инициализации тела страницы и маршрутизатора.
 *
 * @param {Object} user - Объект пользователя, содержащий информацию о пользователе.
 * @returns {Promise<void>} - Возвращает Promise, который разрешается после завершения построения тела страницы.
 */
buildBody(user).then(() => {
    let anchors = document.querySelectorAll(`[router=${CLICKCLASSESES.stability}]`);
    for (let anchor of anchors) anchor.onclick = handler;

    AddDropDown();

    // Инициализируем роутер
    Router.init();

    if (Object.values(ROUTES).includes(window.location.pathname)) {
        Router.dispatch(window.location.pathname);
    } else {
        Router.dispatch('/error/404');
    }
});

