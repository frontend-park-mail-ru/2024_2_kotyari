export class HandlebarManager {
  static registerPartial(name: any, content:any):any {
    Handlebars.registerPartial(name, content);
  }

  static registerHelper(name:any, func:any):any {
    Handlebars.registerHelper(name, func);
  }

  static compile(templateSource:any) :any{
    return Handlebars.compile(templateSource);
  }
}