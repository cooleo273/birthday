'use client';

import { useEffect, useState } from 'react';
import { getMemories } from '@/lib/actions';
import PolaroidCard from '@/components/ui/PolaroidCard';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { motion } from 'framer-motion';
import ConfettiEffect from '@/components/ui/ConfettiEffect';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Memory } from '@/types/database';
import { cn } from '@/lib/utils';

export default function MemoryGallery() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const theme = useTimeTheme();

    useEffect(() => {
        async function fetchMemories() {
            const data = await getMemories();
            setMemories(data);
        }
        fetchMemories();
    }, []);

    const decorativeEmojis = ['📸', '✨', '💖', '🌸', '🎞️', '💌', '🦢', '☁️', '🌹', '💎', '🎨', '🌙', '💍', '🥂', '🍰', '🧸'];

    return (
        <main className={cn("min-h-screen pt-24 pb-48 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <ConfettiEffect active={true} />
            <FloatingBackground isDark={theme.isDark} count={14} />

            {/* Decorative Emojis Scattered */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-30">
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-4xl"
                        initial={{ opacity: 0, scale: 0, rotate: -20 }}
                        animate={{
                            opacity: [0, 0.6, 0.3, 0.6, 0],
                            y: [0, -60, 0],
                            scale: [0.8, 1.2, 1],
                            rotate: [0, 15, -15, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 8,
                            repeat: Infinity,
                            delay: Math.random() * 10
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        {decorativeEmojis[Math.floor(Math.random() * decorativeEmojis.length)]}
                    </motion.div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto px-6 mb-24 text-center relative z-10">
                <div className="flex justify-center mb-12">
                    <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-40 hover:opacity-100", theme.textColor)}>
                        <ArrowLeft size={16} />
                        <span className="label-ui text-[10px]">Home</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <h1 className={cn("mb-6 serif-display italic leading-none text-[36px] sm:text-[48px] md:text-[80px]", theme.textColor)}>
                        Our <span className={cn("drop-shadow-[0_0_20px_rgba(225,29,72,0.15)]", theme.accentColor)}>Story.</span>
                    </h1>
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <span className={cn("h-[1px] w-16 bg-gradient-to-r from-transparent via-rose-200 to-transparent", theme.isDark ? "opacity-20" : "")} />
                        <p className={cn("opacity-40 text-[10px] tracking-[0.6em] uppercase font-black", theme.textColor)}>
                            Moments frozen in time
                        </p>
                        <span className={cn("h-[1px] w-16 bg-gradient-to-r from-transparent via-rose-200 to-transparent", theme.isDark ? "opacity-20" : "")} />
                    </div>
                </motion.div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-6 sm:gap-12 justify-center px-4 sm:px-6 max-w-7xl mx-auto">
                {memories.map((memory, index) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="w-[260px] sm:w-[320px] group"
                    >
                        <PolaroidCard
                            title={memory.title}
                            date={memory.date ? new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : undefined}
                            story={memory.story ?? undefined}
                            imageUrl={memory.image_url ?? undefined}
                            rotation={index % 2 === 0 ? 1.5 : -1.5}
                        />
                    </motion.div>
                ))}

                {memories.length === 0 && (
                    <div className={cn(
                        "col-span-full text-center py-32 rounded-[3rem] border border-dashed w-full max-w-2xl",
                        theme.isDark ? "bg-white/5 border-white/10" : "bg-rose-50/30 border-rose-100"
                    )}>
                        <div className="text-5xl mb-6">📸</div>
                        <p className={cn("opacity-40 serif-display italic text-xl", theme.textColor)}>Curating moments...</p>
                    </div>
                )}
            </div>
        </main>
    );
}
