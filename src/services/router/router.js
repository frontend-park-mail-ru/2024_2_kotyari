import {buildBody} from "../../scripts/layouts/body.js";
import {buildCards} from "../../scripts/components/card/card.js";
import {errorPage} from "../../scripts/components/custom-messages/error/error.js";
import {soon} from "../../scripts/components/custom-messages/soon/soon.js";

/**
 * @typedef {Object} User
 * @property {string} name - Имя пользователя.
 * @property {string} city - Город пользователя.
 */

/**
 * Текущий пользователь.
 * @type {User}
 */
const user = {
    name: 'Василий',
    city: 'Москва'
};

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
 * @param {Event} event - Событие клика.
 */
const handler = event => {
    let url = new URL(event.currentTarget.getAttribute(urlAttribute), window.location.origin);
    Router.dispatch(url.pathname);
    event.preventDefault();
};

/**
 * Удаляет все обработчики событий с кликабельных ссылок.
 */
const removeAllHandlers = () => {
    let anchors = document.querySelectorAll(`[router=${CLICKCLASSESES.overrideable}]`);
    for (let anchor of anchors) {
        anchor.onclick = null;  // Удаляем обработчик
    }
};

/**
 * Класс для маршрутизации на клиентской стороне.
 * @namespace Router
 */
const Router = {
    /**
     * Карта маршрутов и соответствующих обработчиков.
     * @type {Object}
     */
    routes: {
        [ROUTES.HOME]: 'catalog',
        [ROUTES.CATALOG]: 'catalog',
        [ROUTES.RECORDS]: 'records',
        [ROUTES.CHANGESITY]: 'changeSity',
        [ROUTES.BASKET]: 'basket',
        [ROUTES.FAVORITE]: 'favorites',
        [ROUTES.PRODUCT]: 'product',
        [ROUTES.ERROR]: 'error'
    },

    /**
     * Инициализация маршрутов.
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
            }, 100); // Небольшая задержка для срабатывания transition

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

    error: function (err) {
        return this.body(() => errorPage(err));
    }
};

// Инициализация страницы после загрузки тела
buildBody(user).then(() => {
    let anchors = document.querySelectorAll(`[router=${CLICKCLASSESES.stability}]`);
    for (let anchor of anchors) anchor.onclick = handler;

    // инициализируем роутер
    Router.init();

    if (Object.values(ROUTES).includes(window.location.pathname)) {
        Router.dispatch(window.location.pathname);
    } else {
        Router.dispatch('/error/404');
    }
});
