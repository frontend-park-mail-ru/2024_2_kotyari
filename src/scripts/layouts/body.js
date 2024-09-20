import {initialize} from '../components/buildcomponents';
import {elements} from '../components/components'

const root = document.body;
const sity = 'Москва'

const config1 = {
    header: {
        type: 'header',
        rows: [{
            class: 'row2',
            columns: [{
                class: 'col5',
                elements: [{
                    type: 'div',
                    id: 'logo',
                    elements: [{
                        type: 'logo',
                        href: '/api/katalog',
                        alt: 'Ozon',
                    }],
                    style: {
                        width: '100%',
                    }
                }]
            }, {
                style: {
                    flex: '0 0 5%',
                },
                elements: [{
                    type: 'div',
                    id: 'katalogButton',
                    elements: [{
                        type: 'dropButton',
                        content: 'Каталог',
                    }],
                    style: {
                        width: '100%',
                        margin: '0',
                    },
                }]
            }, {
                class: 'col2',
                elements: [{
                    type: 'div',
                    id: 'finder',
                    elements: elements.sercher,
                    style: {
                        width: '100%',
                        height: '100%'
                    },
                }]
            }]
        }]
    },
    main: {
        type: 'main',
        rows: [{
            class: 'row3',  // Треть пространства для строки
            columns: [{
                class: 'col2',  // Половина пространства
                elements: [{
                    type: 'div',
                    id: 'contentLeft',
                    elements: [{
                        type: 'text',
                        content: 'Левая колонка',
                    }]
                }]
            }, {
                width: '200px',  // Фиксированная ширина в пикселях
                elements: [{
                    type: 'div',
                    id: 'contentRight',
                    elements: [{
                        type: 'text',
                        content: 'Фиксированная колонка 200px',
                    }]
                }]
            }]
        }]
    },
    footer: {
        type: 'footer',
        rows: [{
            class: 'row1',  // Полная ширина строки
            columns: [{
                width: '100%',  // Полная ширина колонки
                elements: [{
                    type: 'div',
                    id: 'footerText',
                    elements: [{
                        type: 'text',
                        content: 'Футер',
                    }]
                }]
            }]
        }]
    }
};

initialize(config1, root);
