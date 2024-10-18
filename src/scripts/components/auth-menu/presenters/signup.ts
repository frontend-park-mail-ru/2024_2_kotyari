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
        this.attachLinkNavigationHandler();
        this.attachValidateHandler();
      })
      .catch(err => {
        console.error(err);
      });
  };

  attachSignUpHandler = () => {
    const signUpButton = document.getElementById(menuSignUp.formId);
    if (signUpButton) {
      signUpButton.addEventListener('click', this.handleSignUp);
    }
  };

  private handleSignUp = (event: Event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('signup_username') as HTMLInputElement;
    const emailInput = document.getElementById('signup_email') as HTMLInputElement;
    const passwordInput = document.getElementById('signup_password') as HTMLInputElement;
    const passwordRepeatInput = document.getElementById('signup_password_repeat') as HTMLInputElement;

    if (!this.validate.validateUsername(usernameInput) || this.validate.validateEmail(emailInput)) {
      return;
    }

    if (this.validate.validatePasswordRepeat(passwordInput, passwordRepeatInput)) {
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

  private attachLinkNavigationHandler = () => {
    const loginLink = document.querySelector('a[router="changed-active"]');
    if (loginLink) {
      loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        router.navigate(menuSignUp.link.href);
      });
    }
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
