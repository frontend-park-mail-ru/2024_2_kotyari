import {buildElement, elementSettings} from "./elements";

// Функция для обработки сетки с учетом классов rowX и colX
function applyGridClasses(config, element) {
    if (config.class) {
        const className = Array.isArray(config.class) ? config.class.join(' ') : config.class;
        element.classList.add(className);
    }

    if (typeof config.class === 'string' && config.class.startsWith('col')) {
        const colFraction = parseInt(config.class.replace('col', ''), 10);
        if (!isNaN(colFraction)) {
            element.style.flex = `0 0 ${100 / colFraction}%`;
        }
    }

    if (config.style) {
        if (config.style.width) {
            element.style.width = config.style.width;
            element.style.flex = '0 0 auto';  // Для фиксированной ширины
        }
        if (config.style.height) {
            element.style.height = config.style.height;
        }
    }
}

// Функция для рекурсивного создания элементов
function createElement(config, parent) {
    let element;

    if (config.type === 'text') {
        element = document.createTextNode(config.content);
    } else {
        element = buildElement(config.type);

        elementSettings(config, element);
        applyGridClasses(config, element);
    }

    if (config.elements && Array.isArray(config.elements)) {
        config.elements.forEach(childConfig => {
            createElement(childConfig, element);
        });
    }

    // Добавляем элемент в родительский контейнер (если это не текстовый узел)
    if (parent && !(element instanceof Text)) {
        parent.appendChild(element);
    } else if (parent && element instanceof Text) {
        parent.appendChild(element);
    }
}

// Функция для создания колонки с заданной шириной или классом
function createColumn(columnConfig, root) {
    const columnElement = buildElement('div');
    columnElement.style.display = 'flex';  // Для отображения элементов в строку

    applyGridClasses(columnConfig, columnElement);

    columnConfig.elements.forEach(elementConfig => {
        createElement(elementConfig, columnElement);
    });

    root.appendChild(columnElement);
}

// Функция для создания строки
function createRow(rowConfig, root) {
    const rowElement = buildElement('div');
    rowElement.style.display = 'flex';
    rowElement.style.flexDirection = 'row';  // Горизонтальная строка

    applyGridClasses(rowConfig, rowElement);

    if (rowConfig.columns && Array.isArray(rowConfig.columns)) {
        rowConfig.columns.forEach(columnConfig => {
            createColumn(columnConfig, rowElement);
        });
    }

    root.appendChild(rowElement);
}

// Основная функция для инициализации конфигурации
export function initialize(config, root) {
    Object.keys(config).forEach(section => {
        const sectionConfig = config[section];

        const sectionType = sectionConfig.type || section;
        const sectionElement = buildElement(sectionType);

        if (sectionConfig.style) {
            Object.keys(sectionConfig.style).forEach(styleKey => {
                sectionElement.style[styleKey] = sectionConfig.style[styleKey];
            });
        }

        if (sectionConfig.rows && Array.isArray(sectionConfig.rows)) {
            sectionConfig.rows.forEach(rowConfig => {
                createRow(rowConfig, sectionElement);
            });
        }

        root.appendChild(sectionElement);
    });
}
