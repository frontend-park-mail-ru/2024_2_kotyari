import { errors } from '../../errors/errors.js';
import { partials } from './partials.js';

/**
 * Загружает partial-шаблон по указанному URL.
 *
 * @function loadPartial
 * @param {string} url - URL для загрузки partial-шаблона.
 * @returns {Promise<string>} - Возвращает промис с содержимым partial-шаблона.
 * @throws {Error} - Ошибка при загрузке partial-шаблона.
 */
function loadPartial(url) {
  return fetch(url)
    .then((response) => response.text())
    .catch((err) => {
      throw new Error(`Ошибка загрузки partial: ${url} - ${err}`);
    });
}

/**
 * Асинхронно регистрирует partial-шаблоны, включая их вложенные partials.
 *
 * @async
 * @function registerPartials
 * @param {Array<Object>} partialList - Список partial-шаблонов для регистрации.
 * @returns {Promise<void>} - Возвращает промис, который завершится после регистрации всех partial-шаблонов.
 * @throws {Error} - Ошибка при регистрации partial-шаблонов.
 */
async function registerPartials(partialList) {
  // Регистрируем все переданные partials
  const partialPromises = partialList.map(async (partial) => {
    const partialContent = await loadPartial(partial.partial);

    Handlebars.registerPartial(partial.name, partialContent);

    // Проверяем, есть ли вложенные partials для текущего partial
    if (partial.partial in partials) {
      // Рекурсивно загружаем вложенные partials
      await registerPartials(partials[partial.partial]);
    }
  });

  return Promise.all(partialPromises);
}

/**
 * Основная функция для загрузки и рендеринга Handlebars-шаблона.
 *
 * @async
 * @function templatize
 * @param {HTMLElement} root - Корневой элемент, куда будет рендериться шаблон.
 * @param {string} url - URL основного шаблона.
 * @param {Object} data - Данные для рендеринга шаблона.
 * @returns {Promise<void>} - Возвращает промис, который рендерит шаблон с переданными данными.
 * @throws {Error} - Ошибка при загрузке и рендеринге шаблона.
 */

export async function templatize(root, url, data) {
  try {
    if (url in partials) {
      // Регистрируем partials
      await registerPartials(partials[url]);
    }

    // Загружаем основной шаблон через AJAX
    const response = await fetch(url);
    const templateSource = await response.text();

    // Компилируем и рендерим шаблон

    const template = Handlebars.compile(templateSource);

    root.innerHTML = template(data);
  } catch (err) {
    // Обработка ошибок
    errors.TemplatizerError(err);
  }
}
