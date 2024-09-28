export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const errorElement = document.getElementById(email.dataset.errorId);

    removeInputError(email, errorElement);

    if (!emailRegex.test(email.value)) {
        addInputError(email, errorElement, 'Неверный формат почты.')
        return false;
    }

    return true;
}

function removeInputError(element, errorElement) {
    errorElement.textContent = '';
    element.classList.remove('invalid__input');
}

function addInputError(element, errorElement, msg) {
    errorElement.textContent = msg;
    element.classList.add('invalid__input');
}

export function validatePassword(password, passwordRepeat) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&#])[A-Za-z\d@$%*?&#]{8,}$/;
    let isValid = true;
    const errorElement = document.getElementById(password.dataset.errorId);
    const errorRepeatElement = document.getElementById(passwordRepeat.dataset.errorId);

    removeInputError(password, errorElement);
    removeInputError(passwordRepeat, errorRepeatElement);

    if (password.value !== passwordRepeat.value) {
        addInputError(passwordRepeat, errorRepeatElement, 'Пароли должны совпадать');
        isValid = false;
    } else if (!passwordRegex.test(password.value)) {
        let errorMsg;
        if (password.value.length < 8) {
            errorMsg = 'Пароль должен содержать не менее 8 символов.'
        } else {
            errorMsg = 'Пароль должен содержать заглавные, строчные буквы, цифру и специальный символ @$%*?&#.';
        }
        addInputError(password, errorElement, errorMsg);
        addInputError(passwordRepeat, errorRepeatElement, '');
        isValid = false;
    } else {
        removeInputError(password, errorElement);
        removeInputError(passwordRepeat, errorRepeatElement);
    }

    return isValid;
}

export function validatePasswordLogin(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&#])[A-Za-z\d@$%*?&#]{8,}$/;
    let isValid = true;
    const errorElement = document.getElementById(password.dataset.errorId);

    removeInputError(password, errorElement);

    if (!passwordRegex.test(password.value)) {
        let errorMsg;
        if (password.value.length < 8) {
            errorMsg = 'Пароль должен содержать не менее 8 символов.'
        } else {
            errorMsg = 'Пароль должен содержать заглавные, строчные буквы, цифру и специальный символ @$%*?&#.';
        }
        addInputError(password, errorElement, errorMsg);
        isValid = false;
    } else {
        removeInputError(password, errorElement);
    }

    return isValid;
}

export function validateUsername(username) {
    const usernameRegex = /^[a-zа-яё][a-z0-9_а-яё]*$/i;
    let isValid = true;
    const errorElement = document.getElementById(username.dataset.errorId);
    const user = username.value;

    removeInputError(username, errorElement);

    if (user.length < 4 || user.length > 20) {
        addInputError(username, errorElement, 'Имя должно быть от 4 до 20 символов.')
        isValid = false;
    } else if (!usernameRegex.test(user)) {
        addInputError(username, errorElement, 'Имя может содержать только буквы, цифры и _.')
        isValid = false;
    } else {
        removeInputError(username, errorElement);
    }

    return isValid;
}
