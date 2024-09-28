import {
    validateUsername,
    validatePassword,
    validateEmail,
    validatePasswordLogin
} from "../../../scripts/components/auth-menu/auth.js";
import {backurl} from "../../router/settings.js";
import {Router} from "../../router/router.js";
import {COOKIEEXPIRATION, setCookie} from "../../cookie/cookie.js";

export function handleSignIn(event) {
    console.log(1)
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

    console.log(email.value, ' ', password.value);

    // Если валидация успешна, выполняем запрос
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
                console.log('Регистрация прошла успешно');
                form.reset();
                form.removeEventListener('submit', handleSignUp);

                // Переходим на страницу авторизации без перезагрузки
                Router.navigate('/');
            }

            if (response.status === 401) {
                throw new Error('Пользователя не существует');
                // Если статус 401, перенаправляем на страницу регистрации
                // window.location.href = '/signup';
                // return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Произошла ошибка на сервере.');
            }

            // Проверяем, если тело пустое, не пытаемся его парсить
            return response.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(data => {
            if (data) {
                console.error('Ошибка входа:', data);
                addGlobalError(data); // Выводим сообщение об ошибке
            } else {
                console.log('Успешный вход в систему');
                form.reset();
                form.removeEventListener('submit', handleSignIn);
            }
        })
        .catch(error => {
            console.error('Ошибка при запросе:', error.message);
            addGlobalError(error.message);
        });
}

export function handleSignUp(event) {
    console.log(222);
    event.preventDefault(); // Предотвращаем отправку формы

    const form = event.target;
    const username = form.querySelector('[name="username"]');
    const email = form.querySelector('[name="email"]');
    const password = form.querySelector('[name="password"]');
    const password_repeat = form.querySelector('[name="password_repeat"]');

    const errorMsg = document.getElementById('errors');

    // Валидация полей
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, password_repeat);

    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
        console.error('Ошибка валидации');
        return;
    }

    // Если валидация успешна, выполняем запрос
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

                // Переходим на страницу авторизации без перезагрузки
                Router.navigate('/');
            } else {
                const err = await response.json()
                addGlobalError(err.error_message)
                console.error('Ошибка регистрации:', response.json());
            }
        })
        .catch(error => {
            console.error('Ошибка при запросе на регистрацию:', error);
            errorMsg.textContent = 'Ошибка подключения. Попробуйте позже.';
        });
}


function clearErrors() {
    // Скрыть глобальные ошибки
    const globalError = document.getElementById('global_error');
    globalError.style.display = 'none';
    globalError.querySelector('#global_error_message').innerText = '';

    // Очистить ошибки для каждого поля
    document.querySelectorAll('.errors__feedback').forEach(function (element) {
        element.innerText = '';
    });
}

function displayErrors(errors) {
    // Если есть глобальная ошибка
    if (errors['global']) {
        const globalError = document.getElementById('global_error');
        globalError.style.display = 'block';
        globalError.querySelector('#global_error_message').innerText = errors['global'];
    }

    // Показываем ошибки для каждого поля
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
 * Функция для добавления глобальной ошибки
 * @param {string} message - Сообщение об ошибке
 */
function addGlobalError(message) {
    const globalError = document.getElementById('global_error');
    const globalErrorMessage = document.getElementById('global_error_message');

    if (globalError && globalErrorMessage) {
        globalErrorMessage.innerText = message; // Устанавливаем текст ошибки
        globalError.style.display = 'block'; // Делаем блок с ошибкой видимым
    }
}

/**
 * Функция для очистки глобальных ошибок
 */
function clearGlobalError() {
    const globalError = document.getElementById('global_error');
    const globalErrorMessage = document.getElementById('global_error_message');

    if (globalError && globalErrorMessage) {
        globalErrorMessage.innerText = ''; // Очищаем текст ошибки
        globalError.style.display = 'none'; // Скрываем блок с ошибкой
    }
}