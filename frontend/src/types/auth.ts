import { ApiResponse } from "./api";

export interface AuthRequest {
    email?: string;
    code?: string;
}

export type AuthResponse = ApiResponse<AuthData>;

export interface AuthData {
    email?: string;
    accessToken?: string | null;
}