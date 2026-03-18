'use client';

import { motion } from 'framer-motion';
import CalendarGrid from '@/components/features/CalendarGrid';
import { cn } from '@/lib/utils';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CalendarPage() {
    const theme = useTimeTheme();

    return (
        <main className={cn("min-h-screen pt-24 pb-48 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={10} />

            <div className="max-w-4xl mx-auto px-6 mb-20 text-center relative z-10">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors mb-12 group opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="label-ui text-[10px]">Back</span>
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("mb-6", theme.textColor)}
                >
                    The <span className="serif-display italic">Journey.</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.2 }}
                    className={cn("text-lg max-w-lg mx-auto", theme.textColor)}
                >
                    Something small for you, every day.
                </motion.p>
            </div>

            <CalendarGrid />
        </main>
    );
}
