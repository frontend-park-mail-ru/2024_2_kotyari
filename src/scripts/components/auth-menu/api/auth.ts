import { AUTH_URLS } from './config.js';
import { authResponse, ErrorResponse, LoginCredentials, SignUpCredentials } from '../types/types.js';
import { IUser } from '../../../../services/types/types';
import { post } from '../../../../services/api/without-csrf';

export default class AuthAPI {
  private config = AUTH_URLS;
  private readonly backUrl: string;

  constructor(backUrl: string) {
    this.backUrl = backUrl;
  }

  login = (credentials: LoginCredentials): Promise<authResponse> => {
    return post(this.backUrl + this.config.LOGIN.route, credentials)
      .then((res) => {
        switch (res.status){
          case 200:
            return { status: res.status, body: res.body as IUser };
          case 401:
            return { status: res.status, body: { error_message: res.body.error_message } as ErrorResponse };
          default:
            return { status: res.status, body: res.body as ErrorResponse };

        }
      });
  };

  signup = (credentials: SignUpCredentials): Promise<authResponse> => {
    return post(this.backUrl + this.config.SIGNUP.route, credentials)
      .then((res) => {
        switch (res.status) {
          case 200:
            return { status: res.status, body: res.body as SignUpCredentials };
          default:
            return { status: res.status, body: { error_message: res.body.error_message }as ErrorResponse };
        }
      });
  };

  logout = (): Promise<boolean> => {
    return post(this.backUrl+ '/logout', {})
      .then((res) => {
        if (res.status === 204) {
          return true;
        }

        throw Error(`ошибка сервера ${res.status} - ${res.body.error_message}`);
      })
      .catch((err) => {
        //// console.error(err);
        return false;
      });
  };
}
