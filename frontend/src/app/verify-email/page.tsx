'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import FilledButton from '@/components/FilledButton';
import { getCookie, removeSessionStorage, deleteCookie } from '@/utils/storage';

export default function VerifyEmailPage() {
    const { currentUser, confirmSignIn, authLoading, authError } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [codeDigits, setCodeDigits] = useState(Array(8).fill(''));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pendingEmail = getCookie('pendingEmail');
            if (!pendingEmail) {
                router.replace('/sign-in');
            } else {
                setEmail(pendingEmail);
            }
        }
    }, [router]);

    useEffect(() => {
        // If signed in, redirect to main app
        if (currentUser?.email) {
            router.replace('/search');
        }
    }, [currentUser, router]);

    useEffect(() => {
        if (authError) setLoading(false);
    }, [authError]);

    if (!email) {
        return null;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const code = codeDigits.join('');
        if (!email || code.length !== 8) {
            return;
        }

        setLoading(true);
        await confirmSignIn(email, code);
    }

    function handleInputChange(idx: number, value: string) {
        const digits = value.replace(/[^0-9]/g, '');
        setCodeDigits(prev => {
            const next = [...prev];
            next[idx] = digits;
            return next;
        });
        // Move focus to next input if filled
        if (digits && idx < 7) {
            const nextInput = document.querySelector<HTMLInputElement>(`input[name=code-${idx + 1}]`);
            nextInput?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        const pasted = e.clipboardData.getData('Text').replace(/[^0-9]/g, '').slice(0, 8);
        if (pasted.length > 0) {
            setCodeDigits(pasted.split('').concat(Array(8 - pasted.length).fill('')));
            // Focus the last filled input
            setTimeout(() => {
                const nextInput = document.querySelector<HTMLInputElement>(`input[name=code-${pasted.length - 1}]`);
                nextInput?.focus();
            }, 0);
            e.preventDefault();
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg">
            <form
                onSubmit={handleSubmit}
                className="text-center m-2 bg-white p-16 px-8 rounded-xl min-w-[320px] sm:min-w-[420px] w-full max-w-md flex flex-col gap-5 border-1 border-gray-100 shadow-lg"
            >
                <Logo shrink={true} />
                <p className="text-center text-gray-600 text-base mb-4">
                    We’ve sent an 8-digit verification code to <span className="font-bold">{email}</span>.<br /><br />
                    Please enter it below to verify your email address.
                </p>
                <div className="flex justify-center gap-1 sm:gap-2 mb-4 max-w-full">
                    <div className="flex gap-1 sm:gap-2 w-full sm:w-auto items-center justify-center">
                        {[...Array(8)].map((_, idx) => (
                            <input
                                key={idx}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                name={`code-${idx}`}
                                className="w-8 h-10 sm:w-10 sm:h-14 text-center text-2xl border border-gray-300 rounded-lg focus:border-indigo-400 outline-none transition-colors"
                                autoComplete="one-time-code"
                                pattern="[0-9]*"
                                required
                                disabled={authLoading || loading}
                                value={codeDigits[idx]}
                                onChange={e => handleInputChange(idx, e.target.value)}
                                onPaste={idx === 0 ? handlePaste : undefined}
                                onKeyDown={e => {
                                    if (e.key === 'Backspace' && !e.currentTarget.value && idx > 0) {
                                        const prev = document.querySelector<HTMLInputElement>(`input[name=code-${idx - 1}]`);
                                        prev?.focus();
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
                <FilledButton
                    type="submit"
                    isLoading={authLoading || loading}
                    loadingText="Verifying..."
                    text="Submit"
                    isDisabled={codeDigits.some(d => !d)}
                />

                <button
                    type="button"
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline text-sm mt-2 mb-1 transition-colors cursor-pointer mx-auto"
                    onClick={() => {
                        removeSessionStorage('pendingEmail');
                        removeSessionStorage('pendingSession');
                        deleteCookie('pendingEmail');
                        router.replace('/sign-in');
                    }}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to sign in</span>
                </button>

                {(authError) && (
                    <div className="text-red-500 bg-red-50 rounded-lg py-4 px-4 text-center text-[0.95rem]">
                        {authError}
                    </div>
                )}
            </form>
        </div>
    );
}