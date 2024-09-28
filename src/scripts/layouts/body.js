import {templatize} from '../constprograms/shablon/shablon.js'
import {logoutUpdate} from "./header/header.js";
import {backurl} from "../../services/router/settings.js";
import {deleteCookie} from "../../services/cookie/cookie.js";
import {Router} from "../../services/router/router.js";

export function buildBody(data) {
    return templatize(document.body, '/src/scripts/layouts/body.hbs', data);
}

export async function handleLogout() {
    try {
        const response = await fetch(backurl + 'logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 204) {
            Router.navigate('/');
        } else {
            alert('Не удалось выполнить выход. Попробуйте снова.');
        }
    } catch (error) {
        alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }

    deleteCookie('user');

    logoutUpdate();
}
