import {buildBody} from "../src/scripts/layouts/body.js";
import {buildCards} from "../src/scripts/components/card.js";
import {buildModalWithContent} from "../src/scripts/components/modal-auth/modal-auth.js";
import {modalSignIn, modalSignUp} from "../src/scripts/components/modal-auth/modal-config.js"
import {handleSignIn, handleSignUp} from "../src/services/client/auth/auth.js";

const user = {
    // name: 'Василий',
    city: 'Москва'
}

const templates = {
    'auth_menu': '/src/scripts/components/modal-auth/auth-menu.hbs',
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
        templates['auth_menu'],
        'sign_up__modal',
        'modal__signup',
        modalSignUp
    ).then(() => {
        document.getElementById(modalSignUp.formId).addEventListener('submit', handleSignUp);
    }).catch(
        err => {
            console.log(err);
        }
    );
    buildModalWithContent(user,
        'btn__sign_in',
        templates['auth_menu'],
        'sign_in__modal',
        'modal__login',
        modalSignIn
    ).then(() => {
        document.getElementById(modalSignIn.formId).addEventListener('submit', handleSignIn);

    }).catch(
        err => {
            console.log(err);
        }
    );
});
