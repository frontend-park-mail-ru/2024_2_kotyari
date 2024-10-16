export class Helper {
    /**
     * Функция для преобразования формата даты из '2024-10-15' в '15 октября 2024 г.'
     *
     * @param {string} dateStr - Дата в формате строки 'YYYY-MM-DD'.
     * @returns {string} Дата в формате 'DD месяц YYYY г.'.
     */
    static formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const monthName = this.months[month - 1]; // month в строке начинается с 1, а в массиве месяцев — с 0
        return `${day} ${monthName} ${year} г.`;
    }
    /**
     * Функция для выбора правильной формы существительного в зависимости от числа.
     *
     * @param {number} number - Число, для которого нужно выбрать правильную форму существительного.
     * @param {string} one - Форма существительного для числа 1.
     * @param {string} two - Форма существительного для чисел 2-4.
     * @param {string} five - Форма существительного для чисел 5 и больше, а также для 0.
     *
     * @returns {string} Правильная форма существительного.
     */
    static pluralize(number, one, two, five) {
        const n = Math.abs(number) % 100;
        const lastDigit = n % 10;
        if (n >= 11 && n <= 14) {
            return five; // Исключения для 11-14
        }
        if (lastDigit === 1) {
            return one;
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
            return two;
        }
        return five;
    }
    /**
     * Функция 'eq' для сравнения двух значений.
     *
     * @param {*} a - Первое значение для сравнения.
     * @param {*} b - Второе значение для сравнения.
     * @returns {boolean} Возвращает true, если значения равны, иначе false.
     */
    static eq(a, b) {
        return a === b;
    }
}
Helper.months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];
//# sourceMappingURL=helper.js.map