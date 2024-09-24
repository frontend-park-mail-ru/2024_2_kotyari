import {data} from "./data.js";
import {templatize} from "../constprograms/shablon.js";

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

export function buildCards() {
    return templatize(document.getElementById('main'), '/src/scripts/components/card.hbs', data).then(() => {
        cardSettings();
    })
}
