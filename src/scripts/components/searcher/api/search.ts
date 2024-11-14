import { get } from '../../../../services/api/without-csrf';
import { backurl } from '../../../../services/app/config';
import { Product } from '../../card/api/card';

export interface SearcherApiInterface {
  getProductsByQuery(query: string): Promise<Product[] | null>;

  getSuggestions(query: string): Promise<any>;
}

export class SearcherApi implements SearcherApiInterface {
  getProductsByQuery = (query: string): Promise<Product[] | null> => {
    const param = new URLSearchParams({
      q: query,
    });

    return get(`${backurl}/search/catalog?` + param.toString())
      .then((res) => {
        return res.body as Product[];
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };

  getSuggestions = (query: string): Promise<string[] | null> => {
    const param = new URLSearchParams({
      q: query,
    });

    return get(`${backurl}/search?${param.toString()}`)
      .then((res) => {
        if (res.status === 200) {
          return res.body.suggestions.map((suggestion: { title: string }) => suggestion.title) as Array<string>;
        } else {
          console.error(`Failed to fetch suggestions - ${res.status} - ${query} - ${backurl}/search?${param.toString()}`, res.body);
          return null;
        }
      })
      .catch(e => {
        console.error('Error fetching suggestions:', e);
        return null;
      });
  };
}