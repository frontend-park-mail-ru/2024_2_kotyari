export const errors = {
    ShablonError: (error) => {
        console.error('Ошибка загрузки шаблона:', error);
    },
    GetCardsError: (error) => {
        console.error('Не удалось получить товары с сервера:', error);
    }
}
