export interface ApiError {
    type: string;
    field?: string;
    message: string;
}

export interface ErrorResponse {
    success: false;
    errors: ApiError[];
    message: string;
}

export interface SuccessResponse<TData = unknown> {
    success: true;
    data: TData;
    message?: string;
}

export type ApiResponse<TData = unknown> = SuccessResponse<TData> | ErrorResponse;
