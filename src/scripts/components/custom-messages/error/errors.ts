/**
 * Объект `errorsDescriptions` содержит описание текстов ошибок, которые отображаются при возникновении различных HTTP-ошибок.
 *
 * @namespace errorsDescriptions
 * @property {string} '404' - Описание ошибки 404 (Не найдено), отображаемое при попытке обращения к несуществующему адресу.
 */
export const errorsDescriptions: { [key: string]: string } = {
  404: 'Вы обращаетесь к несуществующему адресу.',
};
