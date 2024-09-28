import {handler, Router} from "../../../services/router/router.js";

export function logoutUpdate() {
    document.getElementById('avatar').innerHTML = `<a href="/login" router="stability-active" class="catalog-link">Вход</a>
                        <a href="/signup" router="stability-active" class="catalog-link">Регистрация</a>`
    document.getElementById('name').innerHTML = `<span class="icon-label-hidden catalog-link" id="name">Аватар</span>`

    // Переходим на страницу авторизации без перезагрузки
    Router.navigate('/');
}

export function signInUpdate(name) {
    document.getElementById('avatar').innerHTML = `<a href="#" router="stability-active" class="catalog-link">Личный кабинет</a>
                        <a href="/logout" router="stability-active" id="logout" class="catalog-link">Выход</a>`
    document.getElementById('name').innerHTML = `<span class="icon-label-hidden catalog-link" id="name">${name}</span>`

    document.getElementById('logout').onclick = handler;

    // Переходим на страницу авторизации без перезагрузки
    Router.navigate('/');
}
