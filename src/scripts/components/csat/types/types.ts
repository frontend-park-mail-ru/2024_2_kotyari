export interface RatingRequest {
    rating: number;
    comment: string | null;
    type: string;
}

export interface RatingResponse {
    status: number;
    message: string;
    body?: {
        rating: number[];
    };
}

export interface CheckResponse {
    status: number;
    message: string;
}
