export const modalSignUp = {
    id: "modal__signup",
    logo: 'ОКСИК',
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
            required: true
        },
        {
            id: 'signup_email',
            label: 'Почта',
            type: 'text',
            name: 'email',
            placeholder: 'myemail@example.com',
            error_id: "signup_emailError",
            required: true
        },
        {
            id: 'signup_password',
            label: 'Пароль',
            type: 'password',
            name: 'password',
            placeholder: 'Пароль',
            error_id: "signup_passwordError",
            required: true
        },
        {
            id: 'signup_password',
            label: 'Повторите пароль',
            type: 'password',
            name: 'password_repeat',
            placeholder: 'Повторите пароль',
            error_id: "signup_passwordRepeatError",
            required: true
        },
    ],
    submitText: 'Регистрация',
    link: {
        text: 'Есть аккаунт?',
        href: '/sign_in',
        label: 'Войти',
    },
};

export const modalSignIn = {
    id: "modal__login",
    logo: 'ОКСИК',
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
            required: true
        },
        {
            id: 'login_password',
            label: 'Пароль',
            type: 'password',
            name: 'password',
            placeholder: '',
            error_id: "login_passwordError",
            required: true
        },
    ],
    submitText: 'Войти',
    link: {
        text: 'Нет аккаунта?',
        href: '/sign_up',
        label: 'Зарегистрироваться',
    },
};