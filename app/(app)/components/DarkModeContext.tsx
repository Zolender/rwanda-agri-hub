'use client';

import { useState, useEffect } from 'react';

/**
 * useDarkMode — reads the shared darkMode flag from localStorage and
 * re-syncs whenever DashboardShell (or any other component) toggles it.
 */
export function useDarkMode(): { isDark: boolean } {
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'darkMode') setIsDark(e.newValue === 'true');
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    return { isDark };
}
