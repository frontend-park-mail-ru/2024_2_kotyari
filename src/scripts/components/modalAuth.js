import {templatize} from "../constprograms/shablon.js";
import {errors} from "../errors/errors.js";


export function buildModalWithContent(user, triggerElement, template, rootId, modalID, data) {
    if (user.name === "") {
        return;
    }

    const root = document.getElementById(rootId);

    return templatize(root, template, data).then(() => {
        const modalController = ({modal, btnOpen, btnClose, time = 300}) => {
            const btn = document.getElementById(btnOpen);
            const modalElem = document.getElementById(modal);

            modalElem.style.cssText = `
                    display: flex;
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity ${time}ms ease-in-out;`;

            const closeModal = event => {
                const target = event.target;

                if (target === modalElem ||
                    (btnClose && target.closest(btnClose)) ||
                    event.code === 'Escape') {
                    modalElem.style.opacity = '0';

                    setTimeout(() => {
                        modalElem.style.visibility = 'hidden';
                    }, time);

                    window.removeEventListener('keydown', closeModal);
                }
            };

            const openModal = () => {
                modalElem.style.visibility = 'visible';
                modalElem.style.opacity = '1';
                window.addEventListener('keydown', closeModal);
            };

            btn.addEventListener('click', openModal);

            modalElem.addEventListener('click', closeModal);
        };

        modalController({
            modal: modalID,
            btnOpen: triggerElement,
            btnClose: '.btn__close'
        });
    })
        .catch(err => {
            errors.ShablonError(err);
        });
}

export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailError = document.getElementById('emailError');
    let isValid = true;

    emailError.textContent = '';

    if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Invalid email address.';
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.remove('is-invalid');
    }

    return isValid;
}

export function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&#])[A-Za-z\d@$%*?&#]{9,}$/;
    const passwordError = document.getElementById('passwordError');
    let isValid = true;

    passwordError.textContent = ''; // Clear previous error

    if (!passwordRegex.test(password.value)) {
        if (password.value.length < 8) {
            passwordError.textContent = 'The password must be at least 8 characters long';
        } else {
            // Пароль должен содержать
            passwordError.textContent = 'Password must include uppercase, lowercase, number, and special character @$%*?&#.';
        }
        password.classList.add('is-invalid');
        isValid = false;
    } else {
        password.classList.remove('is-invalid');
    }

    return isValid;
}

export function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Разрешены только буквы, цифры и _
    const usernameError = document.getElementById('usernameError');
    let isValid = true;

    usernameError.textContent = '';

    // Проверка длины
    if (username.value.length < 4 || username.value.length > 20) {
        usernameError.textContent = 'The length of the name must be at least 4 characters and not exceed 20';
        username.classList.add('is-invalid');
        isValid = false;
    }
    // Проверка на запрещённые символы
    else if (!usernameRegex.test(username.value)) {
        usernameError.textContent = 'The name can contain letters, numbers, and underscores';
        username.classList.add('is-invalid');
        isValid = false;
    } else {
        username.classList.remove('is-invalid');
    }

    return isValid;
}

