import { PERSONAL_ACCOUNT } from '../configs/config';
import { getWithCred } from '../../../../services/api/without-csrf';
import { csrf } from '../../../../services/api/CSRFService';

export interface UserData {
  id: number;
  email: string;
  username: string;
  gender: string;
  age: number;
  avatar_url: string;
  Address: {
    id: number;
    city: string;
    street: string;
    house: string;
    flat: string;
    profile_id: number;
  };
}

export class AccountAPI {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async fetchUserData(): Promise<UserData> {
    return getWithCred(`${this.baseUrl}${PERSONAL_ACCOUNT.MAIN.ROUTE}`)
      .then(response => response.body as UserData)
  }

  public async updateAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    return csrf.put(`${this.baseUrl}${PERSONAL_ACCOUNT.AVATAR.ROUTE}`, formData)
      .then(response => {
        if (response.status !==200) {
          throw { status: response.status, body: response.body }
        }

        return response.body.avatar_url as string;
      })
  }

  public async getNearestDeliveryDate(): Promise<string> {
    return getWithCred(`${this.baseUrl}`)
      .then(response => {
        if (response.status !== 200) {
          return response.body.error_message || 'Error fetching delivery date';
        }

        const data = response.body;
        const deliveryDate = new Date(data.delivery_date);
        return `Ожидаемая дата доставки: ${deliveryDate.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`;
      })
  }
}