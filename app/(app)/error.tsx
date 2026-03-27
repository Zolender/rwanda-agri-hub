'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        console.error('Dashboard Error:', error);
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) setIsDark(saved === 'true');
    }, [error]);

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${
            isDark ? 'bg-stone-950' : 'bg-slate-50'
        }`}>
            <div className={`max-w-md w-full rounded-2xl shadow-lg p-8 text-center space-y-4 ${
                isDark ? 'bg-stone-900' : 'bg-white'
            }`}>
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle size={32} />
                </div>

                <h2 className={`text-2xl font-bold ${isDark ? 'text-stone-100' : 'text-slate-800'}`}>
                    Something went wrong!
                </h2>

                <p className={isDark ? 'text-stone-400' : 'text-slate-600'}>
                    {error.message || 'An unexpected error occurred while loading the dashboard.'}
                </p>

                <div className="flex gap-3 justify-center pt-4">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className={`px-6 py-3 rounded-lg transition-colors ${
                            isDark
                                ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        Go Home
                    </button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-6 text-left">
                        <summary className={`cursor-pointer text-sm ${
                            isDark ? 'text-stone-500 hover:text-stone-300' : 'text-slate-500 hover:text-slate-700'
                        }`}>
                            Technical Details
                        </summary>
                        <pre className={`mt-2 p-3 rounded text-xs overflow-auto ${
                            isDark ? 'bg-stone-800 text-stone-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}