interface apiResponse {
  status: number;
  body: any;
}

class CSRF {
  private token: string | null = null;
  private readonly csrfEndpoint: string;

  constructor(csrfEndpoint: string) {
    this.csrfEndpoint = csrfEndpoint;
  }

  public method = {
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
  };

  fetchToken = (): Promise<void> => {
    return fetch(this.csrfEndpoint, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          const csrfToken = res.headers.get('X-CSRF-Token');
          if (csrfToken) {
            this.token = csrfToken;
            console.log('CSRF-токен получен:', this.token);
          } else {
            throw new Error('CSRF-токен не найден в ответе сервера');
          }
        } else {
          throw new Error(`Ошибка при получении CSRF-токена: ${res.statusText}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  private getRequestInfo(method: string, body: any): RequestInit | undefined {
    if (!this.token) {
      return undefined;
    }

    const headers: HeadersInit = {
      'X-CSRF-Token': this.token,
    };

    let requestBody: BodyInit | null;

    if (body instanceof FormData) {
      requestBody = body;
    } else {
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(body);
    }

    return { method, credentials: 'include',
      headers, body: requestBody,
    };
  }

  private protectedFetch = (url: string, method: string, body: any): Promise<apiResponse> => {
    const info = this.getRequestInfo(method, body);
    if (!info) {
      return Promise.reject(new Error('CSRF-токен отсутствует. Сначала вызовите fetchToken()'));
    }

    return fetch(url, info)
      .then(async (res) => {
        const responseBody = await res.json().catch(() => null);
        return { status: res.status, body: responseBody.body };
      });
  };

  post = (url: string, body: any): Promise<apiResponse> => {
    return this.protectedFetch(url, this.method.POST, body);
  };

  put = (url: string, body: any): Promise<apiResponse> => {
    return this.protectedFetch(url, this.method.PUT, body);
  };

  patch = (url: string, body: any): Promise<apiResponse> => {
    return this.protectedFetch(url, this.method.PATCH, body);
  };

  delete = (url: string, body: any, contentType?: string): Promise<apiResponse> => {
    return this.protectedFetch(url, this.method.DELETE, body);
  };

  async refreshToken(): Promise<void> {
    this.token = null;
    await this.fetchToken();
  }
}

export default CSRF;