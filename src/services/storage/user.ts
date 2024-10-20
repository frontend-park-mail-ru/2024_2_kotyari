import { User } from '../types/types';

class StorageUser {
  private userData: User = { name: '', city: 'Москва' };

  // Метод для получения данных
  public getUserData(): User {
    return this.userData;
  }

  // Метод для сохранения данных
  public saveUserData(data: { name: string; city: string }): void {
    this.userData = data;
  }

  // Метод для очистки данных
  public clearUserData(): void {
    this.userData = { name: '', city: '' };
  }
}

export const storageUser = new StorageUser();
