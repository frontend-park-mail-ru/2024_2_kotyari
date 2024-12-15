import {get} from "../../../../services/api/without-csrf";
import {backurl} from "../../../../services/app/config";

export interface CsatApiInterface {
    getData(): object | null;
}

export class CsatApi {
    static async getData(): object | null {
        try {
            //return await get(backurl + '/notice');
            return {id: '123', status: 'dfggfd'}
        } catch {
            return null;
        }
    }
}