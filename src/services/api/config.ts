/**
 * HTTP-методы, используемые в приложении.
 *
 * @readonly
 * @enum {string}
 */
export const method = {
  /** Метод POST для создания ресурсов */
  POST: 'POST',

  /** Метод PUT для обновления ресурсов */
  PUT: 'PUT',

  /** Метод DELETE для удаления ресурсов */
  DELETE: 'DELETE',

  /** Метод PATCH для частичного обновления ресурсов */
  PATCH: 'PATCH',

  /** Метод GET для получения ресурсов */
  GET: 'GET',
};

/**
 * Основные заголовки, используемые во всех HTTP-запросах.
 *
 * @type {HeadersInit}
 */
export const headers = {
  /** Заголовок, указывающий, что клиент ожидает получить данные в формате JSON */
  Accept: 'application/json',

  /** Заголовок, указывающий, что тело запроса отправляется в формате JSON */
  'Content-Type': 'application/json',
};

/**
 * Базовая конфигурация запроса, включающая общие заголовки.
 *
 * @type {RequestInit}
 */
export const requestInfo: RequestInit = {
  headers: new Headers({
    Accept: headers.Accept,
    'Content-Type': headers['Content-Type'],
  }),
};

/**
 * Конфигурация для GET-запросов без учёта учётных данных.
 *
 * @type {RequestInit}
 */
export const requestGetInfo: RequestInit = {
  /** Используемый HTTP-метод */
  method: method.GET,

  /** Распаковываем базовую конфигурацию запроса */
  ...requestInfo,
};

/**
 * Конфигурация для GET-запросов с учётом учётных данных (например, для отправки куки).
 *
 * @type {RequestInit}
 */
export const requestGetWithCredInfo: RequestInit = {
  /** Используемый HTTP-метод */
  method: method.GET,

  /** Указываем, что учётные данные (например, куки) должны быть включены в запрос */
  credentials: 'include',

  /** Распаковываем базовую конфигурацию запроса */
  ...requestInfo,
};

/**
 * Конфигурация для POST-запросов с учётом учётных данных.
 *
 * @type {RequestInit}
 */
export const requestPostInfo: RequestInit = {
  /** Используемый HTTP-метод */
  method: method.POST,

  /** Распаковываем базовую конфигурацию запроса */
  ...requestInfo,

  /** Указываем, что учётные данные (например, куки) должны быть включены в запрос */
  credentials: 'include',
};