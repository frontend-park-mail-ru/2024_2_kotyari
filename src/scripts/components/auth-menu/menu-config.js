export const menuSignUp = {
    id: "modal__signup",
    logo: 'Оксик',
    title: 'Регистрация',
    formId: 'register__form',
    fields: [
        {
            id: 'signup_username',
            label: 'Ваше имя',
            type: 'text',
            name: 'username',
            placeholder: 'Иван',
            error_id: "signup_nicknameError",
        },
        {
            id: 'signup_email',
            label: 'Почта',
            type: 'text',
            name: 'email',
            placeholder: 'myemail@example.com',
            error_id: "signup_emailError",
        },
        {
            id: 'signup_password',
            label: 'Пароль',
            type: 'password',
            name: 'password',
            placeholder: 'Введите ваш пароль',
            error_id: "signup_passwordError",
        },
        {
            id: 'signup_password_repeat',
            label: 'Повторите пароль',
            type: 'password',
            name: 'password_repeat',
            placeholder: 'Повторите пароль',
            error_id: "signup_passwordRepeatError",
        },
    ],
    submitText: 'Регистрация',
    link: {
        href: 'login',
        text: 'Есть аккаунт?',
        label: 'Войти',
    },
};

export const menuSignIn = {
    id: "modal__login",
    logo: 'Оксик',
    title: 'Вход',
    formId: 'login__form',
    fields: [
        {
            id: 'login_email',
            label: 'Почта',
            type: 'text',
            name: 'email',
            placeholder: 'myemail@example.com',
            error_id: "login_emailError",
        },
        {
            id: 'login_password',
            label: 'Пароль',
            type: 'password',
            name: 'password',
            placeholder: 'Введите ваш пароль',
            error_id: "login_passwordError",
        },
    ],
    submitText: 'Войти',
    link: {
        href: 'signup',
        text: 'Нет аккаунта?',
        label: 'Зарегистрироваться',
    },
};