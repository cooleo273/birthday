'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail } from 'lucide-react';

interface Props {
    title: string;
    content: string;
    dayNumber: number;
}

export default function EnvelopeLetter({ title, content, dayNumber }: Props) {
    const [opened, setOpened] = useState(false);
    const [letterVisible, setLetterVisible] = useState(false);

    function handleOpen() {
        if (opened) return;
        setOpened(true);
        setTimeout(() => setLetterVisible(true), 700);
    }

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
            {/* Envelope */}
            <div className="relative cursor-pointer" onClick={handleOpen} style={{ perspective: 1000 }}>
                <motion.div
                    className="relative w-72 md:w-96 h-48 md:h-60"
                    animate={opened ? { scale: 0.85, opacity: 0.6 } : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Envelope body */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                        style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffe4e8 100%)' }}
                    >
                        {/* Inner shadow lines */}
                        <div className="absolute inset-4 border border-rose-200/60 rounded-lg" />

                        {/* Bottom flap decoration */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/2">
                            <div style={{
                                width: '100%', height: '100%',
                                background: 'linear-gradient(to top right, #fda4af 0%, transparent 50%), linear-gradient(to top left, #fda4af 0%, transparent 50%)',
                            }} />
                        </div>
                    </div>

                    {/* Top flap — animates open */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-1/2 origin-top z-10"
                        style={{
                            background: 'linear-gradient(to bottom right, #ffe4e8, #fecdd3)',
                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                            borderRadius: '1rem 1rem 0 0',
                        }}
                        animate={opened ? { rotateX: -180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />

                    {/* Heart seal */}
                    {!opened && (
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                            whileHover={{ scale: 1.1, rotate: 15 }}
                        >
                            <Heart size={36} className="text-rose-500" fill="currentColor" />
                        </motion.div>
                    )}

                    {!opened && (
                        <motion.p
                            className="absolute bottom-4 w-full text-center text-xs text-rose-400 font-semibold tracking-widest"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Click to open ✨
                        </motion.p>
                    )}
                </motion.div>
            </div>

            {/* Letter Content */}
            <AnimatePresence>
                {letterVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
                        className="w-full"
                    >
                        {/* Letter paper */}
                        <div className="relative bg-gradient-to-br from-white via-rose-50/30 to-pink-50/30 p-8 md:p-12 rounded-3xl shadow-2xl border border-rose-100/60"
                            style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #ffd6d6 31px, #ffd6d6 32px)' }}
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <Mail size={20} className="text-rose-400" />
                                    <span className="text-xs text-rose-400 font-bold uppercase tracking-[0.3em]">Day {dayNumber}</span>
                                </div>
                                <h2 className="text-3xl font-serif font-bold text-rose-800 mb-6">{title}</h2>
                                <div className="prose text-rose-700/80 text-lg leading-relaxed font-medium whitespace-pre-wrap italic">
                                    {content}
                                </div>
                                <div className="mt-8 text-right">
                                    <Heart size={24} className="inline text-rose-400" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
