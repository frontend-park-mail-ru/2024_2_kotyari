import {
  SignUpAPI,
  validateInterface,
  errorViewInterface,
  AuthViewInterface,
} from '../types/types';
import { menuSignIn, menuSignUp } from '../views/configs.js';
import { router } from '../../../../services/app/init.js';


export class SignUpPresenter {
  private api: SignUpAPI;
  private view: AuthViewInterface;
  private validate: validateInterface;
  private errorView: errorViewInterface;

  constructor(view: AuthViewInterface, api: SignUpAPI, errorView: errorViewInterface, validate: validateInterface) {
    this.view = view;
    this.api = api;
    this.errorView = errorView;
    this.validate = validate;
  }

  init = () => {
    this.view.render()
      .then(() => {
        this.attachSignUpHandler();
        this.attachValidateHandler();
      })
      .catch(err => {
        console.error(err);
      });
  };

  attachSignUpHandler = () => {
    const signUpForm = document.getElementById(menuSignUp.formId);
    if (signUpForm) {
      console.log('Форма для регистрации найдена:', signUpForm);
      signUpForm.addEventListener('submit', this.handleSignUp);
    } else {
      console.warn('Форма для регистрации не найдена!');
    }
  };

  private handleSignUp = (event : SubmitEvent) => {
    console.log('до preventDefault')
    event.preventDefault();
    console.log('Обработка события регистрации');


    const usernameInput = document.getElementById(menuSignUp.fields[0].id) as HTMLInputElement;
    const emailInput = document.getElementById(menuSignUp.fields[1].id) as HTMLInputElement;
    const passwordInput = document.getElementById(menuSignUp.fields[2].id) as HTMLInputElement;
    const passwordRepeatInput = document.getElementById(menuSignUp.fields[3].id) as HTMLInputElement;

    if (
      !this.validate.validateUsername(usernameInput) ||
      !this.validate.validateEmail(emailInput) ||
      !this.validate.validatePassword(passwordInput) ||
      !this.validate.validatePasswordRepeat(passwordInput, passwordRepeatInput)
    ) {
      return;
    }

    const credentials = {
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      repeat_password: passwordRepeatInput.value,
    };

    this.api.signup(credentials)
      .then(response => {
        if (response.ok) {
          router.navigate('/');
        } else {
          console.error('Signup error:', response.errorMsg);
          this.errorView.displayBackError(response.errorMsg ?? 'неизвестная ошибка');
        }
      })
      .catch(error => {
        console.error('Ошибка при регистрации:', error);
        this.errorView.displayBackError(error);
        console.error('Error during signup:', error);
      });

  };

  private attachValidateHandler = () => {
    document.querySelectorAll('input[id^="login"]').forEach((input) => {
      const inputElement = input as HTMLInputElement;
      inputElement.addEventListener('focusout', () => {
        const inputType = inputElement.id;
        switch (inputType) {
          case menuSignIn.fields[0].id: // Для имени пользователя
            this.validate.validateUsername(inputElement);
            break;
          case menuSignIn.fields[1].id: // Для почты
            this.validate.validateEmail(inputElement);
            break;
          case menuSignIn.fields[2].id: // Для пароля
            this.validate.validatePassword(inputElement);
            break;
          case menuSignIn.fields[3].id: // Для повторного пароля (если необходимо)
            this.validate.validatePasswordRepeat(
              (document.getElementById(menuSignUp.fields[2].id) as HTMLInputElement),
              (document.getElementById(menuSignUp.fields[3].id) as HTMLInputElement),
            );
            break;
        }
      });
    });
  };
}
