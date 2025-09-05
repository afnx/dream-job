'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

    const signOut = useCallback(async () => {
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
            document.cookie.split(';').forEach(cookie => {
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            });
            localStorage.clear();
            sessionStorage.clear();

            setLoading(false);

            // Redirect to home page after sign out
            window.location.href = '/';
        }
    }, []);

    useEffect(() => {
        function handleAutoSignOut() {
            signOut();
        }
        window.addEventListener('autoSignOut', handleAutoSignOut);
        return () => window.removeEventListener('autoSignOut', handleAutoSignOut);
    }, [signOut]);

    useEffect(() => {
        // Try to restore user from localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
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
                if (!authData.session) throw new Error('No session received');

                setUser({ email: authData.email, accessToken: null }); // Awaiting confirmation
                sessionStorage.setItem('pendingEmail', authData.email);
                sessionStorage.setItem('pendingSession', authData.session);

                // Set pendingEmail cookie for middleware
                document.cookie = `pendingEmail=${encodeURIComponent(authData.email)}; path=/; SameSite=Lax`;
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
            const session = sessionStorage.getItem('pendingSession') || '';
            if (!session) throw new Error('No session found');

            const response = await apiService.confirmSignIn(email, code, session);
            if (response.success && response.data) {
                const authData = response.data;
                if (!authData.email || !authData.accessToken) throw new Error('No access token received');

                const user = { email: authData.email, accessToken: authData.accessToken };
                setUser(user);

                // Persist user in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));

                // Clear pending data
                sessionStorage.removeItem('pendingEmail');
                sessionStorage.removeItem('pendingSession');

                // Set accessToken cookie for middleware
                document.cookie = `accessToken=${encodeURIComponent(authData.accessToken)}; path=/; SameSite=Lax`;
                // Clear cookie
                document.cookie = 'pendingEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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