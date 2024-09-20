export const elements = {
    sercher: [{
        type: 'div',
        class: ['row'],
        elements: [{
            type: 'div',
            class: ['col_75', 'nonMarginRight'],
            elements: [{
                type: 'searchInput',
                id: 'search',
            }]
        }, {
            type: 'div',
            class: ['col_15', 'nonMarginLeft'],
            elements: [{
                type: 'button',
                id: 'serchButton',
                content: '&#128269;'
            }]
        }]
    }]
}
