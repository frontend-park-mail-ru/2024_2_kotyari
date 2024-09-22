import {buildBody} from "../src/scripts/layouts/body.js";
import {buildCards} from "../src/scripts/components/card.js";

const user = {
    name: 'Василий',
    city: 'Москва'
}

// Ожидаем завершения рендера body, затем строим карточки
buildBody(user).then(() => {
    return buildCards();
});
