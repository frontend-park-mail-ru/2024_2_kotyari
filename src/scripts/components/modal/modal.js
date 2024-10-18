import { templatize } from '../../constprograms/templatizer/new-templatizer.js';
import { errors } from '../../errors/errors.js';

/**
 * Создает и отображает модальное окно с заданным контентом.
 *
 * Эта функция генерирует модальное окно, используя предоставленный шаблон и данные.
 * Если имя пользователя пустое, функция завершает выполнение.
 * После рендеринга модального окна устанавливается контроллер для управления его открытием и закрытием.
 *
 * @param {Object} user - Объект пользователя.
 * @param {string} triggerElement - Идентификатор элемента, который открывает модальное окно при клике.
 * @param {string} template - Путь к шаблону модального окна.
 * @param {string} rootId - Идентификатор корневого элемента для вставки модального окна.
 * @param {string} modalID - Идентификатор модального окна.
 * @param {Object} data - Данные для передачи в шаблон.
 * @returns {Promise|undefined} Промис, который разрешается после успешного отображения модального окна, или undefined, если имя пользователя пустое.
 */
export function buildModalWithContent(user, triggerElement, template, rootId, modalID, data) {
  if (user.name === '') {
    return;
  }

  const root = document.getElementById(rootId);

  return templatize(root, template, data)
    .then(() => {
      const modalController = ({ modal, btnOpen, btnClose, time = 300 }) => {
        const btn = document.getElementById(btnOpen);
        const modalElem = document.getElementById(modal);

        modalElem.style.cssText = `
                    display: flex;
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity ${time}ms ease-in-out;`;

        const closeModal = (event) => {
          const target = event.target;

          if (target === modalElem || (btnClose && target.closest(btnClose)) || event.code === 'Escape') {
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
        btnClose: '.btn__close',
      });
    })
    .catch((err) => {
      errors.TemplatizerError(err);
    });
}
