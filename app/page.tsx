'use client';

import { motion } from 'framer-motion';
import CountdownTimer from '@/components/ui/CountdownTimer';
import FloatingBackground from '@/components/ui/FloatingBackground';
import SecretLoveTap from '@/components/features/SecretLoveTap';
import Link from 'next/link';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';

const BIRTHDAY_DATE = "2026-05-19T00:00:00";

export default function Home() {
  const theme = useTimeTheme();

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br ${theme.gradient} relative overflow-hidden transition-colors duration-1000`}>
      <FloatingBackground isDark={theme.isDark} count={12} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center z-10 max-w-4xl w-full"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-6 label-ui tracking-[0.4em]"
        >
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </motion.div>

        <h1 className={`mb-4 select-none ${theme.textColor}`}>
          Happy Birthday,{' '}
          <SecretLoveTap className="serif-display opacity-90">my love.</SecretLoveTap>
        </h1>

        <p className={`mb-16 font-medium ${theme.textColor} opacity-60`}>
          A small world I made for you.
        </p>

        <div className="mb-12 md:mb-20">
          <CountdownTimer targetDate={BIRTHDAY_DATE} />
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-8 justify-center items-center">
          <Link href="/calendar">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn("btn-apple shadow-romantic-rose/10", theme.buttonClass)}
            >
              The Journey
            </motion.button>
          </Link>

          <Link href="/universe">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "btn-romantic-ghost",
                theme.isDark ? "ghost-white" : ""
              )}
            >
              Universe
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
