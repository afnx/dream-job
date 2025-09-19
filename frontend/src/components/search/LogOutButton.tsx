'use client';

import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const LogOutButton = () => {
    const [showModal, setShowModal] = useState(false);
    const { signOut, authLoading, currentUser } = useAuth();
    const isLoading = authLoading || currentUser === null;

    useEffect(() => {
        if (!showModal) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) {
                setShowModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showModal, isLoading]);

    return (
        <>
            <div className="fixed top-6 left-4 z-40 flex items-center gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="p-2 rounded-full bg-white/80 hover:bg-black/20 shadow transition cursor-pointer"
                        aria-label="Logout"
                    >
                        <LogOut className="h-6 w-6 text-gray-700 -scale-x-100" />
                    </button>
                    {currentUser?.email && (
                        <span className="hidden sm:inline text-gray-700 text-sm bg-white/80 px-3 py-1 rounded shadow mt-2 sm:mt-0">
                            Signed in as <span className="font-semibold">{currentUser.email}</span>
                        </span>
                    )}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg p-10 w-80">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-3">
                                <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <span className="ml-2 text-indigo-500 font-medium">Signing out...</span>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-center">Are you sure you want to sign out?</h2>
                                <div className="flex flex-col gap-2">
                                    <button
                                        className="w-full py-3 px-4 mt-2 mb-2 rounded-lg border-none font-semibold text-base transition-colors bg-gradient-to-r from-indigo-500 to-blue-400 text-white cursor-pointer flex items-center justify-center disabled:opacity-60 hover:from-indigo-600 hover:to-blue-500"
                                        onClick={() => {
                                            signOut();
                                        }}
                                        disabled={isLoading}
                                    >
                                        Sign out
                                    </button>
                                    <button
                                        className="w-full py-3 px-4 rounded-lg border border-blue-100 font-semibold text-base transition-colors bg-white text-blue-500 cursor-pointer hover:bg-blue-50 disabled:opacity-60"
                                        onClick={() => setShowModal(false)}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>)}
                    </div>
                </div>
            )}
        </>
    );
}

export default LogOutButton;