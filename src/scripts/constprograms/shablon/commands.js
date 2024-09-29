export function registrFunctions () {
    // Регистрация хелпера eq для сравнения значений
    Handlebars.registerHelper('eq', function (a, b) {
        return a === b;
    });
}