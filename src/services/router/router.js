import {buildBody, handleLogout} from "../../scripts/layouts/body.js";
import {buildCards} from "../../scripts/components/card.js";
import {COOKIEEXPIRATION, setCookie, getCookie} from '../cookie/cookie.js'
import {buildAuthMenu} from "../../scripts/components/auth-menu/menu.js";
import {menuSignIn, menuSignUp} from "../../scripts/components/auth-menu/menu-config.js";


export let user = {
    // name: 'Василий',
    city: 'Москва'
}

// Собираемые для переработки пути
const ROUTES = {
    HOME: '/',
    CATALOG: '/api/catalog',
    RECORDS: '/api/records',
    CHANGESITY: '/api/changeSity',
    BASKET: '/api/basket',
    FAVORITE: '/api/favorite',
    PRODUCT: '/api/catalog/product/:id',
    LOGOUT: '/api/logout',
    LOGIN: '/api/login',
    SIGNUP: '/api/signup',
};

const CLICKCLASSESES = {
    body: '.body-url',
    overrideable: '.url'
}

const urlAttribute = 'href';

// Регулярные выражения для маршрутов
const REGEX = {
    PARAMS: /:\w+/g,
    ANY_ROUTE: (route) => new RegExp('^' + route.replace(REGEX.PARAMS, '(\\w+)') + '$')
};

// обработчик нажатий на ссылки
const handler = event =>  {
    let url = new URL(event.currentTarget.getAttribute(urlAttribute), window.location.origin);

    Router.dispatch(url.pathname);

    event.preventDefault();
}

// Функция для удаления всех событий
const removeAllHandlers = () => {
    let anchors = document.querySelectorAll(CLICKCLASSESES.overrideable);

    for (let anchor of anchors) {
        anchor.onclick = null;  // Удаляем обработчик
    }
};

// Функция для пустых страниц
function clearPage() {
    document.getElementById('main').innerHTML = '<h2>Пустая страничка :)</h2>';
    return Promise.resolve();
}

// Класс Router для маршрутизации на клиенте
const Router = {

    // Маршруты и обработчики
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
    },

    // Инициализация маршрутов
    init: function() {
        this._routes = [];
        for (let route in this.routes) {
            let method = this.routes[route];
            this._routes.push({
                pattern: REGEX.ANY_ROUTE(route),
                callback: this[method]
            });
        }
    },

    // Обработка маршрутов
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

    // Обработчик вставки в тело
    body: function(mainPart) {
        removeAllHandlers(); // Удаляем все события перед рендером новой страницы

        // Ожидаем завершения рендера body, затем строим внутренность
        return mainPart().then(() => {
            let anchors = document.querySelectorAll(CLICKCLASSESES.overrideable);

            for( let anchor of anchors ) {
                anchor.onclick = handler;
            }
        });
    },

    // Страница каталог товаров
    catalog: function() {
        setCookie('lastUrl', ROUTES.CATALOG, COOKIEEXPIRATION);
        return this.body(() => buildCards());  // Загружаем карточки
    },

    // Страница заказы
    records: function () {
        setCookie('lastUrl', ROUTES.RECORDS, COOKIEEXPIRATION);
        console.log('заказы');
        return this.body(() =>  clearPage());
    },

    // Страница корзины
    basket: function () {
        setCookie('lastUrl', ROUTES.BASKET, COOKIEEXPIRATION);
        console.log('корзина');
        return this.body(() =>  clearPage());
    },

    // Страница избранное
    favorites: function () {
        setCookie('lastUrl', ROUTES.FAVORITE, COOKIEEXPIRATION);
        console.log('избранное');
        return this.body(() =>  clearPage());
    },

    // Страница изменения города
    changeSity: function () {
        setCookie('lastUrl', ROUTES.CHANGESITY, COOKIEEXPIRATION);
        console.log('изменение города');
        return this.body(() =>  clearPage());
    },

    // Страницы продуктов
    product: function (id) {
        setCookie('lastUrl', ROUTES.PRODUCT.replace(':id', id), COOKIEEXPIRATION);
        console.log('Продукт с id = ', id);
        return this.body(() =>  clearPage());
    },

    logout: function () {
        return this.body(() =>  handleLogout());
    },

    login: function (){
        return this.body(() => buildAuthMenu(menuSignIn));
    },

    signup: function (){
        return this.body(() => this.body(() =>  buildAuthMenu(menuSignUp)))
    },
};

buildBody(user).then(() => {
    let anchors = document.querySelectorAll(CLICKCLASSESES.body);
    for( let anchor of anchors ) anchor.onclick = handler;

    // инициализируем роутер
    Router.init();

    // Проверяем, есть ли сохраненный URL в куках
    const lastUrl = getCookie('lastUrl');

    if (lastUrl) {
        // Если есть сохраненный URL, направляем на него
        Router.dispatch(lastUrl);
    } else {
        // Иначе запускаем главную страницу
        Router.dispatch(ROUTES.HOME);
    }
});
