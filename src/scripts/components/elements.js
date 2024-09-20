import {errors} from '../errors/errors'

const img = '../../assets/img'

export const elements = {
    header: {
        html: 'div',
        class: ['header'] // Класс из CSS
    },
    main: {
        html: 'div',
        class: ['main'] // Класс из CSS
    },
    footer: {
        html: 'div',
        class: ['footer'] // Класс из CSS
    },
    div: {
        html: 'div',
        class: ['div'] // Класс из CSS
    },
    logo: {
        html: 'img',
        class: ['logo'], // Класс из CSS
        alt: 'logo',
        src: `${img}/logo.jpg`
    },
    dropButton: {
        html: 'button',
        class: ['dropButton'], // Класс из CSS
        hover: {
            class: ['dropButton:hover'] // Класс для hover
        },
    },
    button: {
        html: 'button',
        class: ['button'], // Класс из CSS
        hover: {
            class: ["button:hover"] // Класс для hover
        },
    },
    searchInput: {
        html: 'input',
        class: ['searchInput'], // Класс из CSS
        ntype: 'search', // Исправлено type="search"
        placeholder: 'Поиск',
    },
    tableRow: {
        html: 'div',
        class: ['row3'], // Класс для строки с тремя колонками
    },
    tableCol: {
        html: 'div',
        class: ['col'], // Класс для колонки
    },
    text: {
        html: 'text',
        class: ['text']
    },
    span: {
        html: 'span',
        class: ['span'],
    },
    p: {
        html: 'p',
        class: ['p']
    },
    pre: {
        html: 'pre',
        class: ['pre']
    },
    strong: {
        html: 'strong',
    },
    a: {
        html: 'a',
        class: ['a']
    }
};
