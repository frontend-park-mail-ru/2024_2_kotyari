import {buildBody, handleLogout} from "../../scripts/layouts/body.js";
import {buildCards} from "../../scripts/components/card/card.js";
import {errorPage} from "../../scripts/components/custom-messages/error/error.js";
import {soon} from "../../scripts/components/custom-messages/soon/soon.js";
import {buildAuthMenu} from "../../scripts/components/auth-menu/menu.js";
import {menuSignIn, menuSignUp} from "../../scripts/components/auth-menu/menu-config.js";
import {handleSignIn, handleSignUp} from "../client/auth/auth.js";
import {getCookie} from "../cookie/cookie.js";
import {registrFunctions} from "../../scripts/constprograms/shablon/commands.js";

/**
 * Собираемые для переработки пути.
 * @enum {string}
 */
const ROUTES = {
    HOME: '/',
    CATALOG: '/catalog',
    RECORDS: '/records',
    CHANGESITY: '/changeSity',
    BASKET: '/basket',
    FAVORITE: '/favorite',
    PRODUCT: '/catalog/product/:id',
    ERROR: '/error/:err',
    LOGOUT: '/logout',
    LOGIN: '/login',
    SIGNUP: '/signup',
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

// обработчик нажатий на ссылки
export const handler = event =>  {
    let url = new URL(event.currentTarget.getAttribute(urlAttribute), window.location.origin);

    Router.dispatch(url.pathname);

    event.preventDefault();
}

// Функция для удаления всех событий
const removeAllHandlers = () => {
    let anchors = document.querySelectorAll(CLICKCLASSESES.overrideable);

    anchors.forEach((anchor) => {
        anchor.onclick = null;
    })
};

// Класс Router для маршрутизации на клиенте
export const Router = {
    routes: {
        [ROUTES.HOME]: 'catalog',
        [ROUTES.CATALOG]: 'catalog',
        [ROUTES.RECORDS]: 'records',
        [ROUTES.CHANGESITY]: 'changeSity',
        [ROUTES.BASKET]: 'basket',
        [ROUTES.FAVORITE]: 'favorites',
        [ROUTES.PRODUCT]: 'product',
        [ROUTES.LOGOUT]: 'logout',
        [ROUTES.SIGNUP]: 'signup',
        [ROUTES.LOGIN]: 'login',
        [ROUTES.ERROR]: 'error'
    },

    /**
     * Инициализация маршрутов.
     *
     * Эта функция создает массив маршрутов, который связывает паттерны URL с соответствующими методами обработчика.
     * Также настраивает обработчик события изменения состояния истории для навигации назад и вперед.
     */
    init: function() {
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
    dispatch: function(path) {
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
    navigate: function(path) {
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
    body: function(mainPart) {
        const main = document.getElementById('main')

        main.classList.add('invisible');

        removeAllHandlers(); // Удаляем все события перед рендером новой страницы

        return mainPart().then(() => {
            let anchors = document.querySelectorAll(`[router=${CLICKCLASSESES.overrideable}]`);
            for (let anchor of anchors) {
                anchor.onclick = handler;
            }

            main.classList.add('show');

            setTimeout(function() {
                main.classList.remove('invisible');
            }, 200); // Небольшая задержка для срабатывания transition

            main.classList.remove('show');
        });
    },

    /**
     * Страница каталога товаров.
     * @returns {Promise<void>} - Возвращает Promise после загрузки каталога.
     */
    catalog: function() {
        this.navigate(ROUTES.CATALOG);  // Изменяем URL и обрабатываем маршрут
        return this.body(() => buildCards());  // Загружаем карточки
    },

    /**
     * Страница с заказами.
     * @returns {Promise<void>} - Возвращает Promise после загрузки страницы.
     */
    records: function() {
        this.navigate(ROUTES.RECORDS);  // Изменяем URL
        return this.body(() => soon());
    },

    /**
     * Страница корзины.
     * @returns {Promise<void>} - Возвращает Promise после загрузки страницы.
     */
    basket: function() {
        this.navigate(ROUTES.BASKET);  // Изменяем URL
        return this.body(() => soon());
    },

    /**
     * Страница избранного.
     * @returns {Promise<void>} - Возвращает Promise после загрузки страницы.
     */
    favorites: function() {
        this.navigate(ROUTES.FAVORITE);  // Изменяем URL
        return this.body(() => soon());
    },

    /**
     * Страница изменения города.
     * @returns {Promise<void>} - Возвращает Promise после загрузки страницы.
     */
    changeSity: function() {
        this.navigate(ROUTES.CHANGESITY);  // Изменяем URL
        return this.body(() => soon());
    },

    /**
     * Страница конкретного продукта.
     * @param {string} id - Идентификатор продукта.
     * @returns {Promise<void>} - Возвращает Promise после загрузки страницы.
     */
    product: function(id) {
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
            Router.navigate('/');
            return;  // Прерываем выполнение, если пользователь не авторизован
        }
        this.navigate(ROUTES.LOGOUT);  // Изменяем URL на страницу выхода
        return this.body(() => handleLogout());  // Выполняем выход пользователя
    },


    /**
     * Метод для обработки входа пользователя.
     * Если пользователь уже авторизован, перенаправляет на главную страницу.
     * Если пользователь не авторизован, изменяет URL на страницу входа и загружает форму для авторизации.
     *
     * @returns {Promise<void>} - Возвращает Promise, который разрешается после загрузки формы входа.
     */
    login: function () {
        if (getCookie('user') !== null) {
            Router.navigate('/');  // Перенаправляем на главную страницу
            return;  // Прерываем выполнение, если пользователь уже авторизован
        }
        this.navigate(ROUTES.LOGIN);  // Изменяем URL на страницу входа

        return this.body(() => buildAuthMenu(menuSignIn))
            .then(() => {
                document.getElementById(menuSignIn.formId).addEventListener('submit', handleSignIn);
            })
            .catch(err => {
                console.log(err);
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
            Router.navigate('/catalog'); // Перенаправляем на страницу каталога
            return; // Прерываем выполнение, если пользователь уже авторизован
        }
        this.navigate(ROUTES.SIGNUP); // Изменяем URL на страницу регистрации

        return this.body(() => this.body(() => buildAuthMenu(menuSignUp)))
            .then(() => {
                document.getElementById(menuSignUp.formId).addEventListener('submit', handleSignUp);
            })
            .catch(
                err => {
                    console.log(err);
                }
            );
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
export const handlerLogout = event =>  {
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

    // Инициализируем роутер
    Router.init();

    if (Object.values(ROUTES).includes(window.location.pathname)) {
        Router.dispatch(window.location.pathname);
    } else {
        Router.dispatch('/error/404');
    }
});

