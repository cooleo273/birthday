'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Star, Sparkles, ArrowLeft } from 'lucide-react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const NIGHT_MESSAGES = [
    "As you close your eyes tonight, know that you are thought of with all the warmth in my heart. Good night, Hana. 🌙",
    "Stars are beautiful, but they don't compare to you. Dream sweetly tonight, my love. ✨",
    "May your dreams tonight be as magical as you make every ordinary day feel. Good night. 💫",
    "Sleep well, Hana. When you wake up there will be a whole new day of reasons to smile waiting for you. 🌸",
    "The moon is shining for you tonight. And so am I, in my own little way. Good night. 🌟",
];

export default function DreamPage() {
    const [messageIdx] = useState(Math.floor(Math.random() * NIGHT_MESSAGES.length));
    const theme = useTimeTheme();

    return (
        <main className={cn("min-h-screen pt-16 pb-32 px-4 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            {/* Ambient Stars - always there but subtler in morning */}
            {Array.from({ length: 60 }).map((_, i) => (
                <motion.div
                    key={i}
                    className={cn("absolute rounded-full", theme.isDark ? "bg-white" : "bg-rose-400")}
                    style={{
                        width: Math.random() * 2 + 1,
                        height: Math.random() * 2 + 1,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: theme.isDark ? Math.random() * 0.5 : Math.random() * 0.1,
                    }}
                    animate={{ opacity: theme.isDark ? [0.1, 0.5, 0.1] : [0.05, 0.15, 0.05] }}
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 3 }}
                />
            ))}

            {/* Subtle Moon/Sun Indicator */}
            <motion.div
                className={cn("absolute top-16 sm:top-24 right-6 sm:right-12 transition-colors duration-1000", theme.accentColor, "opacity-20")}
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
                {theme.theme === 'night' ? (
                    <Moon className="w-16 h-16 sm:w-[120px] sm:h-[120px]" fill="currentColor" strokeWidth={0.5} />
                ) : (
                    <Sparkles className="w-16 h-16 sm:w-[120px] sm:h-[120px]" strokeWidth={0.5} />
                )}
            </motion.div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors mb-14 group opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>

                <div className="text-center max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Star className={cn("mx-auto mb-8", theme.accentColor)} size={48} fill="currentColor" />
                        <h1 className={cn("text-4xl md:text-6xl font-serif italic mb-4", theme.textColor)}>
                            Dream <span className="serif-display">Mode.</span>
                        </h1>
                        <p className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-12 opacity-40", theme.textColor)}>A quiet moment just for you</p>

                        {!theme.isDark && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={cn("mb-12 px-6 py-2 rounded-full border text-[10px] uppercase tracking-widest inline-block", 
                                    theme.isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5",
                                    theme.textColor, "opacity-40"
                                )}
                            >
                                This page is most magical at night 🌙
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 1.2 }}
                            className={cn(
                                "glass-card p-6 sm:p-10 md:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl transition-all duration-700",
                                theme.isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-black/5"
                            )}
                        >
                            <p className={cn("text-base md:text-lg font-serif leading-relaxed italic opacity-80", theme.textColor)}>
                                "{NIGHT_MESSAGES[messageIdx]}"
                            </p>
                        </motion.div>

                        <motion.button
                            onClick={() => window.location.reload()}
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className={cn("mt-16 text-[9px] font-bold uppercase tracking-[0.3em] hover:opacity-100 transition-opacity", theme.textColor)}
                        >
                            Refresh for a new message
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
