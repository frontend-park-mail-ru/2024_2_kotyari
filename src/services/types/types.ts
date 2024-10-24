export interface User {
  name: string;
  city: string;
}

export interface IRouter {
  navigate(path: string, pushState: boolean = true): void
}