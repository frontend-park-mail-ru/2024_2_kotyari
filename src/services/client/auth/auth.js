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
function clearErrors() {
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
function displayErrors(errors) {
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
function addGlobalError(message) {
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
function clearGlobalError() {
    const globalError = document.getElementById('global_error');
    const globalErrorMessage = document.getElementById('global_error_message');

    if (globalError && globalErrorMessage) {
        globalErrorMessage.innerText = '';
        globalError.style.display = 'none';
    }
}
