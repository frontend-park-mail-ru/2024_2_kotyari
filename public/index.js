import {buildBody} from "../src/scripts/layouts/body.js";
import {buildCards} from "../src/scripts/components/card.js";
import {buildModalWithContent} from "../src/scripts/components/modal.js";
import {modalSignIn, modalSignUp} from "../src/scripts/components/authMenu.js"

const user = {
    // name: 'Василий',
    city: 'Москва'
}

// Ожидаем завершения рендера body, затем строим карточки
buildBody(user).then(() => {
    return buildCards().then(() => {
        let div = document.createElement('div')
        div.id = 'modals'

        document.getElementById('main').append(div)
    });
}).then(() => {
    buildModalWithContent(user,
        'btn__sign_up',
        '/src/scripts/layouts/authMenu.hbs',
        'footer1',
        'modal__signup',
        modalSignUp
    );
    buildModalWithContent(user,
        'btn__sign_in',
        '/src/scripts/layouts/authMenu.hbs',
        'footer2',
        'modal__login',
        modalSignIn
    );
})
