export class Route {
  public readonly route: string;
  public readonly handler: () => void;
  public readonly loginRequired: boolean;
  public readonly logoutRequired: boolean;
  public readonly pattern: RegExp;

  constructor(path: string, handler: () => void, pattern: RegExp, loginRequired = false, logoutRequired = false) {
    this.route = path;
    this.handler = handler;
    this.loginRequired = loginRequired;
    this.logoutRequired = logoutRequired;
    this.pattern = pattern;
  }

  matches = (url: string) => {
    return this.pattern.test(url);
  };

  getParams(url: string): { [key: string]: string } | null {
    const match = this.pattern.exec(url);
    if (match) {
      const params: { [key: string]: string } = {};
      const keys = this.route.match(/:(\w+)/g) || [];
      keys.forEach((key, index) => {
        params[key.substring(1)] = match[index + 1]; // index + 1, так как первый элемент - полное совпадение
      });
      return params;
    }
    return null;
  }
}
