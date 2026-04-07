'use client';

import { motion } from 'framer-motion';
import { Star, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';

export default function SecretPage() {
    const theme = useTimeTheme();

    return (
        <main className={cn("min-h-screen pt-16 pb-32 px-4 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            {/* Soft decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={cn("absolute rounded-full", theme.isDark ? "bg-white" : "bg-rose-400")}
                        style={{
                            width: Math.random() * 3 + 'px',
                            height: Math.random() * 3 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: theme.isDark ? Math.random() * 0.4 : Math.random() * 0.1,
                        }}
                        animate={{
                            opacity: theme.isDark ? [0.1, 0.4, 0.1] : [0.05, 0.15, 0.05],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-40 hover:opacity-100 mb-8", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Back to Home</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="relative inline-block">
                        <Star size={80} className={cn("animate-pulse mx-auto", theme.accentColor)} fill="currentColor" />
                        <Sparkles size={40} className={cn("absolute -top-4 -right-4 animate-spin-slow opacity-20", theme.textColor)} />
                    </div>

                    <div className="space-y-6">
                        <h1 className={cn("text-5xl md:text-7xl font-serif italic tracking-tight", theme.textColor)}>You Found It.</h1>
                        <p className={cn("text-xl md:text-2xl leading-relaxed italic serif-display opacity-70", theme.textColor)}>
                            "If I had a star for every time you made me smile, I would be holding a whole galaxy in my hands."
                        </p>
                    </div>

                    <Link href="/calendar">
                        <button className={cn("btn-apple text-xs flex items-center gap-3 mx-auto", theme.buttonClass)}>
                            <Star size={14} />
                            <span>Return to Journey</span>
                        </button>
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
