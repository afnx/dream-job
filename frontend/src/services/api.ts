import { ErrorResponse } from "@/types/api";
import { JobSearchResponse } from "@/types/job";
import { AuthResponse } from "@/types/auth";
import { ApiException } from "@/utils/errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiService {
    /**
     * Makes an HTTP request to the specified API endpoint and returns the parsed JSON response.
     *
     * @template T - The expected response type.
     * @param endpoint - The API endpoint to send the request to (relative to API_BASE_URL).
     * @param options - Optional fetch request options (e.g., method, headers, body).
     * @returns A promise that resolves to the parsed response data of type T.
     * @throws Will throw an error if the response is not OK or if the request fails.
     */
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                credentials: 'include',
                ...options,
            });

            const data = await response.json();

            // Check for API errors (both HTTP errors and success: false)
            if (!response.ok || (data.success === false)) {
                throw new ApiException(response.status, data as ErrorResponse);
            }

            return data;
        } catch (error) {
            if (error instanceof ApiException) {
                if (error.statusCode === 401) {
                    // Dispatch a custom event to notify the app about auto sign-out
                    window.dispatchEvent(new Event('autoSignOut'));
                }

                throw error;
            }

            // Handle network errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new ApiException(0, {
                    success: false,
                    errors: [{ type: 'NETWORK_ERROR', message: 'Unable to connect to server' }],
                    message: 'Network connection failed'
                });
            }

            // Handle other errors
            throw new ApiException(500, {
                success: false,
                errors: [{ type: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' }],
                message: 'Something went wrong'
            });
        }


    }

    /**
     * Searches for jobs based on the provided input string.
     *
     * @param input - The search query or criteria for job search.
     * @returns A promise that resolves to a `JobSearchResponse` containing the search results.
     */
    async searchJobs(input: string): Promise<JobSearchResponse> {
        return this.makeRequest<JobSearchResponse>('/jobs/parse', {
            method: 'POST',
            body: JSON.stringify({ input }),
        });
    }

    async signIn(email: string): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/auth/sign-in', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async confirmSignIn(email: string, code: string, session: string): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/auth/confirm', {
            method: 'POST',
            body: JSON.stringify({ email, code, session }),
        });
    }

    async signOut(): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/auth/sign-out', {
            method: 'POST',
        });
    }

    async getCurrentUser(): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/auth/me', {
            method: 'GET',
        });
    }
}

export const apiService = new ApiService();