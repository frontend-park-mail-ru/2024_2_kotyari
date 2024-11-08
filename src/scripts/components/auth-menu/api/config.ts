export const AUTH_URLS = {
  LOGIN: {
    route: '/login',
    name: 'Вход',
    REG_EXP: new RegExp('^/login$'),
  },
  SIGNUP: {
    route: '/signup',
    name: 'Регистрация',
    REG_EXP:new RegExp('^/signup$'),
  },
};
