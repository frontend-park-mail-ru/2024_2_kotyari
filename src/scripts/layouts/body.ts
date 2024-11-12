import { rootId } from '@/services/app/config';
import foot from './footer/footer.hbs?raw';
import head from './header/header.hbs?raw';
import body from './body.hbs?raw';
import search from '@/scripts/components/searcher/searcher.hbs';
import Handlebars from 'handlebars';
import {AddDropDown, handleHeaderScroll} from './header/header';
import { User } from '../../services/types/types';
import { defaultUser } from '../../services/storage/user';

/**
 * Функция для рендеринга основного содержимого страницы.
 *
 * Использует функцию `templatize` для вставки шаблона в элемент body на странице.
 *
 * @function
 * @param {Object} data - Данные, которые будут переданы в шаблон для рендеринга.
 * @returns {Promise<void>} Возвращает промис, который разрешается после завершения рендеринга.
 */
export function buildBody(data: any): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      // Вставляем тело страницы
      document.body.insertAdjacentHTML('beforeend', Handlebars.compile(body)({'root' : rootId}));

      const header = document.querySelector('header');
      const footer = document.querySelector('footer');

      if (header && footer) {
        header.innerHTML = '';
        footer.innerHTML = '';

        header.insertAdjacentHTML('beforeend', Handlebars.compile(head)(data));
        footer.insertAdjacentHTML('beforeend', Handlebars.compile(foot)());

        const searcher = document.getElementById('searcher');
        if (searcher) {
          searcher.innerHTML = '';
          searcher.insertAdjacentHTML('beforeend', Handlebars.compile(search)());
        } else {
          reject(new Error(`searcher -- ${search}`));
        }
        resolve();
      } else {
        reject(new Error(`нет footer ${footer} или header ${header}`));
      }
    })
      .then(() => {
          AddDropDown()
          handleHeaderScroll()
      })
      .catch((err) => {
        console.error(err);
      });
}



export const updateAfterAuth = (user: User): void => {
  const avatarElement = document.getElementById('avatar');
  if (!avatarElement) {
    console.error('avatarElement not found');
    return;
  }
  const nameElement = document.getElementById('name');
  if (!nameElement) {
    console.error('nameElement not found');
    return;
  }
  const cityElement = document.getElementById('user-city');
  if (!cityElement) {
    console.error('cityElement not found');
  }

  if (avatarElement) {
    avatarElement.innerHTML = `
      <a href="/account" router="stability-active" class="catalog-link">Личный кабинет</a>
      <a href="/logout" router="stability-active" id="logout" class="catalog-link">Выход</a>
    `;
  }

  if (nameElement) {
    nameElement.textContent = user.username;
    nameElement.classList.add('icon-label-hidden', 'catalog-link');
  }

  if (cityElement) {
    cityElement.textContent = user.city;
  }
};

export const updateAfterLogout = (user: User): void => {
  const avatarElement = document.getElementById('avatar');
  if (!avatarElement) {
    console.error('avatarElement not found');
    return;
  }
  const nameElement = document.getElementById('name');
  if (!nameElement) {
    console.error('nameElement not found');
    return;
  }
  const cityElement = document.getElementById('user-city');
  if (!cityElement) {
    console.error('cityElement not found');
    return;
  }

  if (user == undefined || user.city == null) {
    user = defaultUser;
  }

  if (avatarElement) {
    avatarElement.innerHTML = `<a href="/login" router="stability-active" class="catalog-link">Вход</a>
                        <a href="/signup" router="stability-active" class="catalog-link">Регистрация</a>`;
  }

  if (nameElement) {
    nameElement.textContent = 'Вход';
    nameElement.classList.add('icon-label-hidden', 'catalog-link');
  }

  if (cityElement) {
    cityElement.textContent = user.city;
  }
};
