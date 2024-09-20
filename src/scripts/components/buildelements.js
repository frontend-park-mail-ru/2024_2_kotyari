import {elements} from "./elements";
import {errors} from "../errors/errors";

function elementSettings(elementConfig, element) {
    const {
        style = {},
        class: classList = [],
        ntype,
        alt,
        href,
        content,
        event = {},
        id,
        hover = {},
        html,
        type,
        placeholder
    } = elementConfig;

    // Применение стилей
    Object.assign(element.style, style);

    // Применение классов
    if (Array.isArray(classList)) {
        classList.forEach(cls => element.classList.add(cls));
    }

    // Применение атрибутов
    const attributes = { type: ntype, alt, href };
    Object.keys(attributes).forEach(attr => {
        if (attributes[attr]) {
            element.setAttribute(attr, attributes[attr]);
        }
    });

    // Применение содержимого
    if (content) {
        element.innerHTML = content;
    }

    // Применение событий
    Object.keys(event).forEach(eventType => {
        const eventHandler = window[event[eventType]];
        if (typeof eventHandler === 'function') {
            element.addEventListener(eventType, eventHandler);
        }
    });

    // Применение id
    if (id) {
        element.id = id;
    }

    // Применение placeholder
    if (placeholder) {
        element.placeholder = placeholder;
    }

    // Применение hover стилей
    if (hover.style) {
        const originalStyle = { ...element.style }; // Копируем оригинальные стили
        element.addEventListener('mouseenter', () => {
            Object.assign(element.style, hover.style);
        });
        element.addEventListener('mouseleave', () => {
            Object.assign(element.style, originalStyle);
        });
    }

    // Установка содержимого для текста
    if (html === 'text' || type === 'text') {
        element.innerHTML = content;
    }
}

function buildElement(elementType) {
    const elementConfig = elements[elementType];

    if (!elementConfig) {
        errors.BadElement(elementType)
        return null;
    }

    // Создаем элемент
    const element = document.createElement(elementConfig.html);

    // Применяем настройки
    elementSettings(elementConfig, element);

    return element;
}


export {elementSettings, buildElement}
