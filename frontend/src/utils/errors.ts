import { ApiError, ErrorResponse } from '@/types/api';

export class ApiException extends Error {
    public readonly errors: ApiError[];
    public readonly statusCode: number;
    public readonly serverMessage: string;

    constructor(statusCode: number, errorResponse: ErrorResponse) {
        super(errorResponse.message);
        this.name = 'ApiException';
        this.statusCode = statusCode;
        this.errors = errorResponse.errors;
        this.serverMessage = errorResponse.message;
    }

    getDisplayMessage(): string {
        if (this.errors.length === 1) {
            return this.errors[0].message;
        }
        return this.serverMessage;
    }

    getAllMessages(): string[] {
        return this.errors.map(error => error.message);
    }

    getFieldErrors(): Record<string, string[]> {
        const fieldErrors: Record<string, string[]> = {};
        this.errors.forEach(error => {
            if (error.field) {
                if (!fieldErrors[error.field]) {
                    fieldErrors[error.field] = [];
                }
                fieldErrors[error.field].push(error.message);
            }
        });
        return fieldErrors;
    }
}