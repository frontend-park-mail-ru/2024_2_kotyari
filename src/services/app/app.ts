import { router, buildMain, isAuth, LoginView } from './init.js';
import { CLICK_CLASSES, urlAttribute } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  isAuth()
    .then(user => {
      console.log(user);
      LoginView.updateAfterAuth(user.name);
      return buildMain({ name: user.name, city: user.city });
    })
    .then(() => {
      router.init();

      let routes = document.querySelectorAll(`[router="${CLICK_CLASSES.stability}"]`);

      routes.forEach(route => {
        let href = route.getAttribute(urlAttribute);
        if (href) {
          route.addEventListener('click', event => {
            event.preventDefault();
            if (href)
              router.navigate(href, true);
          });
        }
      });
    })
    .catch((err) => {
      console.error('Error during app initialization:', err);
    });
});
