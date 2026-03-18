'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface EasterEgg {
    id: string;
    phrase: string;
    title: string;
    message: string;
    emoji: string;
}

const EASTER_EGGS: EasterEgg[] = [
    {
        id: 'iloveyou',
        phrase: 'iloveyou',
        title: 'I Love You Too',
        message: 'More than stars in the sky, more than words can say. Always and forever.',
        emoji: '💞',
    },
    {
        id: 'hana',
        phrase: 'hana',
        title: 'That\'s You!',
        message: 'You found your own name. Of course you did — you\'re brilliant. ✨',
        emoji: '🌸',
    },
    {
        id: 'forever',
        phrase: 'forever',
        title: 'Forever',
        message: 'That\'s exactly how long I want to make you feel this loved.',
        emoji: '♾️',
    },
];

export default function EasterEggDetector() {
    const [typed, setTyped] = useState('');
    const [active, setActive] = useState<EasterEgg | null>(null);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            // Ignore when typing in inputs
            if (['INPUT', 'TEXTAREA'].includes((e.target as Element)?.tagName)) return;
            const key = e.key.toLowerCase();
            if (key.length !== 1 || !/[a-z]/.test(key)) return;

            setTyped((prev) => {
                const next = (prev + key).slice(-10);
                const found = EASTER_EGGS.find((egg) => next.endsWith(egg.phrase));
                if (found) {
                    setActive(found);
                    return '';
                }
                return next;
            });
        }

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-lg"
                    onClick={() => setActive(null)}
                >
                    <motion.div
                        initial={{ scale: 0.5, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/90 backdrop-blur-2xl max-w-md w-full mx-6 p-12 rounded-[3rem] shadow-2xl text-center border border-rose-100/80"
                    >
                        <button onClick={() => setActive(null)} className="absolute top-5 right-5 text-neutral-300 hover:text-neutral-500">
                            <X size={18} />
                        </button>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-7xl mb-6"
                        >
                            {active.emoji}
                        </motion.div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles size={14} className="text-rose-400" />
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-400">Secret Found</span>
                            <Sparkles size={14} className="text-rose-400" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-rose-800 mb-4">{active.title}</h2>
                        <p className="text-rose-600 italic text-lg leading-relaxed">{active.message}</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
