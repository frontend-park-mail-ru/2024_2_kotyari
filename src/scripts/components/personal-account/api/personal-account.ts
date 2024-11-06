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
    const response = await fetch(`${this.baseUrl}/account`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw { status: response.status, body: errorBody };
    }

    const data = await response.json();
    return data.body;
  }

  public async updateAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${this.baseUrl}/account/avatar`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json();

      throw { status: response.status, body: errorBody.body };
    }

    const result = await response.json();
    return result.body.avatar_url;
  }

  public async getNearestDeliveryDate(): Promise<string> {
    const url = `${this.baseUrl}/orders/nearest`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If response is not OK, handle error only once
        const errorData = await response.json();
        return errorData.body?.error_message || 'Error fetching delivery date';
      }

      // Read the response body only once
      const data = await response.json();
      const deliveryDate = new Date(data.body.delivery_date);
      return `Ожидаемая дата доставки: ${deliveryDate.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;
    } catch (error) {
      console.error('Failed to fetch nearest delivery date:', error);
      return 'Не удалось получить дату доставки';
    }
  }
}