import { IUser, User } from '../../../../services/types/types';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  username: string;
  email: string;
  password: string;
  repeat_password: string;
};

export type ErrorResponse = {
  error_message: string;
};

export type authResponse = {
  status: number;
  body: IUser | ErrorResponse;
};

export interface validateInterface {
  validateEmail(email: HTMLInputElement): boolean;

  validatePassword(password: HTMLInputElement): boolean;

  validateUsername(username: HTMLInputElement): boolean;

  validatePasswordRepeat(password: HTMLInputElement, repeatPassword: HTMLInputElement): boolean;
}

export interface errorViewInterface {
  displayBackError(message: string): void;

  removeInputError(element: HTMLElement, errorElement: HTMLElement): void;

  addInputError(element: HTMLElement, errorElement: HTMLElement, msg: string): void;
}

export interface AuthViewInterface {
  updateAfterAuth(user: IUser): void;

  render(): void;

  updateAfterLogout(user: User): void;
}

export interface SignInAPI {
  login(credentials: LoginCredentials): Promise<authResponse>;
  logout(): Promise<boolean>;
}

export interface SignUpAPI {
  signup(credentials: SignUpCredentials): Promise<authResponse>;
}
