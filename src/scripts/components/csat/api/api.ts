import {CheckResponse, RatingRequest, RatingResponse} from "../types/types";
import {csrf} from "../../../../services/api/CSRFService";

export class CSATApi {
    static async postRating(data: RatingRequest): Promise<RatingResponse> {
        const response = await csrf.post("/csat", data);
        return response;
    }

    static async getRatingStats(): Promise<RatingResponse> {
        const response = await fetch("/csat", { method: "GET" });
        return response.json();
    }

    static async checkIfRated(): Promise<CheckResponse> {
        const response = await fetch("/csat", { method: "PATCH" });
        return response.json();
    }
}
