export interface RatingRequest {
    rating: number;
    comment: string | null;
    type: string;
}

export interface RatingResponse {
    status: number;
    body: Statistic | ResponseErr;
}

interface Statistic {
    rating: number[];
}

interface ResponseErr {
    error_message: string;
}

export interface CheckResponse {
    status: number;
    message: string;
}
