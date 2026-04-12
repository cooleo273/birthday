'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { isEasterSunday } from '@/lib/easter';
import { useViewportMotion } from '@/hooks/useViewportMotion';
import { cn } from '@/lib/utils';

const EASTER_HEADLINE = 'Happy Easter, Hana';
const EASTER_LINES = [
    'Today the whole world is hunting for eggs — but I already found the best treasure.',
    'You make every season feel like spring. Thank you for being you.',
    'Enjoy this little corner of the internet, made only for you.',
];

const CONFETTI_SESSION_KEY = 'birthday.easter-confetti.v1';

function EasterEggGraphic({ className }: Readonly<{ className?: string }>) {
    return (
        <svg
            viewBox="0 0 120 160"
            className={cn('drop-shadow-lg', className)}
            aria-hidden
        >
            <defs>
                <linearGradient id="eggShell" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="45%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#f9a8d4" />
                </linearGradient>
                <linearGradient id="eggShine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
            </defs>
            <ellipse cx="60" cy="82" rx="48" ry="62" fill="url(#eggShell)" />
            <ellipse cx="44" cy="64" rx="14" ry="28" fill="url(#eggShine)" transform="rotate(-12 44 64)" />
            <path
                d="M 28 88 Q 60 72 92 88"
                fill="none"
                stroke="#f472b6"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.5"
            />
            <circle cx="52" cy="100" r="5" fill="#a7f3d0" opacity="0.85" />
            <circle cx="72" cy="108" r="4" fill="#93c5fd" opacity="0.85" />
            <circle cx="60" cy="118" r="3.5" fill="#fcd34d" opacity="0.9" />
        </svg>
    );
}

export default function EasterHomeBanner({
    textColorClass,
    isDark,
}: Readonly<{
    textColorClass: string;
    isDark: boolean;
}>) {
    const { prefersReducedMotion } = useViewportMotion();
    const isTodayEaster = isEasterSunday(new Date());

    useEffect(() => {
        if (!isTodayEaster || prefersReducedMotion) return;
        try {
            if (sessionStorage.getItem(CONFETTI_SESSION_KEY)) return;
            sessionStorage.setItem(CONFETTI_SESSION_KEY, '1');
        } catch {
            /* private mode */
        }
        confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.35 },
            colors: ['#fde68a', '#fbcfe8', '#a7f3d0', '#bfdbfe', '#fef08a', '#fda4af'],
        });
    }, [isTodayEaster, prefersReducedMotion]);

    if (!isTodayEaster) return null;

    const eggMotion = prefersReducedMotion
        ? {}
        : {
              y: [0, -6, 0],
              rotate: [-4, 4, -4],
          };
    const eggTransition = prefersReducedMotion
        ? undefined
        : {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut' as const,
          };

    return (
        <div className="mb-8 flex flex-col items-center gap-4">
            <motion.div
                className="w-[4.5rem] sm:w-20"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <motion.div animate={eggMotion} transition={eggTransition}>
                    <EasterEggGraphic />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
                className="max-w-md px-2"
            >
                <p
                    className={cn(
                        'font-semibold tracking-tight text-lg sm:text-xl mb-2',
                        textColorClass,
                        isDark ? 'text-amber-100/95' : 'text-rose-900/90'
                    )}
                >
                    {EASTER_HEADLINE}
                </p>
                <div
                    className={cn(
                        'space-y-2 text-sm sm:text-base leading-relaxed',
                        textColorClass,
                        'opacity-80'
                    )}
                >
                    {EASTER_LINES.map((line) => (
                        <p key={line}>{line}</p>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
