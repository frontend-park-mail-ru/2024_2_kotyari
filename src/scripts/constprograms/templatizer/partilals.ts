/**
 * Определяет структуру для подшаблонов (partials).
 *
 * @interface Partial
 * @property {string} name - Имя подшаблона, которое будет использоваться в основном шаблоне.
 * @property {string} partial - Путь к файлу подшаблона, который будет подключен.
 */
interface Partial {
  name: string;
  partial: string;
}

/**
 * Объект `partials` содержит маппинг основных шаблонов и их подшаблонов (partials).
 * Используется для динамической подстановки частичных шаблонов в Handlebars.
 *
 * @namespace partials
 * @property {Partial[]} '/src/scripts/layouts/body.hbs' - Частичные шаблоны для основного шаблона body.
 * @property {Partial[]} '/src/scripts/layouts/header/header.hbs' - Частичные шаблоны для шаблона header.
 */
export const partials: Record<string, Partial[]> = {
  '/src/scripts/layouts/body.hbs': [
    {
      name: 'header',
      partial: '/src/scripts/layouts/header/header.hbs',
    },
    {
      name: 'footer',
      partial: '/src/scripts/layouts/footer/footer.hbs',
    },
  ],

  '/src/scripts/layouts/header/header.hbs': [
    {
      name: 'searcher',
      partial: '/src/scripts/components/elements/searcher/searcher.hbs',
    },
  ],
};
