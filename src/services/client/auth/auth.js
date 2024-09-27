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
    fetch(  backurl + 'login', {
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
        .then(response => {
            // Проверяем статус ответа
            if (!response.ok) {
                throw new Error('Ошибка сети: ' + response.statusText);
            }

            // Проверяем, если тело пустое, не пытаемся его парсить
            return response.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(data => {
            if (data.ok) {
                console.log('Успешный вход в систему');
                form.reset();
                form.removeEventListener('submit', handleSignIn);
            } else {
                console.error('Ошибка входа:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при запросе на вход:', error);
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
        .then(response => {
            if (response.ok) {
                console.log('Регистрация прошла успешно');
                form.reset();
                form.removeEventListener('submit', handleSignUp);

                // Переходим на страницу авторизации без перезагрузки
                Router.navigate('/');
            } else {
                console.error('Ошибка регистрации:', response.json());
            }
        })
        .catch(error => {
            console.error('Ошибка при запросе на регистрацию:', error);
            errorMsg.textContent = 'Ошибка подключения. Попробуйте позже.';
        });
}
