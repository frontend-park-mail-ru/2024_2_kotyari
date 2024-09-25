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
    let isValid = true;
    const errorElement = document.getElementById(email.dataset.errorId);

    if (!emailRegex.test(email.value)) {
        errorElement.textContent = 'Неверный формат почты.';
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        errorElement.textContent = '';
        email.classList.remove('is-invalid');
    }

    return isValid;
}

export function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&#])[A-Za-z\d@$%*?&#]{9,}$/;
    let isValid = true;
    const errorElement = document.getElementById(password.dataset.errorId);

    if (!passwordRegex.test(password.value)) {
        if (password.value.length < 8) {
            errorElement.textContent = 'Пароль должен содержать не менее 8 символов.';
        } else {
            errorElement.textContent = 'Пароль должен содержать заглавные, строчные буквы, цифру и специальный символ @$%*?&#.';
        }
        password.classList.add('is-invalid');
        isValid = false;
    } else {
        errorElement.textContent = '';
        password.classList.remove('is-invalid');
    }

    return isValid;
}

export function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    let isValid = true;
    const errorElement = document.getElementById(username.dataset.errorId);
    const user = username.value;

    if (user.length < 4 || user.length > 20) {
        errorElement.textContent = 'Имя должно быть от 4 до 20 символов.';
        username.classList.add('is-invalid');
        isValid = false;
    } else if (!usernameRegex.test(username)) {
        errorElement.textContent = 'Имя может содержать только буквы, цифры и _.';
        username.classList.add('is-invalid');
        isValid = false;
    } else {
        errorElement.textContent = '';
        username.classList.remove('is-invalid');
    }

    return isValid;
}