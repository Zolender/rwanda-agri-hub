'use client';

import { PackagePlus, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/app/(app)/components/DarkModeContext';

type QuickAddHeaderProps = {
    role: 'ADMIN' | 'MANAGER';
};

export default function QuickAddHeader({ role }: QuickAddHeaderProps) {
    const router = useRouter();
    const { isDark } = useDarkMode();

    return (
        <div className="space-y-3">
            <button
                onClick={() => router.back()}
                className={`
                    flex items-center gap-1.5 text-sm font-medium transition-colors
                    ${isDark
                        ? 'text-stone-400 hover:text-stone-100'
                        : 'text-stone-500 hover:text-stone-800'
                    }
                `}
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div>
                <div className="flex items-center gap-3 mb-1">
                    <PackagePlus className="w-6 h-6 text-emerald-600" />
                    <h1
                        className={`text-2xl font-black tracking-tight ${isDark ? 'text-stone-100' : 'text-stone-900'}`}
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                        Receive Stock
                    </h1>
                </div>
                <p className={`text-sm ml-9 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    Record an incoming delivery or purchase for an existing product.
                </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 w-fit">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700">
                    {role === 'ADMIN' ? 'Admin' : 'Manager'} access
                </span>
            </div>
        </div>
    );
}