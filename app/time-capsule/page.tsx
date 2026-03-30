'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Lock, MailOpen, Heart, Clock } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';

const TARGET_DATE = new Date("2026-05-19T00:00:00");

export default function TimeCapsulePage() {
    const theme = useTimeTheme();
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Add a small delay for demo purposes, or just rely on the strict date
        const checkUnlock = () => {
            if (new Date() >= TARGET_DATE) {
                setIsUnlocked(true);
            }
        };
        checkUnlock();
        
        // Secret unlock for previewing (remove in prod if strictness is required)
        // Adding a secret window hack so the user can test it before May 19
        (window as any).unlockCapsule = () => setIsUnlocked(true);
        
        const interval = setInterval(checkUnlock, 1000 * 60); // Check every minute
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <main className={cn("min-h-screen pt-24 pb-48 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={8} />

            <div className="absolute top-12 left-0 right-0 z-20 px-6 max-w-4xl mx-auto">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>
            </div>

            <div className="max-w-2xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {!isUnlocked ? (
                        <motion.div
                            key="locked"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="flex flex-col items-center text-center space-y-8"
                        >
                            <div className="relative group">
                                <motion.div 
                                    className={cn("w-48 h-32 rounded-lg border-2 flex items-center justify-center relative shadow-2xl overflow-hidden", 
                                        theme.isDark ? "bg-stone-800/80 border-stone-600/50" : "bg-rose-50/80 border-rose-200"
                                    )}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1/2 border-b-2 border-dashed border-current opacity-20 origin-top" style={{ transform: 'perspective(500px) rotateX(20deg)' }} />
                                    <div className={cn("w-12 h-12 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-2 z-10",
                                        theme.isDark ? "bg-stone-900 border-rose-900" : "bg-white border-rose-300"
                                    )}>
                                        <Lock size={18} className={theme.isDark ? "text-rose-500" : "text-rose-400"} />
                                    </div>
                                </motion.div>
                            </div>

                            <div>
                                <h1 className={cn("mb-4 text-3xl serif-display italic", theme.textColor)}>Sealed Until Your Birthday</h1>
                                <p className={cn("opacity-60 text-sm max-w-sm mx-auto mb-8", theme.textColor)}>
                                    Some words are meant to be read at exactly the right time.
                                </p>
                                <div className="scale-90 opacity-80">
                                    <CountdownTimer targetDate={TARGET_DATE.toISOString()} />
                                </div>
                            </div>
                        </motion.div>
                    ) : !isOpened ? (
                        <motion.div
                            key="unlocked"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="flex flex-col items-center text-center space-y-8 cursor-pointer"
                            onClick={() => setIsOpened(true)}
                        >
                            <motion.div 
                                className={cn("w-56 h-40 rounded-lg flex items-center justify-center relative shadow-[0_0_40px_rgba(225,29,72,0.3)] hover:shadow-[0_0_60px_rgba(225,29,72,0.5)] transition-shadow duration-500", 
                                    theme.isDark ? "bg-stone-800" : "bg-rose-100"
                                )}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className={cn("w-14 h-14 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 shadow-lg",
                                    theme.isDark ? "bg-rose-900" : "bg-rose-300"
                                )}>
                                    <Heart size={20} className="text-white fill-current animate-pulse" />
                                </div>
                                <div className="absolute -bottom-10 text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 flex items-center gap-2">
                                    <MailOpen size={12} /> Tap to open
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="letter"
                            initial={{ opacity: 0, y: 40, rotateX: 20 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            className={cn(
                                "w-full max-w-lg p-8 sm:p-12 rounded-[2rem] shadow-2xl text-left relative",
                                theme.isDark ? "bg-[#1c1c1a] text-[#e8e6e3] border border-white/5" : "bg-[#fdfbf7] text-stone-800 border border-stone-200"
                            )}
                            style={{ 
                                backgroundImage: `radial-gradient(${theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'} 1px, transparent 1px)`,
                                backgroundSize: '20px 20px'
                            }}
                        >
                            <span className="absolute top-6 right-8 text-xl opacity-20">❝</span>
                            
                            <div className="mb-8 border-b border-current/10 pb-4 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-1">To My Love,</p>
                                    <p className="font-serif italic text-lg opacity-80">May 19th, 2026</p>
                                </div>
                            </div>

                            <div className="space-y-6 font-serif leading-relaxed sm:text-lg opacity-90">
                                <p>
                                    If you're reading this, it means another beautiful year of your life has begun. I wanted to write something that would wait for you—a little capsule of my thoughts captured in time.
                                </p>
                                <p>
                                    Every day with you feels like discovering a new favorite constellation. You bring so much warmth, laughter, and light into everything you touch. I hope this year brings you as much joy as you give to the world (and to me, especially).
                                </p>
                                <p>
                                    I love you more than any string of code or collection of words could ever express. Here's to all the memories we've made, and to the infinite ones we have yet to create.
                                </p>
                            </div>

                            <div className="mt-12 pt-6 border-t border-current/10 text-right">
                                <p className="font-serif italic text-xl">Forever yours,</p>
                                <p className="mt-2 text-sm uppercase tracking-widest opacity-50 font-bold flex items-center justify-end gap-2"><Heart size={14} className="fill-current" /> Me</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Secret hack instruction for the previewer */}
            <div className="fixed bottom-4 left-4 opacity-10 hover:opacity-100 transition-opacity text-[8px] bg-black/50 text-white p-2 rounded">
                Console: window.unlockCapsule()
            </div>
        </main>
    );
}
