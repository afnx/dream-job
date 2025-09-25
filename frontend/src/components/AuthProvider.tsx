'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiService } from '@/services/api';
import { ApiException } from '@/utils/errors';
import {
    getCookie, setCookie, deleteCookie, clearCookies, setSessionStorage,
    removeSessionStorage, getSessionStorage, clearLocalStorage, clearSessionStorage
} from '@/utils/storage';

type User = { email: string } | null;

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
            // Clear user data and cookies
            clearCookies();
            clearSessionStorage();
            clearLocalStorage();

            // Redirect to home page after sign out
            window.location.href = '/';


            // Wait a short moment to hide loading state
            setTimeout(() => {
                setLoading(false);
            }, 700);
        }
    }, []);

    useEffect(() => {
        // Listen for autoSignOut event
        // This event is triggered when the user is automatically signed out
        function handleAutoSignOut() {
            signOut();
        }
        window.addEventListener('autoSignOut', handleAutoSignOut);
        return () => window.removeEventListener('autoSignOut', handleAutoSignOut);
    }, [signOut]);

    useEffect(() => {
        // Try to restore user from cookies on initial load
        const storedUser = getCookie('currentUser');
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

                setSessionStorage('pendingEmail', authData.email);
                setSessionStorage('pendingSession', authData.session);

                // Set pendingEmail cookie for middleware
                setCookie('pendingEmail', authData.email, 1);
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
            const session = getSessionStorage('pendingSession');
            if (!session) throw new Error('No session found');

            const response = await apiService.confirmSignIn(email, code, session);
            if (response.success && response.data) {
                const authData = response.data;
                if (!authData.email || !authData.accessToken) throw new Error('No access token received');

                const user = { email: authData.email };
                setUser(user);

                // Persist user in cookies
                setCookie('currentUser', JSON.stringify(user), 1);

                // Clear pending data
                removeSessionStorage('pendingEmail');
                removeSessionStorage('pendingSession');
                deleteCookie('pendingEmail');

                // Set accessToken cookie for middleware
                // setCookie('accessToken', authData.accessToken, 1);
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