import { get } from '../../../../services/api/without-csrf';
import { apiResponse } from '../../../../services/api/utils';


export class DropdownAPI {
  private readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public fetchData(sortOption: string): Promise<any> {
    const params = new URLSearchParams({ sort: sortOption });

    return get(`${this.endpoint}?${params.toString()}`);
  }


  static sortProducts = async (endpoint: string, sort: string, order: string): Promise<apiResponse> | undefined => {
    const params = new URLSearchParams({
      sort,
      order,
    });

    try {
      const response = await get(`${endpoint}&${params.toString()}`);
      if (response === undefined) {
        console.log("Response is undefined", response);
        return undefined; // Либо можно обработать это как-то по-другому
      } else {
        return response;
      }
    } catch {
      return undefined;
    }
  };
}
