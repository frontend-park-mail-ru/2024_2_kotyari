import { rootId } from '@/services/app/config';
import foot from './footer/footer.hbs?raw';
import head from './header/header.hbs?raw';
import body from './body.hbs?raw';
import search from '@/scripts/components/elements/searcher/searcher.hbs';
import Handlebars from 'handlebars';

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
        console.log('успешно');
      })
      .catch((err) => {
        console.log(err);
      });
}
