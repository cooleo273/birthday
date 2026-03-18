'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [percentage, setPercentage] = useState(0);
    const theme = useTimeTheme();

    useEffect(() => {
        const calculate = () => {
            const now = new Date();
            const target = new Date(targetDate);
            const start = new Date("2026-03-09T00:00:00"); // Journey Start

            const diff = +target - +now;
            const totalRange = +target - +start;
            const progress = 1 - (diff / totalRange);

            setPercentage(Math.max(0, Math.min(1, progress)));

            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                });
            }
        };

        calculate();
        const t = setInterval(calculate, 1000);
        return () => clearInterval(t);
    }, [targetDate]);

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage * circumference);

    return (
        <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 md:w-48 md:h-48 transform -rotate-90">
                {/* Background Track */}
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    className={cn("fill-none stroke-current", theme.isDark ? "text-white/5" : "text-black/5")}
                    strokeWidth="1.5"
                />
                {/* Progress Ring */}
                <motion.circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    className={cn("fill-none stroke-current", theme.accentColor)}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    style={{ strokeDasharray: circumference }}
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={cn("text-[28px] md:text-[40px] font-semibold tracking-tighter tabular-nums", theme.textColor)}>
                    {timeLeft.days}
                </span>
                <span className={cn("label-ui text-[10px] tracking-[0.3em] -mt-1 opacity-100", theme.textColor)}>
                    Days
                </span>
                <span className={cn("text-[10px] uppercase font-black tracking-widest opacity-20 mt-1", theme.textColor)}>
                    Till May 19
                </span>
            </div>

            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <p className={cn("text-[11px] font-bold tracking-[0.3em] uppercase", theme.textColor, "opacity-40")}>
                    {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                </p>
            </div>
        </div>
    );
}
