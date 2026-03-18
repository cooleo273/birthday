'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Heart } from 'lucide-react';
import { getCurrentDay, isDayUnlocked, TOTAL_DAYS } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { useTimeTheme } from '@/hooks/useTimeTheme';
export default function CalendarGrid() {
    const currentDay = getCurrentDay();
    const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);
    const theme = useTimeTheme();

    return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 max-w-6xl mx-auto mb-36 pb-safe">
        {days.map((day) => {
            const unlocked = isDayUnlocked(day);
            const isToday = day === currentDay;

            return (
                <motion.div
                    key={day}
                    whileHover={unlocked ? { y: -3, scale: 1.02 } : {}}
                    whileTap={unlocked ? { scale: 0.98 } : {}}
                >
                    <Link
                        href={unlocked ? `/day/${day}` : '#'}
                        className={cn(
                            "relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-500 border text-xs sm:text-sm",
                            unlocked
                                ? cn("bg-white/40 backdrop-blur-xl border-white/40 shadow-sm hover:shadow-xl hover:bg-white/60", theme.textColor)
                                : cn("bg-black/[0.03] border-black/[0.05] cursor-not-allowed opacity-20", theme.textColor),
                            isToday && cn("ring-2 ring-offset-4 shadow-2xl z-10", theme.isDark ? "ring-white ring-offset-black" : "ring-black ring-offset-white")
                        )}
                    >
                        {!unlocked && <Lock className="w-3 h-3 opacity-20" />}

                        <span className={cn(
                            "text-base md:text-xl font-medium tracking-tight",
                            !unlocked && "opacity-20"
                        )}>
                            {day}
                        </span>

                        {unlocked && (
                            <div className="absolute bottom-2 text-[8px] font-bold uppercase tracking-widest opacity-20">
                                {isToday ? "Today" : "Open"}
                            </div>
                        )}
                    </Link>
                </motion.div>
            );
        })}
    </div>
);
}
