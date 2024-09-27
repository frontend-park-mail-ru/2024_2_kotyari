// Константа времени жизни cookie в миллисекундах (2 часа)
export const COOKIEEXPIRATION = 2 * 60 * 60 * 1000; // 2 часа в миллисекундах

export const setCookie = (name, value, expirationTime) => {
    let date = new Date();
    date.setTime(date.getTime() + expirationTime);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

export const getCookie = (name) => {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
};

export const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999;path=/`;
};