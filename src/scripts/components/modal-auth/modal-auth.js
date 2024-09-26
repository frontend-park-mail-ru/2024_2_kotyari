import {templatize} from "../../constprograms/shablon.js";
import {errors} from "../../errors/errors.js";


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

    removeInputError(email, errorElement);

    if (!emailRegex.test(email.value)) {
        addInputError(email, errorElement, 'Неверный формат почты.')
        isValid = false;
    } else {
        removeInputError(email, errorElement);
    }

    return isValid;
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
        isValid = false;
    } else {
        removeInputError(password, errorElement);
        removeInputError(passwordRepeat, errorRepeatElement);
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