import { router, searcher } from './init.js';
import { backurl, CLICK_CLASSES, rootId, urlAttribute } from './config.ts';
import { defaultUser, storageUser } from '../storage/user';
import { User } from '../types/types';
import { registerFunctions } from '../../scripts/utils/helperName';
import { categoryStorage } from '../storage/category';
import { buildBody, updateAfterAuth, updateAfterLogout } from '../../scripts/layouts/body';
import { get, getWithCred } from '../api/without-csrf';
import { Category } from '../../scripts/components/category/api/category';


/**
 * Функция строит основной интерфейс приложения на основе данных пользователя.
 *
 * @param {User} user - Объект пользователя.
 * @returns {Promise<void>} Возвращает промис, который завершается после построения интерфейса.
 */
export const buildMain = (user: User): Promise<void> => {
  return buildBody({ rootId }).then(() => {
    if (user.username === '') {
      updateAfterLogout(user);
    } else {
      updateAfterAuth(user);
    }
  });
};

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.ts')
//       .then((registration) => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch((error) => {
//         console.error('Service Worker registration failed:', error);
//       });
//   });
// }

/**
 * Обработчик события загрузки DOMContentLoaded.
 * Инициализирует приложение: регистрирует функции, выполняет авторизацию пользователя,
 * строит интерфейс и настраивает маршрутизацию.
 */

document.addEventListener('DOMContentLoaded', () => {
    try {
        const hash = window.location.hash;
        if (hash && hash === '#review') {
            const reviewElement = document.getElementById('review');
            if (reviewElement) {
                reviewElement.scrollIntoView({behavior: 'smooth'}); // Плавный скролл
            }
        }

  return registerFunctions().then(() => {
    getWithCred(backurl + '/')
      .then((res) => {
        switch (res.status) {
          case 200:
            return res.body as User;
          case 401:
            return defaultUser;
        }

        throw Error(`ошибка ${res.status}`);
      })
      .then((user) => {
        storageUser.saveUserData(user as User);

        return user;
      })
      .then((user) => {
        buildMain(user).then(() => {
          router.init();

          const routes = document.querySelectorAll(`[router="${CLICK_CLASSES.stability}"]`);

          routes.forEach((route) => {
            const href = route.getAttribute(urlAttribute);
            if (href) {
              route.addEventListener('click', (event) => {
                event.preventDefault();
                if (href) router.navigate(href, true);
              });
            }
          });
        });

        searcher.initializeListeners();
        return user;
      })
      .then(() => {
        get(backurl + '/categories')
          .then((res) => {
            if (res.status !== 200) {
              throw Error('ошибка при загрузке категорий');
            }

            return res.body as Category[];
          })
          .then((data) => {
            categoryStorage.setCategories(data as Category[]);
          });
      })
      .catch((err) => {
        console.error('ошибка инициализации приложения:', err);
      });
  });
});
