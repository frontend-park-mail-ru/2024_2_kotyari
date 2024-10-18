import { router } from '../../../../services/app/init.js';
import {
  AuthViewInterface,
  errorViewInterface,
  LoginCredentials,
  SignInAPI,
  validateInterface,
} from '../types/types.js';
import { menuSignIn } from '../views/configs.js';


export class LoginPresenter {
  private api: SignInAPI;
  private view: AuthViewInterface;
  private readonly validate: validateInterface;
  private errorView: errorViewInterface;

  constructor(view: AuthViewInterface, api: SignInAPI, errorView: errorViewInterface, validate: validateInterface) {
    this.view = view;
    this.api = api;
    this.errorView = errorView;
    this.validate = validate;
  }

  init = () => {
    this.view.render()
      .then(() => {
        this.attachLoginHandler();
        this.attachLinkNavigationHandler();
        this.attachValidateHandler();
      })
      .catch(err => {
        console.error(err);
      });
  };

  private attachLoginHandler = () => {
    const loginButton = document.getElementById(menuSignIn.formId);
    if (loginButton) {
      loginButton.addEventListener('click', this.handleLogin);
    }
  };

  private handleLogin = (event: Event) => {
    event.preventDefault();

    const emailInput = (document.getElementById('email') as HTMLInputElement).value;
    const passwordInput = (document.getElementById('password') as HTMLInputElement).value;

    const credentials: LoginCredentials = {
      email: emailInput,
      password: passwordInput,
    };

    this.api.login(credentials)
      .then((response) => {
        if (response.ok) {
          this.removeEventListeners();
          this.view.update(credentials.email); // Обновляем UI с именем пользователя

          router.navigate('/');
        }
      })
      .catch((error) => {
        console.error('Ошибка при логине:', error);
        this.errorView.displayBackError(error)
        this.errorView.displayBackError(error);
      });
  };

  private attachLinkNavigationHandler = () => {
    const signupLink = document.querySelector('a[router="changed-active"]');
    if (signupLink) {
      signupLink.addEventListener('click', (event) => {
        event.preventDefault();
        router.navigate(menuSignIn.link.href);
      });
    }
  };

  private removeEventListeners = () => {
    const loginButton = document.getElementById(menuSignIn.formId);
    if (loginButton) {
      loginButton.removeEventListener('click', this.handleLogin);
    }

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    if (emailInput) {
      emailInput.removeEventListener('focusout', this.validate.validateEmail.bind(this.validate, emailInput));
    }
    if (passwordInput) {
      passwordInput.removeEventListener('focusout', this.validate.validatePassword.bind(this.validate, passwordInput));
    }
  };

  private attachValidateHandler = () => {
    document.querySelectorAll('input[id^="login"]').forEach((input) => {
      const inputElement = input as HTMLInputElement;
      inputElement.addEventListener('focusout', () => {
        const inputType = inputElement.id;
        switch (inputType) {
          case menuSignIn.fields[0].id:
            this.validate.validateEmail(inputElement);
            break;
          case menuSignIn.fields[1].id:
            this.validate.validatePassword(inputElement);
            break;
        }
      });
    });
  };
}
