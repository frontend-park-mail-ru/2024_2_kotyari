import { AUTH_URLS } from './config.js';
import { LoginCredentials, response, SignUpCredentials } from '../types/types.js';

export default class AuthAPI {
  private config = AUTH_URLS;
  private backUrl: string;

  constructor(backUrl: string) {
    this.backUrl = backUrl;
  }

  login = (credentials: LoginCredentials): Promise<response> => {
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
      .then(res => {
        if (res.ok) {
          return { ok: true };
        } else if (res.status === 401) {
          return { ok: false, errorMsg: 'Пользователя не существует' };
        } else {
          return res.text().then(errorMsg => ({ ok: false, errorMsg }));
        }
      })
      .catch(err => {
        console.error('Ошибка при запросе:', err.message);
        return { ok: false, errorMsg: err };
      });
  };

  signup = (credentials: SignUpCredentials): Promise<response> => {
    return fetch(this.backUrl + this.config.SIGNUP.route, {
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
      .then(res => {
        if (res.ok) {
          console.log('Регистрация прошла успешно');
          return { ok: true };
        }

        return res.json().then(resJSON => {
          console.error('Ошибка регистрации:', resJSON.error_message);
          return { ok: false, errorMsg: resJSON.error_message };
        });
      })
      .catch(err => {
        console.error('Ошибка при запросе:', err.message);
        return { ok: false, errorMsg: err.message };
      });
  };
}