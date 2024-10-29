import { User } from '../types/types';

class StorageUser {
  private userData: User = { username: '', city: 'Москва' };

  // Метод для получения данных
  public getUserData(): User {
    return this.userData;
  }

  // Метод для сохранения данных
  public saveUserData(data: User): void {
    this.userData = data;
  }

  // Метод для очистки данных
  public clearUserData(): void {
    this.userData = { username: '', city: '' };
  }
}

export const storageUser = new StorageUser();
