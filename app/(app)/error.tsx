'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle size={32} />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800">
                    Something went wrong!
                </h2>
                
                <p className="text-slate-600">
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
                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
                
                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-6 text-left">
                        <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                            Technical Details
                        </summary>
                        <pre className="mt-2 p-3 bg-slate-100 rounded text-xs overflow-auto">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}