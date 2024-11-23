import {CheckResponse, RatingRequest, RatingResponse} from "../types/types";
import {csrf} from "../../../../services/api/CSRFService";
import { getWithCred } from '../../../../services/api/without-csrf';

export class CSATApi {
    static voteCSAT = (data: RatingRequest): Promise<RatingResponse> => {
        return csrf.post("/csat", data);
    }

    static getRatingStats = (): Promise<RatingResponse> => {
        return getWithCred("/csat");
    }
}
