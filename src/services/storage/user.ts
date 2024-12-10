import { IUser, User } from '../types/types';
/**
 * Экземпляр класса User по умолчанию с пустым именем и городом "Москва".
 */
export const defaultUser = new User('', 'Москва');

/**
 * Класс StorageUser отвечает за хранение и управление данными пользователя.
 */
class StorageUser {
  /**
   * Данные пользователя.
   * @private
   */
  private userData: IUser;

  /**
   * Создаёт экземпляр класса StorageUser с заданными данными пользователя.
   *
   * @param user - Объект, содержащий данные пользователя.
   */
  constructor(user: IUser) {
    this.userData = user;
  }

  /**
   * Получает данные пользователя.
   *
   * @returns Объект IUser, содержащий данные пользователя.
   */
  public getUserData(): IUser {
    return this.userData as IUser;
  }

  /**
   * Сохраняет новые данные пользователя.
   *
   * @param data - Объект IUser с новыми данными пользователя.
   */
  public saveUserData(data: IUser): void {
    // console.log(data);

    this.userData = data;
  }

  /**
   * Очищает данные пользователя, устанавливая значения по умолчанию.
   */
  public clearUserData(): void {
    this.userData = defaultUser;
  }

  /**
   * Изменяет город пользователя.
   *
   * @param city - Новый город пользователя.
   */
  public changeCity(city: string): void {
    this.userData.city = city;
  }

  /**
   * Изменяет имя пользователя.
   *
   * @param username - Новое имя пользователя.
   */
  public changeUsername(username: string): void {
    this.userData.username = username;
  }
}

/**
 * Проверяет, авторизован ли пользователь.
 *
 * @returns {boolean} Возвращает `true`, если пользователь авторизован (имеет непустое имя пользователя), иначе `false`.
 */
export const isAuth = (): boolean => {
  const user = storageUser.getUserData();

  return user.username !== '';
};


export const storageUser = new StorageUser(defaultUser);
