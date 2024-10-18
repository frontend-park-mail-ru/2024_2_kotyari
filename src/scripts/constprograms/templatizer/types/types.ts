export interface HelperFunctions {
    pluralize: (count: number, one: string, few: string, many: string) => string;
    formatDate: (date: Date, format: string) => string;
    eq: (a: unknown, b: unknown) => boolean;
}

/**
 * Интерфейсы для типизации partial-шаблонов и хелперов.
 */
export interface Partials {
    name: string;
    partial: string;
}
