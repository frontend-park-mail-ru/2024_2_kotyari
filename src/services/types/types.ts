import { backurl } from '../app/config';

export interface IUser {
  username: string;
  city: string;
  avatar_url: string;

  setData(username: string, city: string, avatar_url: string): void;

  setName(name: string): void;

  setAvatar(avatar_url: string): void;

  setCity(city: string): void;
}

export class User implements IUser {
  username: string;
  city: string;
  avatar_url: string;

  constructor(username: string, city: string, avatar_url: string) {
    this.username = username;
    this.city = city;
    this.avatar_url = avatar_url;
  }

  setName = (name: string): void => {
    this.username = name;
  };

  setAvatar = (avatar_url: string): void => {
    this.avatar_url = avatar_url;
  };

  setCity = (city: string): void => {
    this.city = city;
  };

  setData = (username: string, city: string, avatar_url: string): void => {
    this.username = username;
    this.city = city;
    this.avatar_url = `${backurl}/${avatar_url}`;
  }
}

export interface IRouter {
  navigate(path: string, pushState?: boolean): void;
  getRouteParams(url?: string): { [key: string]: string } | null;
  back(): void;
  clearHistory(): void;
}