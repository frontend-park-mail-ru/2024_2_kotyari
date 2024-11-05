import { apiResponse, parseJsonResponse } from './utils';

const getWithCred = (url: string): Promise<apiResponse> => {
  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(parseJsonResponse);
};


const get = (url: string):Promise<any> => {
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
    .then(parseJsonResponse);
}