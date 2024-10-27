import { errorViewInterface, validateInterface } from '../types/types.js';

export const clientErrors = {
  passwordTooShort: 'Пароль должен содержать не менее 8 символов.',
  passwordFormat: 'Пароль должен содержать заглавные, строчные буквы, цифру',
  passwordsDoNotMatch: 'Пароли должны совпадать',
  wrongEmailFormat: 'Неверный формат почты.',
  wrongUsernameLength: 'Имя должно быть от 2 до 40 символов.',
  wrongUsernameFormat: 'Имя может содержать только буквы, цифры, пробелы, а также "-" и "_"',
};

export class AuthValidate implements validateInterface {
  private errorView: errorViewInterface;

  constructor(errorView: errorViewInterface) {
    this.errorView = errorView;
  }

  validateUsername = (username: HTMLInputElement): any => {
    const usernameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9 _-]+$/;
    let isValid = true;
    const errorElementId = username.dataset.errorId || '';
    const errorElement = document.getElementById(errorElementId) as HTMLElement | null;
    const user = username.value;

    if (errorElement) this.errorView.removeInputError(username, errorElement);

    if (user.length < 2 || user.length > 40) {
      if (errorElement) this.errorView.addInputError(username, errorElement, clientErrors.wrongUsernameLength);
      isValid = false;
    } else if (!usernameRegex.test(user)) {
      if (errorElement) this.errorView.addInputError(username, errorElement, clientErrors.wrongUsernameLength);
      isValid = false;
    } else {
      if (errorElement) this.errorView.removeInputError(username, errorElement);
    }

    return isValid;
  };

  validatePassword = (password: HTMLInputElement): boolean => {
    let errorMsg: string | null = null;
    const errorElementId = password.dataset.errorId || '';
    const errorElement = document.getElementById(errorElementId) as HTMLElement | null;

    if (!this.isPasswordLongEnough(password.value)) {
      errorMsg = clientErrors.passwordTooShort;
    } else if (!this.isPasswordValidFormat(password.value)) {
      errorMsg = clientErrors.passwordFormat;
    }

    if (errorMsg) {
      if (errorElement) this.errorView.addInputError(password, errorElement, errorMsg);
      return false;
    } else {
      if (errorElement) this.errorView.removeInputError(password, errorElement);
      return true;
    }
  };

  isPasswordLongEnough(password: string, minLength = 8): boolean {
    return password.length >= minLength;
  }

  isPasswordValidFormat(password: string): boolean {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);

    return hasUppercase && hasLowercase && hasDigit;
  }

  validateEmail = (email: HTMLInputElement): boolean => {
    const emailRegex = /^[a-z0-9а-яё._%+-]+@[a-z0-9а-яё.-]+\.[a-zа-я]{2,}$/i;

    const errorElementId = email.dataset.errorId || '';
    const errorElement = document.getElementById(errorElementId) as HTMLElement | null;

    if (errorElement) this.errorView.removeInputError(email, errorElement);

    if (!emailRegex.test(email.value)) {
      if (errorElement) this.errorView.addInputError(email, errorElement, clientErrors.wrongEmailFormat);

      return false;
    }

    return true;
  };

  validatePasswordRepeat = (password: HTMLInputElement, repeatPassword: HTMLInputElement): boolean => {
    const errorElement = document.getElementById(repeatPassword.dataset.errorId || '');

    if (repeatPassword.value !== password.value) {
      const errorMsg = clientErrors.passwordsDoNotMatch;
      if (errorElement) this.errorView.addInputError(repeatPassword, errorElement, errorMsg);
      return false;
    } else {
      if (errorElement) this.errorView.removeInputError(repeatPassword, errorElement);
      return true;
    }
  };
}
