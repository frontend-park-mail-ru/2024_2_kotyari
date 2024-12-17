import {getWithCred} from "../../../../services/api/without-csrf";
import {backurl} from "../../../../services/app/config";

export interface CsatApiInterface {
    getData(): object | null;
}

export class CsatApi {
    static async getData(): object | null {
        try {
            return await getWithCred(backurl + '/orders/updates');
        } catch {
            return null;
        }
    }
}