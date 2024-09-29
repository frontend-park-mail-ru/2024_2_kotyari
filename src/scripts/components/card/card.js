import {templatize} from "../../constprograms/shablon/shablon.js";
import {backurl} from "../../../services/router/settings.js";
import {errors} from "../../errors/errors.js";
import {Router} from "../../../services/router/router.js";

/**
 * Инициализирует настройки для карточек, включая добавление обработчиков событий для переходов.
 *
 * @function cardSettings
 * @param {Array<Object>} data - Данные для карточек.
 */
function cardSettings (data) {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const link = card.getAttribute('data-link');
            if (link) {
                Router.navigate(link);
            }
        });
    });

    // Показываем анимацию загрузки
    document.getElementById('loading-placeholder').style.display = 'grid';
    document.getElementById('cards').style.display = 'none';

    if (data.length !== 0) {
        // Если карточки есть, рендерим их
        document.getElementById('loading-placeholder').style.display = 'none';
        document.getElementById('cards').style.display = 'grid';
    }

    setTimeout(() => {
        // Найдем все изображения, которые должны быть загружены после построения карточек
        const images = document.querySelectorAll(".card-image img");

        images.forEach(img => {
            const dataSrc = img.getAttribute("data-src"); // используем data-src вместо src для отложенной загрузки
            if (dataSrc) {
                // Устанавливаем реальный src после загрузки всех карточек
                img.setAttribute("src", dataSrc);
            }
        });
    }, 500);
}

/**
 * Выполняет запрос на получение карточек и рендерит их с использованием шаблона.
 *
 * @async
 * @function getCards
 * @returns {Promise<void>} - Возвращает промис, который рендерит карточки и инициализирует их настройки.
 * @throws {Error} - Если запрос завершился ошибкой.
 */
async function getCards() {
    const response = await fetch(backurl + 'catalog/products', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const data = Object.values(await response.json())
    return templatize(document.getElementById('main'), '/src/scripts/components/card/card.hbs', {products: data}).then(() => {
        cardSettings(data);
    });
}

/**
 * Строит карточки, запрашивая их данные с сервера и обрабатывая ошибки.
 *
 * @function buildCards
 * @returns {Promise<void>} - Возвращает промис, который обрабатывает данные карточек или выводит ошибку.
 */
export function buildCards() {
    return getCards().catch(err => {
        errors.GetCardsError(err);
    })
}
