'use client';

import { useState, useEffect } from 'react';

type Theme = 'morning' | 'afternoon' | 'evening' | 'night';

export function useTimeTheme() {
    const [theme, setTheme] = useState<Theme>('afternoon');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) setTheme('morning');
        else if (hour >= 11 && hour < 17) setTheme('afternoon');
        else if (hour >= 17 && hour < 21) setTheme('evening');
        else setTheme('night');
    }, []);

    const themes = {
        morning: {
            gradient: 'from-[#fffafb] via-[#fff1f2] to-[#ffffff]',
            textColor: 'text-stone-800',
            accentColor: 'text-rose-500',
            buttonClass: 'bg-[#1d1d1f] text-white',
            ringColor: 'text-rose-500/20',
            isDark: false,
            theme: 'morning'
        },
        afternoon: {
            gradient: 'from-[#fafaff] via-[#f5f3ff] to-[#ffffff]',
            textColor: 'text-slate-800',
            accentColor: 'text-indigo-500',
            buttonClass: 'bg-[#1d1d1f] text-white',
            ringColor: 'text-indigo-500/20',
            isDark: false,
            theme: 'afternoon'
        },
        evening: {
            gradient: 'from-[#fff8f1] via-[#fef2f2] to-[#ffffff]',
            textColor: 'text-rose-950',
            accentColor: 'text-orange-500',
            buttonClass: 'bg-[#1d1d1f] text-white',
            ringColor: 'text-orange-500/20',
            isDark: false,
            theme: 'evening'
        },
        night: {
            gradient: 'from-[#321d28] via-[#24151c] to-[#1a1014]',
            textColor: 'text-rose-50/90',
            accentColor: 'text-rose-300',
            buttonClass: 'bg-rose-50 text-[#321d28]',
            ringColor: 'text-rose-300/30',
            isDark: true,
            theme: 'night'
        },
    };

    return themes[theme];
}
