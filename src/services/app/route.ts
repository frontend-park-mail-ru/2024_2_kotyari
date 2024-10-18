export class Route {
  public readonly route: string;
  public readonly handler: any;
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
  }
}
