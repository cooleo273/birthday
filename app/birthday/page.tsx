'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Gift, Star, PartyPopper } from 'lucide-react';
import Link from 'next/link';

import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';

function fireFireworks() {
    const duration = 20 * 1000;
    const animEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
        const timeLeft = animEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const count = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount: count, origin: { x: rand(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#ff4d6d', '#ff85a2', '#fff', '#ffb703', '#a78bfa'] });
        confetti({ ...defaults, particleCount: count, origin: { x: rand(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ff4d6d', '#ff85a2', '#fff', '#ffb703', '#a78bfa'] });
    }, 250);
}

export default function BirthdayPage() {
    const [step, setStep] = useState(0);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const theme = useTimeTheme();

    useEffect(() => {
        fireFireworks();
    }, []);

    return (
        <main className={cn("min-h-screen pt-16 pb-32 px-4 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.div
                        key="step0"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ type: 'spring', bounce: 0.4 }}
                        className="space-y-10 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]"
                    >
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <PartyPopper className={cn("w-20 h-20 mx-auto", theme.accentColor)} />
                        </motion.div>

                        <div className="text-center">
                            <h1 className={cn("text-5xl md:text-7xl font-serif italic mb-6 tracking-tighter", theme.textColor)}>
                                Happy Birthday,
                                <br />
                                <motion.span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600"
                                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    Hana.
                                </motion.span>
                            </h1>
                            <p className={cn("text-base md:text-lg max-w-xl mx-auto opacity-50 font-medium leading-relaxed serif-display italic", theme.textColor)}>
                                These 60 days were just a small reminder of how much light you bring into my world.
                            </p>
                        </div>

                        <button
                            onClick={() => setStep(1)}
                            className={cn("btn-apple text-sm flex items-center gap-3", theme.buttonClass)}
                        >
                            <Gift size={18} />
                            <span>Open Final Surprise</span>
                        </button>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-5xl mx-auto space-y-16"
                    >
                        <div className="text-center">
                            <h2 className={cn("text-4xl md:text-6xl font-serif italic", theme.textColor)}>Our Journey Together</h2>
                            <p className={cn("mt-4 opacity-40 font-bold uppercase tracking-[0.3em] text-[10px]", theme.textColor)}>A final message for you</p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className={cn(
                                "glass-card p-12 md:p-20 rounded-[3.5rem] shadow-2xl relative overflow-hidden",
                                theme.isDark ? "bg-stone-900/60 border-white/5" : "bg-white/40 border-black/5"
                            )}
                        >
                            <div className={cn("absolute -top-10 -right-10 opacity-5", theme.textColor)}>
                                <Heart size={200} fill="currentColor" />
                            </div>
                            
                            <p className={cn("text-2xl md:text-3xl font-serif leading-relaxed italic relative z-10 mb-10 opacity-80", theme.textColor)}>
                                "Hana, from the very first day of this journey to this final celebration — every moment was a gift. You bring joy to everyone you meet, and you deserve all the love in the universe."
                            </p>
                            
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center bg-rose-500/10", theme.accentColor)}>
                                    <Heart size={24} fill="currentColor" />
                                </div>
                                <p className={cn("text-xl md:text-2xl font-black tracking-tight", theme.textColor)}>
                                    Happy Birthday, Hana. ❤️
                                </p>
                            </div>
                        </motion.div>

                        <button
                            type="button"
                            onClick={() => setIsVideoOpen(true)}
                            className={cn(
                                "aspect-video w-full rounded-[3rem] shadow-2xl overflow-hidden border-8 relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-rose-400/50",
                                theme.isDark ? "bg-stone-950 border-white/5" : "bg-black border-white/60"
                            )}
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 bg-gradient-to-br from-neutral-900 to-rose-950 opacity-90 group-hover:scale-105 transition-transform duration-1000">
                                <Gift size={60} className="mb-6 animate-bounce" />
                                <p className="text-xl md:text-2xl font-serif italic text-white/60">Your Video Montage</p>
                                <div className="mt-8 px-6 py-2 rounded-full border border-white/10 text-[9px] font-bold uppercase tracking-[0.3em]">
                                    Click to play
                                </div>
                            </div>
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { Icon: Heart, title: 'My Promise', text: 'To love you more every single day than I did the day before.', delay: 0.5 },
                                { Icon: Star, title: 'Your Magic', text: 'You make the world brighter just by existing in it.', delay: 0.6 },
                                { Icon: Sparkles, title: 'Always Yours', text: 'Today and for all the birthdays we\'ll share together.', delay: 0.7 },
                            ].map(({ Icon, title, text, delay }) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay }}
                                    whileHover={{ y: -5 }}
                                    className={cn(
                                        "glass-card p-10 rounded-[2.5rem] text-center shadow-xl transition-all duration-500",
                                        theme.isDark ? "bg-white/5 border-white/5" : "bg-white/40 border-white/60"
                                    )}
                                >
                                    <Icon className={cn("mb-6 mx-auto", theme.accentColor)} size={28} />
                                    <h3 className={cn("font-bold text-lg mb-3 tracking-wide", theme.textColor)}>{title}</h3>
                                    <p className={cn("italic text-sm leading-relaxed opacity-50 serif-display", theme.textColor)}>{text}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <Link href="/">
                                <button className={cn("btn-apple text-xs flex items-center gap-3", theme.buttonClass)}>
                                    <Heart size={14} />
                                    <span>Return to Our Journey</span>
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isVideoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className={cn(
                        "w-full max-w-3xl mx-4 rounded-3xl overflow-hidden shadow-2xl border",
                        theme.isDark ? "bg-stone-900 border-white/10" : "bg-white border-black/10"
                    )}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <p className={cn("text-sm font-semibold uppercase tracking-[0.25em]", theme.textColor)}>
                                Final Montage
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsVideoOpen(false)}
                                className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 hover:text-white"
                            >
                                Close
                            </button>
                        </div>
                        <div className="bg-black aspect-video">
                            <video
                                src="/birthday-montage.mp4"
                                controls
                                className="w-full h-full"
                            />
                        </div>
                        <div className="px-6 py-4 text-xs opacity-60">
                            You can replace this video file with your real montage at `public/birthday-montage.mp4`.
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
