export const partials = {
    '/src/scripts/layouts/body.hbs': [{
        name: 'header',
        partial: '/src/scripts/layouts/header/header.hbs'
    }, {
        name: 'footer',
        partial: '/src/scripts/layouts/footer/footer.hbs'
    }],
    '/src/scripts/layouts/header/header.hbs' : [{
        name: 'searcher',
        partial: '/src/scripts/components/elements/searcher/searcher.hbs'
    }]
}