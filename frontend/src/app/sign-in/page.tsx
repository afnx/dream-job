'use client';

import { FormEvent, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function SignInPage() {
    const [error, setError] = useState<string | null>(null);
    const { signIn, authLoading, authError } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email')?.toString().trim();

        if (!email) {
            setError('Email is required');
            return;
        }

        setError(null);

        try {
            await signIn(email);
            router.replace('/search');
        } catch {
            setError('Invalid credentials');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg">
            <form
                onSubmit={handleSubmit}
                className="text-center m-2 bg-white p-16 px-8 rounded-xl min-w-[320px] sm:min-w-[420px] w-full max-w-md flex flex-col gap-5 border-2 border-indigo-300 shadow-lg"
            >
                <Logo shrink={true} />
                <h2 className="text-center m-0 text-[#3a3a3a]">Please sign in with your email address</h2>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    disabled={authLoading}
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base text-gray-700 outline-none transition-colors mt-8"
                />
                {authLoading ? (
                    <div className="flex justify-center items-center py-3">
                        <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span className="ml-2 text-indigo-500 font-medium">Signing in...</span>
                    </div>
                ) : (
                    <button
                        type="submit"
                        className="py-3 px-4 rounded-lg border-none bg-gradient-to-r from-indigo-500 to-blue-400 text-white font-semibold text-base cursor-pointer transition-colors"
                    >
                        Continue
                    </button>
                )}
                {(error || authError) && (
                    <div className="text-red-500 bg-red-50 rounded-lg py-2 px-4 text-center text-[0.95rem]">
                        {error || authError}
                    </div>
                )}
            </form>
        </div>
    );
}