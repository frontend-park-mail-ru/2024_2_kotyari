import {errors} from '../errors/errors'

const config = {
    header: {
        html: "div",
        class: ["header"] // Класс из CSS
    },
    main: {
        html: "div",
        class: ["main"] // Класс из CSS
    },
    footer: {
        html: "div",
        class: ["footer"] // Класс из CSS
    },
    div: {
        html: "div",
        class: ["div"] // Класс из CSS
    },
    logo: {
        html: "img",
        class: ["logo"], // Класс из CSS
        alt: "logo",
        href: "/api/katalog",
    },
    dropButton: {
        html: "button",
        class: ["dropButton"], // Класс из CSS
        hover: {
            class: ["dropButton:hover"] // Класс для hover
        },
    },
    button: {
        html: "button",
        class: ["button"], // Класс из CSS
        hover: {
            class: ["button:hover"] // Класс для hover
        },
        event: {
            click: "func1",
        }
    },
    searchInput: {
        html: "input",
        class: ["searchInput"], // Класс из CSS
        ntype: "search", // Исправлено type="search"
    },
    tableRow: {
        html: "div",
        class: ["row3"], // Класс для строки с тремя колонками
    },
    tableCol: {
        html: "div",
        class: ["col"], // Класс для колонки
    },
    text: {
        html: "text",
        class: ["text"]
    },
    span: {
        html: "span",
        class: ["span"],
    },
    p: {
        html: 'p',
    }
};

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
        type
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
        element.textContent = content;
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
        element.textContent = content;
    }
}

function buildElement(elementType) {
    const elementConfig = config[elementType];

    if (!elementConfig) {
        errors.BadElement(elementConfig)
        return null;
    }

    // Создаем элемент
    const element = document.createElement(elementConfig.html);

    // Применяем настройки
    elementSettings(elementConfig, element);

    return element;
}


export {elementSettings, buildElement}
