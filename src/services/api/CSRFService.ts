import { apiResponse, parseJsonResponse } from './utils';
import { method, requestGetWithCredInfo, requestInfo } from './config';
import { backurl } from '../app/config';

export class CSRFService {
  private token: string | null = null;
  private readonly csrfEndpoint: string;

  constructor(csrfEndpoint: string) {
    this.csrfEndpoint = csrfEndpoint;
  }

  /**
   * Получает CSRF-токен с сервера и сохраняет его.
   */
  fetchToken(): Promise<void> {
    return fetch(this.csrfEndpoint, requestGetWithCredInfo)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка при получении CSRF-токена: ${response.statusText}`);
        }

        const csrfToken = response.headers.get('X-CSRF-Token');
        if (!csrfToken) {
          throw new Error('CSRF-токен не найден в ответе сервера');
        }

        this.token = csrfToken;
      })
      .catch(err => {
        console.error(err);
      });
  }

  /**
   * Формирует объект RequestInit с необходимыми заголовками и токеном CSRF.
   * @param method HTTP-метод запроса.
   * @param body Тело запроса.
   * @returns Конфигурация запроса или undefined, если токен отсутствует.
   */
  private getRequestInfo(method: string, body: any): RequestInit | undefined {
    if (!this.token) {
      return undefined;
    }

    const acceptHeader = 'application/json';

    const headers: HeadersInit = {
      'X-CSRF-Token': this.token,
      'Accept': acceptHeader,
      ...(!(body instanceof FormData) && { 'Content-Type': 'application/json' }),
    };

    const requestBody = body instanceof FormData ? body : JSON.stringify(body);

    return {
      method,
      credentials: 'include',
      headers,
      body: requestBody,
    };
  }

  /**
   * Выполняет защищённый запрос с использованием CSRF-токена.
   * @param url URL-адрес запроса.
   * @param method HTTP-метод.
   * @param body Тело запроса.
   * @returns Ответ API.
   */
  private protectedFetch = async (url: string, method: string, body: any): Promise<apiResponse> => {
    const info = this.getRequestInfo(method, body);
    if (!info) {
      return Promise.reject(new Error('Отсутствует конфигурация запроса (RequestInit)'));
    }

    const response = await fetch(url, info);
    return parseJsonResponse(response);
  };

  /**
   * Отправляет POST-запрос.
   * @param url URL-адрес запроса.
   * @param body Тело запроса.
   * @returns Ответ API.
   */
  post = (url: string, body: any): Promise<apiResponse> => {
    return this.protectedFetch(url, method.POST, body);
  };

  /**
   * Отправляет PUT-запрос.
   * @param url URL-адрес запроса.
   * @param body Тело запроса.
   * @returns Ответ API.
   */
  put = (url: string, body: any): Promise<apiResponse> => {
    return this.protectedFetch(url, method.PUT, body);
  };

  /**
   * Отправляет PATCH-запрос.
   * @param url URL-адрес запроса.
   * @param body Тело запроса.
   * @returns Ответ API.
   */
  patch = (url: string, body: any): Promise<apiResponse> => {
    return this.protectedFetch(url, method.PATCH, body);
  };

  /**
   * Отправляет DELETE-запрос.
   * @param url URL-адрес запроса.
   * @param body Тело запроса.
   * @returns Ответ API.
   */
  delete = (url: string, body: any): Promise<apiResponse> => {
    return this.protectedFetch(url, method.DELETE, body);
  };

  /**
   * Обновляет CSRF-токен, сбрасывая текущий и запрашивая новый.
   */
  async refreshToken(): Promise<void> {
    this.token = null;
    await this.fetchToken();
  }
}

const csrfRoute = `${backurl}/csrf`

export const csrf = new CSRFService(csrfRoute);
