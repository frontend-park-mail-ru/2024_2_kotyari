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
                    event.code === 'Escape'
                ) {
                    modalElem.style.opacity = '0';

                    setTimeout(() => {
                        modalElem.style.visibility = 'hidden';
                    }, time);

                    window.removeEventListener('keydown', closeModal);
                }
            };

            const openModal = () => {
                console.log(modalElem);
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

