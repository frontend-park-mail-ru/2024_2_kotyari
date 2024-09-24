export const modalSignUp = {
    id: "modal__signup",
    logo: 'ОКСИК',
    title: 'Регистрация',
    formId: 'register__form',
    fields: [
        {
            id: 'username',
            label: 'Ваше имя',
            type: 'text',
            name: 'username',
            error_id: "nicknameError",
            required: true
        },
        {
            id: 'email',
            label: 'Почта',
            type: 'email',
            name: 'email',
            error_id: "emailError",
            required: true
        },
        {
            id: 'password',
            label: 'Пароль',
            type: 'password',
            name: 'password',
            error_id: "passwordError",
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
            id: 'email',
            label: 'Почта',
            type: 'email',
            name: 'email',
            error_id: "emailError",
            required: true
        },
        {
            id: 'password',
            label: 'Пароль',
            type: 'password',
            name: 'password',
            error_id: "passwordError",
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

