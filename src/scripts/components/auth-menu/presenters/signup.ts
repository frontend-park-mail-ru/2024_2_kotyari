import {
  authResponse,
  AuthViewInterface,
  ErrorResponse,
  errorViewInterface,
  SignUpAPI,
  validateInterface,
} from '../types/types';
import { menuSignIn, menuSignUp } from '../views/configs.js';
import { storageUser } from '../../../../services/storage/user';
import { IRouter, IUser } from '../../../../services/types/types';
import { updateAfterAuth } from '../../../layouts/body';

export class SignUpPresenter {
  private api: SignUpAPI;
  private view: AuthViewInterface;
  private validate: validateInterface;
  private errorView: errorViewInterface;
  private router: IRouter;

  constructor(
    view: AuthViewInterface,
    api: SignUpAPI,
    errorView: errorViewInterface,
    validate: validateInterface,
    router: IRouter,
  ) {
    this.view = view;
    this.api = api;
    this.errorView = errorView;
    this.validate = validate;
    this.router = router;
  }

  init = () => {
    this.view.render();
    this.attachSignUpHandler();
    this.attachValidateHandler();
  };

  attachSignUpHandler = () => {
    const signUpForm = document.getElementById(menuSignUp.formId);
    if (signUpForm) {
      signUpForm.addEventListener('submit', this.handleSignUp);
    } else {
      //// console.warn('Форма для регистрации не найдена!');
    }
  };

  private handleSignUp = (event: SubmitEvent) => {
    event.preventDefault();

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

    this.api
      .signup(credentials)
      .then((response: authResponse) => {
        if (response.status === 200) {
          const userInfo = response.body as IUser;
          storageUser.saveUserData(userInfo);
          updateAfterAuth(userInfo);

          this.router.navigate('/');
          return;
        }

        const error = response.body as ErrorResponse;
        //// console.error('Login error:', error.error_message);
        this.errorView.displayBackError(error.error_message ?? 'неизвестная ошибка');
      })
      .catch((error: authResponse) => {
        const errorBody = error.body as ErrorResponse;
        //// console.error('Ошибка при логине:', errorBody.error_message);
        this.errorView.displayBackError(errorBody.error_message);
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
              document.getElementById(menuSignUp.fields[2].id) as HTMLInputElement,
              document.getElementById(menuSignUp.fields[3].id) as HTMLInputElement
            );
            break;
        }
      });
    });
  };
}
