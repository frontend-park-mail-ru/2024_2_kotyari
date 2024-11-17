import { get } from '../../../../services/api/without-csrf';


export class DropdownAPI {
  private readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public fetchData(sortOption: string): Promise<any> {
    const params = new URLSearchParams({ sort: sortOption });

    return get(`${this.endpoint}?${params.toString()}`);
  }
}
