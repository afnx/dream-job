'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import FilledButton from '@/components/FilledButton';

export default function SignInPage() {
    const [error, setError] = useState<string | null>(null);
    const { signIn, authLoading, authError } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If signIn was successful, pendingEmail will be set
        if (typeof window !== 'undefined') {
            const pendingEmail = sessionStorage.getItem('pendingEmail');
            if (pendingEmail) {
                router.replace('/verify-email');
            }
        }
    }, [authLoading, router]);

    useEffect(() => {
        if (authError) setLoading(false);
    }, [authError]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email')?.toString().trim();

        if (!email) {
            setError('Email is required');
            return;
        }

        setError(null);
        setLoading(true);
        await signIn(email);
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
                    disabled={authLoading || loading}
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base text-gray-700 outline-none transition-colors mt-8"
                />
                <FilledButton
                    type="submit"
                    isLoading={authLoading || loading}
                    loadingText="Signing in..."
                    text="Continue"
                    isDisabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                />
                {(error || authError) && (
                    <div className="text-red-500 bg-red-50 rounded-lg py-2 px-4 text-center text-[0.95rem]">
                        {error || authError}
                    </div>
                )}
            </form>
        </div>
    );
}