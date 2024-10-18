import { router, buildMain, isAuth } from './init.js';

document.addEventListener('DOMContentLoaded', () => {
  isAuth('')
    .then(user => {
      buildMain({ name: user.name, city: user.city })
        .then(() => {
          router.init()
        });
    })
    .catch((err) => {
      console.error('Error during app initialization: ', err);
    });
});