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


  static sortProducts = (endpoint: string, sort: string, order: string): Promise<apiResponse> => {
    const params = new URLSearchParams({
      sort,
      order,
    });

    // console.log(123, `${endpoint}&${params.toString()}`);

    return get(`${endpoint}&${params.toString()}`)
  };
}
