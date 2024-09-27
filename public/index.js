import {buildBody} from "../src/scripts/layouts/body.js";
import {buildCards} from "../src/scripts/components/card.js";
import {modalSignIn, modalSignUp} from "../src/scripts/components/auth-menu/menu-config.js"
import {handleSignIn, handleSignUp} from "../src/services/client/auth/auth.js";
import {buildAuthMenu} from "../src/scripts/components/auth-menu/menu.js";

const user = {
    // name: 'Василий',
    city: 'Москва'
}

// Ожидаем завершения рендера body, затем строим карточки
buildBody(user).then(() => {
    buildAuthMenu(modalSignUp)
        .then(() => {
            document.getElementById(modalSignUp.id).addEventListener('submit', handleSignUp);
        })
        .catch(
            err => {
                console.log(err);
            }
        );

    buildAuthMenu(modalSignIn)
        .then(() => {
            document.getElementById(modalSignIn.id).removeEventListener('submit', handleSignIn);
        })
        .catch(
            err => {
                console.log(err);
            }
        );
});
