/**
 * Вспомогательный класс с полезными утилитарными методами для форматирования дат,
 * выбора форм слов и сравнения значений.
 *
 * @class Helper
 */
export class Helper {
  /**
   * Массив с названиями месяцев на русском языке.
   *
   * @private
   * @type {string[]}
   */
  private static months: string[] = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  /**
   * Функция для преобразования формата даты из '2024-10-15' в '15 октября 2024 г.'
   *
   * @param {string} dateStr - Дата в формате строки 'YYYY-MM-DD'.
   * @throws {Error} Если формат даты некорректен.
   * @returns {string} Дата в формате 'DD месяц YYYY г.'.
   */
  public static formatDate(dateStr: string): string {
    const datePart = dateStr.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);

    if (!year || !month || !day || month < 1 || month > 12) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }

    const monthName = Helper.months[month - 1];

    return `${day} ${monthName} ${year} г.`;
  }

  /**
   * Склоняет слово в зависимости от числа.
   *
   * @param {number} count - Число для склонения.
   * @param {string} singular - Форма слова для единственного числа.
   * @param {string} few - Форма слова для нескольких объектов (2-4).
   * @param {string} many - Форма слова для множества объектов (5+).
   * @returns {string} Слово в правильной форме.
   */
  public static pluralize(count: number, singular: string, few: string, many: string): string {
    const n = Math.abs(count) % 100;
    const lastDigit = n % 10;

    if (n >= 11 && n <= 14) {
      return many; // Исключения для 11-14
    }

    if (lastDigit === 1) {
      return singular;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return few;
    }

    return many;
  }

  /**
   * Функция 'eq' для сравнения двух значений.
   *
   * @param {*} a - Первое значение для сравнения.
   * @param {*} b - Второе значение для сравнения.
   * @returns {boolean} Возвращает true, если значения равны, иначе false.
   */
  public static eq(a: any, b: any): boolean {
    return a === b;
  }

  /**
   * Проверка на пустоту
   *
   * @param {*} value - Первое значение для логического И.
   * @returns {boolean} Возвращает true, если значение - не пустота, иначе false.
   */
  public static isNotUndefined(value: any): boolean {
    return Boolean(value !== undefined);
  }

  /**
   * Проверка на не равенство 0
   *
   * @param {*} value - Первое значение для логического И.
   * @returns {boolean} Возвращает true, если значение - не нулевое, иначе false.
   */
  public static isNotNull(value: any): boolean {
    return Boolean(value !== 0);
  }

  /**
   * Увеличивает переданное значение на 1.
   *
   * @param {number} value - Значение, которое нужно увеличить.
   * @returns {number} Увеличенное значение.
   */
  public static increment(value: number): number {
    return value + 1;
  }

  /**
   * Преобразует число в формат "1K", если оно больше 1000.
   * @param {number} value - Число для преобразования.
   * @returns {string} Преобразованное значение.
   */
  public static formatNumber(value: number): string {
    return value >= 1000 ? `${Math.floor(value / 1000)}K` : value.toString();
  }

  /**
   * Преобразует рейтинг в массив для отрисовки звёзд.
   * @param {number} rating - Рейтинг от 0 до 5.
   * @returns {number[]} Массив с процентами для заполнения звёзд.
   */
  public static calculateStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const partialStar = Math.round((rating - fullStars) * 100); // Converts fractional part to percentage.
    const starsArray = new Array(5).fill(0).map((_, i) => (i < fullStars ? 100 : 0));

    if (partialStar > 0 && fullStars < 5) starsArray[fullStars] = partialStar;

    return starsArray;
  }

  /**
   * Создает массив чисел от 0 до count - 1.
   *
   * @param {number} count - Количество элементов в массиве.
   * @returns {number[]} Массив чисел.
   */
  public static range(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  /**
   * Форматирует дату относительно текущего времени.
   *
   * @param {string} dateStr - Дата в формате строки 'YYYY-MM-DD HH:mm:ss' или ISO-формате.
   * @returns {string} Строка с форматом 'вчера', '3 дня назад', '5 часов назад', '10 минут назад' и т.д.
   * @throws {Error} Если формат даты неверный.
   */
  public static formatDateAgo(dateStr: string): string {
    // Пытаемся распознать и корректно обработать дату
    let date: Date;

    // Если дата передана в формате DD.MM.YYYY, HH:mm:ss
    if (/^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
      const [datePart, timePart] = dateStr.split(', ');
      const [day, month, year] = datePart.split('.');
      date = new Date(`${year}-${month}-${day}T${timePart}`);
    } else {
      // Пытаемся преобразовать как стандартный формат ISO или другие валидные форматы
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = 2592000;
    const secondsInYear = 31536000;

    if (diffInSeconds < secondsInMinute) {
      return 'только что';
    } else if (diffInSeconds < secondsInHour) {
      const minutesAgo = Math.floor(diffInSeconds / secondsInMinute);
      return `${minutesAgo} ${Helper.pluralize(minutesAgo, 'минуту', 'минуты', 'минут')} назад`;
    } else if (diffInSeconds < secondsInDay) {
      const hoursAgo = Math.floor(diffInSeconds / secondsInHour);
      return `${hoursAgo} ${Helper.pluralize(hoursAgo, 'час', 'часа', 'часов')} назад`;
    } else if (diffInSeconds < 2 * secondsInDay) {
      return 'вчера';
    } else if (diffInSeconds < secondsInMonth) {
      const daysAgo = Math.floor(diffInSeconds / secondsInDay);
      return `${daysAgo} ${Helper.pluralize(daysAgo, 'день', 'дня', 'дней')} назад`;
    } else if (diffInSeconds < secondsInYear) {
      const monthsAgo = Math.floor(diffInSeconds / secondsInMonth);
      return `${monthsAgo} ${Helper.pluralize(monthsAgo, 'месяц', 'месяца', 'месяцев')} назад`;
    } else {
      const yearsAgo = Math.floor(diffInSeconds / secondsInYear);
      return `${yearsAgo} ${Helper.pluralize(yearsAgo, 'год', 'года', 'лет')} назад`;
    }
  }

  /**
   * Проверяет, превышает ли текст три строки.
   *
   * @param {string} text - Текст для проверки.
   * @returns {boolean} true, если текст превышает три строки; иначе false.
   */
  public static isTextLong(text: string): boolean {
    const lineCount = text.split(/\n/).length;
    return lineCount > 3;
  }

  /**
   * Сравнивает два значения и выполняет функции из Handlebars.
   *
   * @param {any} value1 - Первое значение.
   * @param {any} value2 - Второе значение.
   * @param {object} options - Объект с методами fn и inverse.
   * @returns {any} Результат выполнения переданной функции.
   */
  public static gt(value1: any, value2: any, options?: any) {
    if (!options || typeof options !== 'object' || !options.fn) {
      return value1 > value2;
    }

    if (value1 > value2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }

  /**
   * Форматирует число как денежную сумму в русской локали.
   *
   * @param {number} num - Число для форматирования.
   * @returns {string} Форматированная строка.
   */
  public static costFormat(num: number) {
    return num.toLocaleString('ru-RU');
  }

  public static  multiplication(n1: number, n2: number) {
    return n1 * n2;
  }
}
