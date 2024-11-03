import { LoginView, router } from './init.js';
import { backurl, CLICK_CLASSES, rootId, urlAttribute } from './config.ts';
import { defaultUser, storageUser } from '../storage/user';
import { User } from '../types/types';
import { registerFunctions } from '../../scripts/constprograms/helperName';
import { ErrorResponse } from '../../scripts/components/auth-menu/types/types';
import { categoryStorage } from '../storage/category';
import { buildBody } from '../../scripts/layouts/body';


export const buildMain = (user: User): Promise<void> => {
  return buildBody({ rootId }).then(() => {
    if (user.username === '') {
      LoginView.updateAfterLogout(user);
    } else {
      LoginView.updateAfterAuth(user);
    }
  });
};


document.addEventListener('DOMContentLoaded', () => {
  return registerFunctions()
    .then(() => {
      fetch(backurl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then(res => {

          console.log(res.status);
          switch (res.status) {
            case 200:
              return res.body as User;
            case 401:
              console.log(res.body as ErrorResponse);
              return defaultUser;
          }

          throw Error(`ошибка ${res.status}`);
        })
        .then((user) => {
          storageUser.saveUserData(user as User);

          return user;
        })
        .then((user: User) => {
          console.log('USER: ', user);

          buildMain(user)
            .then(() => {
              router.init();

              let routes = document.querySelectorAll(`[router="${CLICK_CLASSES.stability}"]`);

              routes.forEach((route) => {
                let href = route.getAttribute(urlAttribute);
                if (href) {
                  route.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (href) router.navigate(href, true);
                  });
                }
              });
            });
          return user;
        })

        .catch((err) => {
          console.error('Error during app initialization:', err);
        });
    })
    .then(() => {
      fetch(backurl + '/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then(r => {
          if (!r.ok) {
            throw new Error(r.statusText);
          }

          return r.json();
        })
        .then((data) => data.body)
        .then(data => {
          categoryStorage.setCategories(data);
        });
    });
});
