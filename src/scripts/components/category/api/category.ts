import { backurl } from '../../../../services/app/config';


export interface Category {
  name: string;
  picture: string;
  link_to: string;
}

export interface Product {
  id: number;
  description: string;
  count: number;
  title: string;
  price: number;
  original_price: number;
  discount: number;
  rating: number;
  image_url: string;
}

export interface ProductError {
  status: number;
  error_message: string;
}

interface ApiResponse<T> {
  status: number;
  body: T;
}

export interface CategoryApiInterface {
  getCategories(): Promise<Category[] | string>;

  getCategoryProducts(categoryLink: string): Promise<Product[]| ProductError> ;
}

export class CategoryApi implements CategoryApiInterface {
  getCategories(): Promise<Category[] | string> {
    return fetch(`${backurl}/categories`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .then((data: ApiResponse<Category[]>) => {
        if (data.status === 200 && data.body.length > 0) {
          return data.body;
        } else {
          return 'Error: No categories found or empty response body.';
        }
      })
      .catch(() => 'Error: Unable to fetch categories.');
  }

  getCategoryProducts = (categoryLink: string): Promise<Product[]| ProductError>  => {
    return fetch(`${backurl}/category/${categoryLink}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 200 && data.body.length > 0) {
          return data.body as Product[];
        }

        return data as ProductError;
      })
      .catch(error =>{
        console.log(error);

        return error;
      })
  }
}