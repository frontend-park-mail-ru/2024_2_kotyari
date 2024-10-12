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
export function pluralize(number, one, two, five) {
    const n = Math.abs(number) % 100;
    const lastDigit = n % 10;

    // Создаем ключ на основе условий
    const key = (n >= 11 && n <= 14) ? 'exception' :
        (lastDigit === 0 || lastDigit >= 5) ? 'five' :
            (lastDigit === 1) ? 'one' :
                (lastDigit >= 2 && lastDigit <= 4) ? 'two' : 'five';

    // Обрабатываем ключ через switch
    switch (key) {
        case 'exception':
        case 'five':
            return five;
        case 'one':
            return one;
        case 'two':
            return two;
        default:
            return five;
    }
}
