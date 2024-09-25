import {buildBody} from "../src/scripts/layouts/body.js";
import {buildCards} from "../src/scripts/components/card.js";
import {buildModalWithContent} from "../src/scripts/components/modalAuth.js";
import {modalSignIn, modalSignUp} from "../src/scripts/components/modalData.js"
import {handleSignIn, handleSignUp} from "../src/services/client/auth.js";

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
    ).then(() => {
        document.getElementById(modalSignUp.formId).addEventListener('submit', handleSignUp);
    }).catch(
        err => {
            console.log(err);
        }
    );
    buildModalWithContent(user,
        'btn__sign_in',
        '/src/scripts/layouts/authMenu.hbs',
        'footer2',
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

