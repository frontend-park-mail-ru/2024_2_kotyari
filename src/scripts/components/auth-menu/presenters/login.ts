import {
  authResponse,
  AuthViewInterface, ErrorResponse,
  errorViewInterface,
  LoginCredentials,
  SignInAPI,
  validateInterface,
} from '../types/types.js';
import { menuSignIn } from '../views/configs.js';
import { IRouter, User } from '../../../../services/types/types';
import { storageUser } from '../../../../services/storage/user';

export class LoginPresenter {
  private api: SignInAPI;
  private view: AuthViewInterface;
  private readonly validate: validateInterface;
  private errorView: errorViewInterface;
  private router: IRouter;

  constructor(
    view: AuthViewInterface,
    api: SignInAPI,
    errorView: errorViewInterface,
    validate: validateInterface,
    router:  IRouter,
  ) {
    this.view = view;
    this.api = api;
    this.errorView = errorView;
    this.validate = validate;
    this.router = router;
  }

  init = () => {
    this.view.render();
    this.attachLoginHandler();
    this.attachValidateHandler();
  };

  private attachLoginHandler = () => {
    const loginButton = document.getElementById(menuSignIn.formId);
    if (loginButton) {
      console.log(loginButton);
      loginButton.addEventListener('submit', this.handleLogin);
    }
  };

  logout = (): void => {
    this.api
      .logout()
      .then(() => {
        this.view.updateAfterLogout();
        storageUser.clearUserData()
        this.router.navigate('/');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  private handleLogin = (event: SubmitEvent) => {
    event.preventDefault();

    const emailInput = document.getElementById(menuSignIn.fields[0].id) as HTMLInputElement;
    const passwordInput = document.getElementById(menuSignIn.fields[1].id) as HTMLInputElement;

    if (!this.validate.validateEmail(emailInput) || !this.validate.validatePassword(passwordInput)) {
      return;
    }

    const credentials: LoginCredentials = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    this.api
      .login(credentials)

      .then((response) => {
        if (response.status === 200) {
          const userInfo = response.body as User;

          storageUser.saveUserData(userInfo);
          this.view.updateAfterAuth(userInfo);
          this.router.navigate('/');
          return;
        }

        const error = response.body as ErrorResponse;
        console.error('Login error:', error.error_message);
        this.errorView.displayBackError(error.error_message ?? 'неизвестная ошибка');
      })
      .catch((error: authResponse) => {
        const errorBody = error.body as ErrorResponse;
        console.error('Ошибка при логине:', errorBody.error_message);
        this.errorView.displayBackError(errorBody.error_message);
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
