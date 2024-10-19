export type LoginCredentials = {
  email: string;
  password: string;
}

export type SignUpCredentials = {
  username: string;
  email: string;
  password: string;
  repeat_password: string;
}

export type response = {
  ok: boolean;
  errorMsg?: string;
}

export interface validateInterface {
  validateEmail(email: HTMLInputElement): boolean;

  validatePassword(password: HTMLInputElement): boolean;

  validateUsername(username: HTMLInputElement): boolean;

  validatePasswordRepeat(password: HTMLInputElement, repeatPassword: HTMLInputElement): boolean;
}

export interface errorViewInterface {
  displayBackError(message: string): void;

  removeInputError(element:HTMLElement, errorElement:HTMLElement): void;

  addInputError(element: HTMLElement, errorElement: HTMLElement, msg: string) :void;
}

export interface AuthViewInterface {
  updateAfterAuth (username: string): void ;
  render(): Promise<void>

  updateAfterLogout(): void;
}

export interface SignInAPI {
  login(credentials: LoginCredentials): Promise<response>;
  logout():Promise<boolean>;
}

export interface SignUpAPI {
  signup(credentials: SignUpCredentials): Promise<response>;
}