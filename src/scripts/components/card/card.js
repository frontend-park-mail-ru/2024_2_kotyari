import {templatize} from "../../constprograms/shablon/shablon.js";
import {backurl} from "../../../services/server/settings.js";
import {errors} from "../../errors/errors.js";

function cardSettings () {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const link = card.getAttribute('data-link');
            if (link) {
                window.location.href = link;
            }
        });
    });
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
        cardSettings();
    });
}

export function buildCards() {
    return getCards().catch(err => {
        errors.GetCardsError(err);
    })
}
