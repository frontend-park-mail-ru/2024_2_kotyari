import { buildMain, LoginView, router } from './init.js';
import { backurl, CLICK_CLASSES, urlAttribute } from './config.ts';
import { storageUser } from '../storage/user';
import { User } from '../types/types';
import { registerFunctions } from '../../scripts/constprograms/helperName';

document.addEventListener('DOMContentLoaded', () => {
  return registerFunctions().then(() => {
    fetch(backurl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => {
        console.log(res.status);

        if (res.ok) {
          return res.json()
            .then((data) => {
              data = data.body
              console.log('NEED:  -',data);

              return { name: data.name, city: data.city };
            });
        }

        if (res.status === 401) {
          return { name: '', city: 'Москва' };
        }

        throw Error(`Внутренняя ошибка сервера ${res.status}`);
      })
      .catch((err) => {
        console.error(err);
        return { name: '', city: 'Москва' };
      })
      .then((user) => {
        storageUser.saveUserData(user as User);

        return user;
      })
      .then((user) => {
        console.log('USER: ', user);


        LoginView.updateAfterAuth(user.name);
        buildMain({ name: user.name, city: user.city })
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
          })
      })
      .catch((err) => {
        console.error('Error during app initialization:', err);
      });
  })
});
