'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe viewport prefs: defaults match desktop / no reduced motion until mounted.
 */
export function useViewportMotion() {
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mqNarrow = window.matchMedia('(max-width: 639px)');
        const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

        const sync = () => {
            setIsMobileViewport(mqNarrow.matches);
            setPrefersReducedMotion(mqReduce.matches);
        };

        sync();
        mqNarrow.addEventListener('change', sync);
        mqReduce.addEventListener('change', sync);
        return () => {
            mqNarrow.removeEventListener('change', sync);
            mqReduce.removeEventListener('change', sync);
        };
    }, []);

    return { isMobileViewport, prefersReducedMotion };
}
