'use client';

import { createContext, useContext } from 'react';

type DarkModeContextType = {
    isDark: boolean;
    toggleDarkMode: () => void;
};

export const DarkModeContext = createContext<DarkModeContextType>({
    isDark: false,
    toggleDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);