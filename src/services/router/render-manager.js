import { buildBody } from '../../scripts/layouts/body.js';

/**
 * Значение атрибуда router для элементов с кликабельными ссылками.
 * @enum {string}
 */
export const CLICK_CLASSES = {
  stability: 'stability-active',
  overrideable: 'changed-active',
};

export class RenderManager {
  constructor(rootElementId) {
    this.rootElementId = rootElementId
  }

  async buildMain (user) {
    if (!user) {
      user = { name: '', city: 'Москва' };
    }

    let { name, city } = user;

    if (!user) {
      city = 'Москва';
    }

    return buildBody({ name: name, city: city });
  };

  renderWithHandlers = (mainPart) => {
    const main = document.getElementById(this.rootElementId);
    if (!main) {
      throw new Error(`root element id element is require ${main}`);
    }

    main.classList.add('invisible');
    this.removeAllHandlers(); // Удаляем все события перед рендером новой страницы

    return mainPart().then(() => {

      setTimeout(function () {
        main.classList.remove('invisible');
      }, 500); // Небольшая задержка для срабатывания transition

      main.classList.remove('show');
    });
  };

  removeAllHandlers = () => {
    let anchors = document.querySelectorAll(CLICK_CLASSES.overrideable);

    anchors.forEach((anchor) => {
      anchor.onclick = null; // Удаляем обработчики событий
    });
  };
}
