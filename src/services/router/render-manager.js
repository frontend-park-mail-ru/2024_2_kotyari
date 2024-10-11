import {buildBody} from "../../scripts/layouts/body.js";
import {AddDropDown} from "../../scripts/layouts/header/header.js";
import {handler, Router} from "./router.js";

/**
 * Значение атрибуда router для элементов с кликабельными ссылками.
 * @enum {string}
 */
const CLICK_CLASSES = {
    stability: 'stability-active',
    overrideable: 'changed-active'
};

/**
 * Атрибут для получения URL из элемента.
 * @type {string}
 */
const urlAttribute = 'href';



export default class RenderManager {
    constructor(rootElementId) {
        this.rootElement = document.getElementById(rootElementId);
    }
    renderWithHandlers = (mainPart) => {
        const main = this.rootElement;
        if (!main) {
            throw new Error('Root element not found');
        }

        // Убираем все события перед началом рендеринга
        let anchors = document.querySelectorAll(`[router=${CLICK_CLASSES.stability}]`);
        for (let anchor of anchors) anchor.onclick = null;

        main.classList.add('invisible'); // Скрываем основной элемент

        this.removeAllHandlers(); // Удаляем все события перед рендером новой страницы

        return mainPart().then(() => {
            // Добавляем обработчики на динамические элементы после рендеринга
            anchors = document.querySelectorAll(`[router=${CLICK_CLASSES.overrideable}]`);
            for (let anchor of anchors) {
                anchor.onclick = this.handler;
            }

            main.classList.remove('invisible'); // Сразу отображаем контент без задержки

            anchors = document.querySelectorAll(`[router=${CLICK_CLASSES.stability}]`);
            for (let anchor of anchors) anchor.onclick = handler;

            // Убираем класс 'show', если он присутствует (зависит от стилей)
            main.classList.remove('show');
        });
    }

    removeAllHandlers = () => {
        let anchors = document.querySelectorAll(CLICK_CLASSES.overrideable);

        anchors.forEach((anchor) => {
            anchor.onclick = null; // Удаляем обработчики событий
        });
    };

    handler = event => {
        let url = new URL(event.currentTarget.getAttribute(urlAttribute), window.location.origin);

        Router.dispatch(url.pathname);

        event.preventDefault();
    }
}
