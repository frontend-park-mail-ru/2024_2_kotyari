export interface IUser {
  username: string;
  city: string;

  setData (username: string, city: string):void;
}

export class User implements IUser {
  username: string;
  city: string;

  constructor(username: string, city: string) {
    this.username = username;
    this.city = city;
  }

  setData = (username: string, city: string):void => {
    this.username = username;
    this.city = city;
  }
}

export interface IRouter {
  navigate(path: string, pushState?: boolean): void;
  getRouteParams(url?: string): { [key: string]: string } | null;
  back(): void;
  clearHistory(): void;
}