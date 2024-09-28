import {templatize} from "../../constprograms/shablon/shablon.js";
import {backurl} from "../../../services/router/settings.js";
import {errors} from "../../errors/errors.js";
import {Router} from "../../../services/router/router.js";

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
}

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

export function buildCards() {
    return getCards().catch(err => {
        errors.GetCardsError(err);
    })
}
