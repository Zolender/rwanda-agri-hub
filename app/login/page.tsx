'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
        // We call the NextAuth signIn function
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false, // We handle the redirect manually for a smoother feel
        });

        if (result?.error) {
            setError('Invalid email or password. Please try again.');
        } else {
            router.push('/app/dashboard'); // Success!
        }
        } catch (err) {
        setError('Something went wrong. Please try again later.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-10 space-y-8">
            <header className="text-center space-y-2">
            <h1 className="text-2xl font-light text-slate-800 tracking-tight">Rwanda Agri-Hub</h1>
            <p className="text-slate-500 text-sm">Welcome back. Please enter your details.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
                {error}
                </div>
            )}

            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Email</label>
                <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-slate-700"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Password</label>
                <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-slate-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Authenticating...' : 'Sign In'}
            </button>
            </form>
        </div>
        </main>
    );
}