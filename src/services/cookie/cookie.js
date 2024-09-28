// Константа времени жизни cookie в миллисекундах (2 часа)
export const COOKIEEXPIRATION = 20 * 60 * 1000; // 20 минут в миллисекундах

export const setCookie = (name, value, expirationTime) => {
    let date = new Date();
    date.setTime(date.getTime() + expirationTime);
    document.cookie = `${name}=${JSON.stringify(value)};expires=${date.toUTCString()};path=/`;
};

export const getCookie = (name) => {
    let result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
};

export const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999;path=/`;
};
