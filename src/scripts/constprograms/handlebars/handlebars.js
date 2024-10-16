export class HandlebarManager {
    static registerPartial(name, content) {
        Handlebars.registerPartial(name, content);
    }

    static registerHelper(name, func) {
        Handlebars.registerHelper(name, func);
    }

    static compile(templateSource) {
        return Handlebars.compile(templateSource);
    }
}