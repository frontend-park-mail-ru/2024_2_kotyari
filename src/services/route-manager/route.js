export class Route {
  constructor(path, handler, isProtected = false) {
    this.path = path;
    this.handler = handler;
    this.isProtected = isProtected;
    this.pattern = this.createPattern(path);
  }

  createPattern = (path) => {
    return new RegExp('^' + path.replace(/:\w+/g, '(\\w+)') + '$');
  };

  matches = (url) => {
    return this.pattern.test(url);
  };
}
