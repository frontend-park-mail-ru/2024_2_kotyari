// todo вставка в хэдер

export const RouteConfig = {
  HOME: {
    route: '/',
    handler: 'catalog',
    isPrivate: false,
  },
  CATALOG: {
    route: '/catalog',
    handler: 'catalog',
    isProtected: false,
  },
  RECORDS: {
    route: '/records',
    handler: 'records',
    isProtected: true,
  },
  CHANGE_CITY: {
    route: '/change_city',
    handler: 'changeCity',
    isProtected: false,
  },
  BASKET: {
    route: '/cart',
    handler: 'cart',
    isProtected: true,
  },
  FAVORITE: {
    route: '/favorites',
    handler: 'favorites',
    isProtected: true,
  },
  PRODUCT: {
    route: '/product',
    handler: 'product',
    isProtected: false,
  },
  LOGOUT: {
    route: '/logout',
    handler: 'logout',
    isProtected: true,
  },
  SIGNUP: {
    route: '/signup',
    handler: 'signup',
    isProtected: false,
  },
  LOGIN: {
    route: '/login',
    handler: 'login',
    isProtected: false,
  },
  ERROR: {
    route: '/error/404',
    handler: 'error',
    isProtected: false,
  },
  ACCOUNT: {
    route: '/account',
    handler: 'account',
    isProtected: true,
  },
};
