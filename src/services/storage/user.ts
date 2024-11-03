import { IUser, User } from '../types/types';

export const defaultUser = new User('', 'Москва');

class StorageUser {
  private userData: IUser;

  constructor(user: IUser) {
    this.userData = user;
  }

  public getUserData(): IUser {
    return this.userData as IUser;
  }

  public saveUserData(data: IUser): void {
    console.log(data);

    this.userData = data;
  }

  public clearUserData(): void {
    console.log('Я РАБОТАЮ');

    this.userData = defaultUser;
  }
}

export const storageUser = new StorageUser(defaultUser);
