/**
 * Utility functions for managing cookies, localStorage, and sessionStorage in a web application.
 */

/**
 * Retrieves the value of a cookie by its name.
 * 
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie, or undefined if the cookie does not exist.
 */
export function getCookie(name: string): string | undefined {
    const value = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1];
    return value;
}

/**
 * Sets a cookie with the specified name, value, and expiration in days.
 * 
 * @param name - The name of the cookie to set.
 * @param value - The value of the cookie.
 * @param days - The number of days until the cookie expires.
 */
export async function setCookie(name: string, value: string, days: number) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${(value || '')}${expires}; ${cookieAttributes()}`;
}

/**
 * Deletes a cookie by its name.
 * 
 * @param name - The name of the cookie to delete.
 */
export async function deleteCookie(name: string) {
    document.cookie = `${name}=; ${cookieAttributes()} expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Clears all cookies for the current domain.
 * 
 * Use with caution as this will remove all cookies, which may affect user sessions and preferences.
 */
export async function clearCookies() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; ${cookieAttributes()} expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}

/**
 * Generates common cookie attributes for setting cookies.
 * 
 * @returns A string containing common cookie attributes.
 */
function cookieAttributes(): string {
    return `path=/; SameSite=Strict;${window.location.protocol === 'https:' ? ' Secure;' : ''}`;
}

/**
 * Sets a key-value pair in the browser's localStorage.
 *
 * Use this function to store string values that need to persist across sessions.
 * 
 * This is a **client-side only** function and should not be used in server-side code.
 *
 * @param key - The key under which the value will be stored.
 * @param value - The string value to store.
 */
export function setLocalStorage(key: string, value: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
    }
}

/**
 * Retrieves a value from the browser's localStorage by its key.
 *
 * This is a **client-side only** function and should not be used in server-side code.
 *
 * @param key - The key of the value to retrieve.
 * @returns The string value associated with the key, or null if the key does not exist.
 */
export function getLocalStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    return null;
}

/** 
 * Removes a key-value pair from the browser's localStorage by its key.
 *
 * @param key - The key of the value to remove.
 */
export function removeLocalStorage(key: string) {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
}

/**
 * Clears all key-value pairs from the browser's localStorage.
 * 
 * Use with caution as this will remove all data stored in localStorage.
 */
export function clearLocalStorage() {
    if (typeof window !== 'undefined') {
        localStorage.clear();
    }
}

/**
 * Sets a key-value pair in the browser's sessionStorage.
 *
 * Use this function to store string values that should persist only for the duration of the page session.
 * 
 * This is a **client-side only** function and should not be used in server-side code.
 *
 * @param key - The key under which the value will be stored.
 * @param value - The string value to store.
 */
export function setSessionStorage(key: string, value: string) {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, value);
    }
}

/**
 * Retrieves a value from the browser's sessionStorage by its key.
 * 
 * This is a **client-side only** function and should not be used in server-side code.
 *
 * @param key - The key of the value to retrieve.
 * @returns The string value associated with the key, or null if the key does not exist.
 */
export function getSessionStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(key);
    }
    return null;
}

/**
 * Removes a key-value pair from the browser's sessionStorage by its key.
 *
 * @param key - The key of the value to remove.
 */
export function removeSessionStorage(key: string) {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
    }
}

/**
 * Clears all key-value pairs from the browser's sessionStorage.
 * 
 * Use with caution as this will remove all data stored in sessionStorage.
 */
export function clearSessionStorage() {
    if (typeof window !== 'undefined') {
        sessionStorage.clear();
    }
}