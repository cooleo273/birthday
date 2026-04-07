'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { getReasons } from '@/lib/actions';
import { getCurrentDay } from '@/lib/date-utils';
import { Reason } from '@/types/database';

export default function ReasonsPage() {
    const [reasons, setReasons] = useState<Reason[]>([]);
    const theme = useTimeTheme();

    useEffect(() => {
        async function fetchReasons() {
            const currentDay = getCurrentDay();
            const data = await getReasons(currentDay);
            setReasons(data);
        }
        fetchReasons();
    }, []);

    return (
        <main className={cn("min-h-screen pt-16 pb-32 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={8} />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors mb-8 md:mb-16 group opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>

                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/40 backdrop-blur-3xl border border-white/40 mb-10 overflow-hidden shadow-2xl flex items-center justify-center">
                        <span className="text-3xl">🌸</span>
                    </div>

                    <h1 className={theme.textColor}>For You.</h1>
                    <p className={cn("mt-4 mb-10 md:mb-20 max-w-md opacity-50", theme.textColor)}>
                        A quiet space where I tell you why you mean so much to me.
                    </p>

                    <div className="w-full max-w-2xl space-y-6">
                        {reasons.length > 0 ? reasons.map((reason, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={reason.id}
                                className="glass-card p-5 sm:p-6 md:p-7 rounded-[2.25rem] border-white/50 text-left"
                            >
                                <span className="label-ui text-[10px] mb-4 block opacity-30">Reason #{reason.unlock_day}</span>
                                <p className="text-base md:text-lg font-medium serif-display italic leading-relaxed">
                                    "{reason.reason_text}"
                                </p>
                            </motion.div>
                        )) : (
                            <div className="py-20 opacity-20 italic serif-display text-xl">
                                Counting the ways...
                            </div>
                        )}
                    </div>

                    <div className="mt-20 opacity-30 flex items-center gap-2">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">More to come</span>
                    </div>
                </div>
            </div>
        </main>
    );
}

