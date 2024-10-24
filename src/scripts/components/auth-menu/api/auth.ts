import { AUTH_URLS } from './config.js';
import {
  authResponse,
  ErrorResponse,
  LoginCredentials,
  SignUpCredentials,
  UserInfo,
} from '../types/types.js';
import { backurl } from '@/services/app/config.ts';

export default class AuthAPI {
  private config = AUTH_URLS;
  private readonly backUrl: string;

  constructor(backUrl: string) {
    this.backUrl = backUrl;
  }

  login = (credentials: LoginCredentials): Promise<authResponse> => {
    return fetch(this.backUrl + this.config.LOGIN.route, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json().then((resJSON) => {
            if ('username' in resJSON) {
              return { status: res.status, body: resJSON as UserInfo };
            } else {
              console.error('Ошибка авторизации:', resJSON.error_message);
              return { status: res.status, body: resJSON as ErrorResponse };
            }
          });
        } else if (res.status === 401) {
          return { status: res.status, body: { error_message: 'Пользователя не существует' } as ErrorResponse };
        } else {
          return res.json().then((resJSON) => {
            console.error('Ошибка авторизации:', resJSON.error_message);
            return { status: res.status, body: resJSON as ErrorResponse };
          });
        }
      })
      .catch((err) => {
        console.error('Ошибка при запросе:', err.message);
        return { status: 500, body: { error_message: err.message } as ErrorResponse };
      });
  };

  signup = (credentials: SignUpCredentials): Promise<authResponse> => {
    const url = this.backUrl + this.config.SIGNUP.route;
    return fetch(url, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        repeat_password: credentials.repeat_password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json().then((resJSON) => {
            if ('username' in resJSON) {
              return { status: res.status, body: resJSON as UserInfo };
            } else {
              console.error('Ошибка регистрации:', resJSON.error_message);
              return { status: res.status, body: resJSON as ErrorResponse };
            }
          });
        }

        return res.json().then((resJSON) => {
          console.error('Ошибка регистрации:', resJSON.error_message);
          return { status: res.status, body: resJSON as ErrorResponse };
        });
      })
      .catch((err) => {
        console.error('Ошибка при запросе:', err.message);
        return { status: 500, body: { error_message: err.message } as ErrorResponse };
      });
  };

  logout = (): Promise<boolean> => {
    return fetch(backurl + '/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 204) {
          return true;
        }

        throw Error(`ошибка сервера ${res.status}`);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };
}
