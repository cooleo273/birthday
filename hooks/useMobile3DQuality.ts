'use client';

import { useEffect, useMemo, useState } from 'react';
import { useViewportMotion } from '@/hooks/useViewportMotion';

export type Mobile3DQualitySettings = {
    /** True when narrow viewport or coarse pointer — use lighter scene */
    isMobileCoarse: boolean;
    dpr: [number, number];
    starsDark: number;
    starsLight: number;
    sparklesDark: number;
    sparklesLight: number;
    dustCount: number;
    htmlOccludeBlending: boolean;
    useFloatOnCards: boolean;
    cardBackdropClass: string;
    cardGlowBlurClass: string;
    prefersReducedMotion: boolean;
};

export function useMobile3DQuality(): Mobile3DQualitySettings {
    const { isMobileViewport, prefersReducedMotion } = useViewportMotion();
    const [pointerCoarse, setPointerCoarse] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(pointer: coarse)');
        const sync = () => setPointerCoarse(mq.matches);
        sync();
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);

    const isMobileCoarse = isMobileViewport || pointerCoarse;

    return useMemo(() => {
        if (!isMobileCoarse) {
            const maxDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2;
            const calm = prefersReducedMotion;
            return {
                isMobileCoarse: false,
                dpr: [1, maxDpr] as [number, number],
                starsDark: calm ? 1600 : 3800,
                starsLight: calm ? 1000 : 2400,
                sparklesDark: calm ? 35 : 90,
                sparklesLight: calm ? 24 : 60,
                dustCount: calm ? 500 : 1400,
                htmlOccludeBlending: true,
                useFloatOnCards: !calm,
                cardBackdropClass: calm ? 'backdrop-blur-sm' : 'backdrop-blur-xl',
                cardGlowBlurClass: calm ? 'blur-lg' : 'blur-2xl',
                prefersReducedMotion,
            };
        }

        return {
            isMobileCoarse: true,
            dpr: [1, 1.25] as [number, number],
            starsDark: 800,
            starsLight: 600,
            sparklesDark: 25,
            sparklesLight: 20,
            dustCount: 400,
            htmlOccludeBlending: false,
            useFloatOnCards: false,
            cardBackdropClass: 'backdrop-blur-sm',
            cardGlowBlurClass: 'blur-lg',
            prefersReducedMotion,
        };
    }, [isMobileCoarse, prefersReducedMotion]);
}
