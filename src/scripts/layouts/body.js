import {initialize} from '../components/buildcomponents';
import {blocks} from '../components/components';
import {icons} from "../components/icons";

const root = document.body;
const sity = 'Москва'

const config1 = {
    body: [{
            type: 'header',
            elements: [{
                type: 'div',
                class: ['row4'],
                elements: [{
                    type: 'strong',
                    content: `${sity}.`
                }, {
                    type: 'pre',
                    content: ' '
                }, {
                    type: 'a',
                    class: ['a', 'perpl'],
                    href: '/api/kanban',
                    content: 'Изменить город'
                }]
            }, {
                type: 'div',
                class: ['row'],
                elements: [{
                    type: 'div',
                    class: ['col_15'],
                    elements: [{
                        type: 'logo',
                    }]
                }, {
                    type: 'div',
                    class: ['col_5'],
                    elements: [{
                        type: 'div',
                        class: ['row'],
                        elements: [{
                            type: 'dropButton',
                            id: 'katalog',
                            content: '&#8801; Каталог'
                        }]
                    }]
                }, {
                    type: 'div',
                    class: ['col_60'],
                    elements: blocks.sercher
                }, {
                    type: 'div',
                    class: ['col5'],
                    elements: [{
                        type: 'div',
                        class: ['row'],
                        elements: [{
                            type: 'div',
                            class: ['col_15'],
                            elements: icons.avatar,
                        }, {
                            type: 'div',
                            class: ['col_15'],
                            elements: icons.basket,
                        }, {
                            type: 'div',
                            class: ['col_15'],
                            elements: icons.favorites,
                        }, {
                            type: 'div',
                            class: ['col_15'],
                            elements: icons.orders,
                        }]
                    }]
                }]
            }]
        }, {
            type: 'main',
        }, {
            type: 'footer',
        }]
};

initialize(config1.body, root);
