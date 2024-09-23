export const modalSignUp = {
    id: "modal__signup",
    logo: 'ОКСИК',
    title: 'Регистрация',
    formId: 'register-form',
    fields: [
        { id: 'username', label: 'Ваше имя', type: 'text', name: 'username', required: true },
        { id: 'email', label: 'Почта', type: 'email', name: 'email', required: true },
        { id: 'password', label: 'Пароль', type: 'password', name: 'password', required: true },
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
        { id: 'email', label: 'Почта', type: 'email', name: 'email', required: true },
        { id: 'password', label: 'Пароль', type: 'password', name: 'password', required: true },
    ],
    submitText: 'Войти',
    link: {
        text: 'Нет аккаунта?',
        href: '/sign_up',
        label: 'Зарегистрироваться',
    },
};

