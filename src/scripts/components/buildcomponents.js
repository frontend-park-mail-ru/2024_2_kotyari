import {buildElement, elementSettings} from "./elements";

const basicType = 'div';
const nonWord = 'none';

// Рекурсивная функция для построения элементов
function buildElements(config, parentElement) {
    config.forEach(elementConfig => {
        let element;

        if (!elementConfig.type || elementConfig.type === nonWord) {
            element = document.createElement(basicType);
        } else {
            // Создаем элемент через buildElement, основываясь на его типе
            element = buildElement(elementConfig.type);
        }

        // Применяем настройки для текущего элемента
        elementSettings(elementConfig, element);

        // Если есть вложенные элементы, создаем их рекурсивно
        if (elementConfig.elements && Array.isArray(elementConfig.elements)) {
            buildElements(elementConfig.elements, element);
        }

        parentElement.appendChild(element);
    });
}

// Инициализация структуры
export function initialize(config, root) {
    buildElements(config, root);
}
