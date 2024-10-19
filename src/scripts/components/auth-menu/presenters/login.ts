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
        this.attachValidateHandler();
      })
      .catch(err => {
        console.error(err);
      });
  };

  private attachLoginHandler = () => {
    const loginButton = document.getElementById(menuSignIn.formId);
    if (loginButton) {
      console.log(loginButton);
      loginButton.addEventListener('submit', this.handleLogin);
    }
  };

  logout = ():void => {
    this.api.logout()
      .then(() =>{
        this.view.updateAfterLogout();
        router.navigate('/');
      })
      .catch(err => {
        console.error(err);
      })
  }

  private handleLogin = (event: SubmitEvent) => {
    event.preventDefault();

    const emailInput = document.getElementById(menuSignIn.fields[0].id) as HTMLInputElement;
    const passwordInput = document.getElementById(menuSignIn.fields[1].id) as HTMLInputElement;

    if (
      !this.validate.validateEmail(emailInput) ||
      !this.validate.validatePassword(passwordInput)
    ) {
      return;
    }

    const credentials: LoginCredentials = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    this.api.login(credentials)
      .then((response) => {
        if (response.ok) {
          this.view.updateAfterAuth(credentials.email); // Обновляем UI с именем пользователя

          router.navigate('/');
        }
      })
      .catch((error) => {
        console.error('Ошибка при логине:', error);
        this.errorView.displayBackError(error);
        this.errorView.displayBackError(error);
      });
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
