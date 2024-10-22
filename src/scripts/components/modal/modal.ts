import Handlebars from 'handlebars';
import { BuildModalOptions, ModalControllerParams } from './types';
import modal from './modal.hbs?raw';

/**
 * Создает и отображает модальное окно с заданным контентом.
 *
 * Эта функция генерирует модальное окно, используя предоставленный шаблон и данные.
 * Если имя пользователя пустое, функция завершает выполнение.
 * После рендеринга модального окна устанавливается контроллер для управления его открытием и закрытием.
 *
 * @param {BuildModalOptions} options - Параметры модального окна.
 * @returns {Promise<void> | undefined} Промис, который разрешается после успешного отображения модального окна, или undefined, если имя пользователя пустое.
 */

export async function buildModalWithContent({
                                              user,
                                              triggerElement,
                                              rootId,
                                              modalID,
                                              data,
                                            }: BuildModalOptions): Promise<void | undefined> {
  if (user.name === '') {
    return;
  }

  const root = document.getElementById(rootId) as HTMLElement | null;

  if (!root) {
    console.error(`Root element with id ${rootId} not found.`);
    return;
  }

  try {
    const compiled = Handlebars.compile(modal);
    const templateElement = document.createElement('div');
    templateElement.innerHTML = compiled(data); // Рендерим шаблон с данными

    root.innerHTML = '';
    root.appendChild(templateElement);

    const modalController = ({ modal, btnOpen, btnClose, time = 300 }: ModalControllerParams) => {
      const btn = document.getElementById(btnOpen) as HTMLElement | null;
      const modalElem = document.getElementById(modal) as HTMLElement | null;

      if (!btn || !modalElem) {
        console.error('Modal or button not found.');
        return;
      }

      modalElem.style.cssText = `
        display: flex;
        visibility: visible;
        opacity: 1;
        transition: opacity ${time}ms ease-in-out;
      `;

      const closeModal = (event: Event | KeyboardEvent) => {
        const target = event.target as HTMLElement;

        if (target === modalElem || (btnClose && target.closest(btnClose)) || (event instanceof KeyboardEvent && event.code === 'Escape')) {
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

      const form = document.getElementById(data.formId) as HTMLFormElement | null;
      if (form) {
        form.addEventListener('submit', (event: Event) => {
          event.preventDefault();

          const formData = new FormData(form);
          handleFormSubmission(data.id, formData, user);

          // Закрытие модального окна
          modalElem.style.opacity = '0';
          setTimeout(() => {
            modalElem.style.visibility = 'hidden';
          }, time);
        });
      }
    };

    modalController({
      modal: modalID,
      btnOpen: triggerElement,
      btnClose: '.btn__close',
    });

  } catch (err) {
    console.error('Error rendering modal:', err);
  }
}

function updateUserInfo(updatedUser: { name: string; gender: string; email: string }, user: any) {
  Object.assign(user, updatedUser);

  document.querySelector('.user-name')!.textContent = updatedUser.name;

  const genderElement = document.querySelector('.description-item .description-value.gender') as HTMLElement;
  if (genderElement) {
    genderElement.textContent = updatedUser.gender;
  }

  const emailElement = document.querySelector('.description-item .description-value.email') as HTMLElement;
  if (emailElement) {
    emailElement.textContent = updatedUser.email;
  }
}

function updateAddress(updatedAddress: { address: string }, user: any) {
  user.address = updatedAddress.address;

  const addressElement = document.querySelector('.address-details .address-text') as HTMLElement;
  if (addressElement) {
    addressElement.textContent = updatedAddress.address;
  }
}

function handleFormSubmission(formId: string, formData: FormData, user: any) {
  switch (formId) {
    case 'edit_info':
      const updatedUser = {
        name: formData.get('name') as string,
        gender: formData.get('gender') as string,
        email: formData.get('email') as string,
      };
      updateUserInfo(updatedUser, user);
      break;

    case 'edit_address':
      const updatedAddress = {
        address: formData.get('address') as string,
      };
      updateAddress(updatedAddress, user);
      break;

    default:
      console.warn(`Unknown form id: ${formId}`);
  }
}
