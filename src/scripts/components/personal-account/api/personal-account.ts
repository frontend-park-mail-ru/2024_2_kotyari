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
      throw new Error('Failed to fetch user data');
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
      throw new Error('Error uploading avatar');
    }

    const result = await response.json();
    return result.body.avatar_url;
  }
}