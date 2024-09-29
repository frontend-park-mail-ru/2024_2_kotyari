import {
    validateEmail,
    validatePassword,
    validatePasswordLogin,
    validateUsername
} from "../../../scripts/components/auth-menu/auth.js";
import {backurl} from "../../router/settings.js";
import {Router} from "../../router/router.js";
import {signInUpdate} from "../../../scripts/layouts/header/header.js";
import {setCookie, COOKIEEXPIRATION} from "../../cookie/cookie.js";
import {buildAuthMenu} from "../../../scripts/components/auth-menu/menu.js";
import {menuSignIn} from "../../../scripts/components/auth-menu/menu-config.js";

/**
 * Обработчик для входа в систему (Sign In).
 * Выполняет валидацию полей формы и отправляет запрос на сервер для входа.
 *
 * @param {Event} event - Событие отправки формы.
 */
export function handleSignIn(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.querySelector('[name="email"]');
    const password = form.querySelector('[name="password"]');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePasswordLogin(password);

    if (!isEmailValid || !isPasswordValid) {
        console.error('Ошибка валидации');
        return;
    }

    fetch(backurl + 'login', {
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(async response => {
            if (response.ok) {
                form.reset();
                form.removeEventListener('submit', handleSignUp);
            }

            if (response.status === 401) {
                throw new Error('Пользователя не существует');
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Произошла ошибка на сервере.');
            }

            return response.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(data => {
            if (!data) {
                console.error('Ошибка входа:', data);
                addGlobalError(data);
            } else {
                form.reset();
                form.removeEventListener('submit', handleSignIn);

                setCookie('user', {city: 'Москва', name: data.username}, COOKIEEXPIRATION);

                signInUpdate(data.username);

                Router.navigate('/');
            }
        })
        .catch(error => {
            console.error('Ошибка при запросе:', error.message);
            addGlobalError(error.message);
        });
}

/**
 * Обработчик для регистрации пользователя (Sign Up).
 * Выполняет валидацию полей формы и отправляет запрос на сервер для регистрации.
 *
 * @param {Event} event - Событие отправки формы.
 */
export function handleSignUp(event) {
    event.preventDefault();

    const form = event.target;
    let username = form.querySelector('[name="username"]');
    const email = form.querySelector('[name="email"]');
    const password = form.querySelector('[name="password"]');
    const password_repeat = form.querySelector('[name="password_repeat"]');

    const errorMsg = document.getElementById('errors');

    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, password_repeat);

    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
        console.error('Ошибка валидации');
        return;
    }

    fetch(backurl + 'signup', {
        method: 'POST',
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
            repeat_password: password_repeat.value
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(async response => {
            if (response.ok) {
                console.log('Регистрация прошла успешно');
                form.reset();
                form.removeEventListener('submit', handleSignUp);

                response.json().then((data) => {
                    let usernames =  data.username;

                    setCookie('user', {city: 'Москва', name: usernames}, COOKIEEXPIRATION);

                    signInUpdate(usernames);

                    Router.navigate('/');
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                const err = await response.json();
                addGlobalError(err.error_message);
                console.error('Ошибка регистрации:', response.json());
            }
        })
        .catch(error => {
            console.error('Ошибка при запросе на регистрацию:', error);
            errorMsg.textContent = 'Ошибка подключения. Попробуйте позже.';
        });
}


/**
 * Очищает все сообщения об ошибках на странице.
 */
export function clearErrors() {
    const globalError = document.getElementById('global_error');
    globalError.style.display = 'none';
    globalError.querySelector('#global_error_message').innerText = '';

    document.querySelectorAll('.errors__feedback').forEach(function (element) {
        element.innerText = '';
    });
}

/**
 * Отображает ошибки на форме.
 *
 * @param {Object} errors - Объект с ошибками для каждого поля формы.
 * @param {string} [errors.global] - Сообщение о глобальной ошибке.
 */
export function displayErrors(errors) {
    if (errors['global']) {
        const globalError = document.getElementById('global_error');
        globalError.style.display = 'block';
        globalError.querySelector('#global_error_message').innerText = errors['global'];
    }

    for (let fieldId in errors) {
        if (fieldId !== 'global') {
            const errorElement = document.getElementById(`${fieldId}_error`);
            if (errorElement) {
                errorElement.innerText = errors[fieldId];
            }
        }
    }
}

/**
 * Добавляет глобальную ошибку на страницу.
 *
 * @param {string} message - Текст сообщения об ошибке.
 */
export function addGlobalError(message) {
    const globalError = document.getElementById('global_error');
    const globalErrorMessage = document.getElementById('global_error_message');

    if (globalError && globalErrorMessage) {
        globalErrorMessage.innerText = message;
        globalError.style.display = 'block';
    }
}

/**
 * Очищает глобальное сообщение об ошибке на странице.
 */
export function clearGlobalError() {
    const globalError = document.getElementById('global_error');
    const globalErrorMessage = document.getElementById('global_error_message');

    if (globalError && globalErrorMessage) {
        globalErrorMessage.innerText = '';
        globalError.style.display = 'none';
    }
}


/**
 * Выполняет GET-запрос по указанному маршруту и обрабатывает ответ.
 * Если ответ с кодом 200, рендерит страницу с использованием переданной функции рендера.
 * Если ответ с кодом 401, перенаправляет на страницу входа.
 * Логирует любые другие ошибки в консоль.
 *
 * @param {string} route - URL-адрес, на который отправляется запрос.
 * @param redirectLink - URL-адрес для переадресации в случае 401
 * @param {Function} renderFunction - Функция, которая вызывается для рендеринга страницы при успешном запросе.
 * @returns {Promise<void>} - Промис, который разрешается, когда запрос обработан.
 */
export function fetchAndRender(route, redirectLink, renderFunction) {
    return fetch(backurl + route, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return renderFunction();
            } else if (response.status === 401) {
                addGlobalError('Пожалуйста, войдите в аккаунт, чтобы просмотреть избранное.');
                Router.navigate(redirectLink);
                return Promise.resolve();
            } else {
                return response.text().then(errorText => {
                    addGlobalError(errorText || 'Произошла ошибка на сервере.');
                });
            }
        })
        .catch(err => {
            addGlobalError('Ошибка сети или сервера. Попробуйте позже.');
        });
}
