/**
 * Объект `menuSignUp` описывает структуру модального окна для формы регистрации.
 *
 * @namespace menuSignUp
 * @property {string} id - Идентификатор модального окна.
 * @property {string} logo - Название или логотип, отображаемый в окне регистрации.
 * @property {string} title - Заголовок формы регистрации.
 * @property {string} formId - Идентификатор формы регистрации.
 * @property {Object[]} fields - Массив объектов, описывающих поля формы.
 * @property {string} fields[].id - Идентификатор поля ввода.
 * @property {string} fields[].label - Метка для поля ввода.
 * @property {string} fields[].type - Тип поля ввода (например, текст или пароль).
 * @property {string} fields[].name - Имя поля ввода (атрибут name).
 * @property {string} fields[].placeholder - Текст подсказки для поля ввода.
 * @property {string} fields[].error_id - Идентификатор элемента для отображения ошибки.
 * @property {string} submitText - Текст кнопки отправки формы.
 * @property {Object} link - Объект, описывающий ссылку под формой.
 * @property {string} link.href - Ссылка на другую страницу (например, на страницу входа).
 * @property {string} link.text - Текст ссылки.
 * @property {string} link.label - Лейбл, который будет отображаться рядом со ссылкой.
 */
export const menuSignUp = {
  id: 'modal__signup',
  logo: 'oxic',
  title: 'Регистрация',
  formId: 'register__form',
  fields: [
    {
      id: 'signup_username',
      label: 'Ваше имя',
      type: 'text',
      name: 'username',
      placeholder: 'Иван',
      error_id: 'signup_nicknameError',
    },
    {
      id: 'signup_email',
      label: 'Почта',
      type: 'text',
      name: 'email',
      placeholder: 'myemail@example.com',
      error_id: 'signup_emailError',
    },
    {
      id: 'signup_password',
      label: 'Пароль',
      type: 'password',
      name: 'password',
      placeholder: 'Введите ваш пароль',
      error_id: 'signup_passwordError',
    },
    {
      id: 'signup_password_repeat',
      label: 'Повторите пароль',
      type: 'password',
      name: 'password_repeat',
      placeholder: 'Повторите пароль',
      error_id: 'signup_passwordRepeatError',
    },
  ],
  submitText: 'Регистрация',
  link: {
    href: 'login',
    text: 'Есть аккаунт?',
    label: 'Войти',
  },
};

/**
 * Объект `menuSignIn` описывает структуру модального окна для формы входа.
 *
 * @namespace menuSignIn
 * @property {string} id - Идентификатор модального окна.
 * @property {string} logo - Название или логотип, отображаемый в окне входа.
 * @property {string} title - Заголовок формы входа.
 * @property {string} formId - Идентификатор формы входа.
 * @property {string} error_msg - Сообщение об ошибке, которое может быть отображено в случае неудачного входа.
 * @property {Object[]} fields - Массив объектов, описывающих поля формы.
 * @property {string} fields[].id - Идентификатор поля ввода.
 * @property {string} fields[].label - Метка для поля ввода.
 * @property {string} fields[].type - Тип поля ввода (например, текст или пароль).
 * @property {string} fields[].name - Имя поля ввода (атрибут name).
 * @property {string} fields[].placeholder - Текст подсказки для поля ввода.
 * @property {string} fields[].error_id - Идентификатор элемента для отображения ошибки.
 * @property {string} submitText - Текст кнопки отправки формы.
 * @property {Object} link - Объект, описывающий ссылку под формой.
 * @property {string} link.href - Ссылка на другую страницу (например, на страницу регистрации).
 * @property {string} link.text - Текст ссылки.
 * @property {string} link.label - Лейбл, который будет отображаться рядом со ссылкой.
 */
export const menuSignIn = {
  id: 'modal__login',
  logo: 'oxic',
  title: 'Вход',
  formId: 'login__form',
  error_msg: '',
  fields: [
    {
      id: 'login_email',
      label: 'Почта',
      type: 'text',
      name: 'email',
      placeholder: 'myemail@example.com',
      error_id: 'login_emailError',
    },
    {
      id: 'login_password',
      label: 'Пароль',
      type: 'password',
      name: 'password',
      placeholder: 'Введите ваш пароль',
      error_id: 'login_passwordError',
    },
  ],
  submitText: 'Войти',
  link: {
    href: 'signup',
    text: 'Нет аккаунта?',
    label: 'Зарегистрироваться',
  },
};
