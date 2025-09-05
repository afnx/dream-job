'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { ApiException } from '@/utils/errors';

type User = { email: string, accessToken: string | null } | null;

interface AuthContextType {
    currentUser: User;
    authLoading: boolean;
    authError: string | null;
    signIn: (_email: string) => Promise<void>;
    confirmSignIn: (_email: string, _code: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    authLoading: false,
    authError: null,
    signIn: async () => { },
    confirmSignIn: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch user info on mount
    useEffect(() => {
        fetch('/api/me', { credentials: 'include' })
            .then(async (res) => {
                if (res.ok) setUser(await res.json());
                else setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    async function signIn(email: string) {
        setLoading(true);
        setError(null);
        setUser(null);

        try {
            const response = await apiService.signIn(email);
            if (response.success && response.data) {
                const authData = response.data;
                if (!authData.email) throw new Error('No email received');

                setUser({ email: authData.email, accessToken: null }); // Awaiting confirmation
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }

    async function confirmSignIn(email: string, code: string) {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.confirmSignIn(email, code);
            if (response.success && response.data) {
                const authData = response.data;
                if (!authData.email || !authData.accessToken) throw new Error('No access token received');

                setUser({ email: authData.email, accessToken: authData.accessToken });
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }

    async function signOut() {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.signOut();
            if (response.success) {
                setUser(null);
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }

    function handleError(err: unknown) {
        if (err instanceof ApiException) {
            setError(err.getDisplayMessage());
        } else {
            setError('An unexpected error occurred');
            console.error('Unexpected error:', err);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser: user,
                authLoading: loading,
                authError: error,
                signIn,
                confirmSignIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}