'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

/** Personalize this — she’ll see it after triple-tapping “my love.” on the home page */
const SECRET_TITLE = 'You found it';
const SECRET_LINES = [
    'Hana — some surprises are hidden on purpose, just like the way you still surprise me every day.',
    'If you’re reading this, you were curious enough to peek where it mattered. That’s one of a million reasons I adore you.',
    'Happy birthday, my love. This whole little world was built with you in mind.',
];

const TAP_RESET_MS = 550;
const CONFETTI_SESSION_KEY = 'birthday.secret-love-confetti.v1';

export default function SecretLoveTap({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const tapRef = useRef({ count: 0, lastAt: 0 });

    const burstConfetti = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            if (sessionStorage.getItem(CONFETTI_SESSION_KEY)) return;
            sessionStorage.setItem(CONFETTI_SESSION_KEY, '1');
        } catch {
            /* private mode */
        }
        confetti({
            particleCount: 160,
            spread: 120,
            origin: { y: 0.55 },
            colors: ['#fb7185', '#f43f5e', '#ffffff', '#fde68a', '#fda4af'],
        });
    }, []);

    const handleActivate = useCallback(() => {
        burstConfetti();
        setOpen(true);
    }, [burstConfetti]);

    const handlePointerUp = useCallback(() => {
        const now = Date.now();
        if (now - tapRef.current.lastAt > TAP_RESET_MS) tapRef.current.count = 0;
        tapRef.current.lastAt = now;
        tapRef.current.count += 1;
        if (tapRef.current.count >= 3) {
            tapRef.current.count = 0;
            handleActivate();
        }
    }, [handleActivate]);

    return (
        <>
            <span
                role="button"
                tabIndex={0}
                aria-label="Triple-tap for a hidden note"
                className={cn('inline touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-romantic-rose/40 rounded-sm', className)}
                onPointerUp={handlePointerUp}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePointerUp();
                    }
                }}
            >
                {children}
            </span>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[480] flex items-center justify-center bg-black/65 sm:bg-black/40 sm:backdrop-blur-sm p-6"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 16 }}
                            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-md w-full rounded-[2rem] border border-rose-100/80 bg-white/95 p-10 sm:p-12 text-center shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center justify-center gap-2 mb-3 text-rose-400">
                                <Sparkles size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.35em]">Just for you</span>
                                <Sparkles size={16} />
                            </div>

                            <div className="flex justify-center mb-5">
                                <motion.div
                                    animate={{ scale: [1, 1.08, 1] }}
                                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Heart size={44} className="text-romantic-pink" fill="currentColor" />
                                </motion.div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-rose-900 mb-5">{SECRET_TITLE}</h2>
                            <div className="space-y-4 text-rose-700/90 text-base sm:text-lg leading-relaxed">
                                {SECRET_LINES.map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
