'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

interface Flower {
    id: number;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    emoji: string;
}

const FLOWERS = ['🌸', '🌹', '🌷', '🌺', '🌻', '🌼', '💐', '💮'];

// Firefly component for magical atmosphere
const Firefly = ({ width, height }: { width: number, height: number }) => {
    return (
        <motion.div
            className="absolute rounded-full bg-yellow-200 shadow-[0_0_8px_4px_rgba(253,224,71,0.6)]"
            style={{ width: 4, height: 4 }}
            initial={{
                x: Math.random() * width,
                y: Math.random() * height,
                opacity: 0,
            }}
            animate={{
                x: Math.random() * width,
                y: Math.random() * height,
                opacity: [0, 1, 0],
            }}
            transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
}

const AnimatedFlower = ({ flower }: { flower: Flower }) => {
    return (
        <motion.div
            className="absolute origin-bottom flex flex-col items-center"
            style={{
                left: flower.x,
                top: flower.y,
                scale: 0,
                rotate: flower.rotation,
                zIndex: Math.floor(flower.y), // sort by y
            }}
            animate={{ scale: flower.scale }}
            transition={{
                type: "spring",
                stiffness: 120,
                damping: 10,
                delay: 0.1
            }}
        >
            {/* The Flower Emoji */}
            <motion.div 
                className="text-5xl sm:text-6xl filter drop-shadow-[0_10px_8px_rgba(0,0,0,0.3)] z-10"
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.1, rotate: 6 }}
            >
                {flower.emoji}
            </motion.div>
            
            {/* The Stem */}
            <svg width="40" height="100" viewBox="0 -100 40 100" className="overflow-visible pointer-events-none -mt-4 z-0">
                <motion.path
                    d="M 20 0 Q 30 -50 20 -100"
                    fill="none"
                    stroke="#15803d" /* Dark green stem */
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
                <motion.path
                    d="M 20 -30 Q 0 -40 10 -60 Q 30 -50 20 -30"
                    fill="#16a34a" /* Leaf */
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                />
            </svg>
        </motion.div>
    );
};

export default function GardenPage() {
    const theme = useTimeTheme();
    const [flowers, setFlowers] = useState<Flower[]>([]);
    const [clickCount, setClickCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

    // Initial garden & dimensions
    useEffect(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setDimensions({ w: width, h: height });

        const initialFlowers: Flower[] = [];
        // Plant a few flowers automatically
        for (let i = 0; i < 6; i++) {
            initialFlowers.push(createRandomFlower(
                width * 0.1 + Math.random() * width * 0.8,
                height * 0.5 + Math.random() * height * 0.4 // Plant in bottom half
            ));
        }
        setFlowers(initialFlowers);
    }, []);

    const createRandomFlower = (x: number, y: number): Flower => {
        return {
            id: Date.now() + Math.random(),
            x: x - 20, // offset center
            y: y - 50, // offset to click point as base
            scale: 0.7 + Math.random() * 0.6,
            rotation: -10 + Math.random() * 20, // Slight tilt
            emoji: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
        };
    };

    const handlePlant = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Only plant if clicking roughly in the bottom 70%
        if (y > rect.height * 0.3) {
            setFlowers(prev => [...prev, createRandomFlower(x, y)]);
            setClickCount(c => c + 1);
        }
    };

    return (
        <main className={cn("min-h-screen relative overflow-hidden transition-colors duration-1000",
            theme.isDark 
                ? "bg-gradient-to-b from-[#0b0f19] via-[#1a1c29] to-[#0f3b25]" 
                : "bg-gradient-to-b from-[#e0f2fe] via-[#fce7f3] to-[#86efac]"
        )}>
            <div className="absolute top-12 left-0 right-0 z-50 px-6 flex justify-between items-center max-w-7xl mx-auto pointer-events-none">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-60 hover:opacity-100 pointer-events-auto bg-black/10 backdrop-blur-md px-4 py-2 rounded-full", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>
                <div className={cn("text-right opacity-80 bg-black/10 backdrop-blur-md px-4 py-2 rounded-full", theme.textColor)}>
                    <h1 className="text-xl serif-display italic font-medium tracking-wide drop-shadow-md">Our Garden</h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold drop-shadow-md">Tap the grass</p>
                </div>
            </div>

            {/* Atmosphere (Sun/Moon/Clouds) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Sun or Moon */}
                <motion.div 
                    className={cn(
                        "absolute top-24 right-20 w-32 h-32 rounded-full border border-white/20",
                        theme.isDark 
                            ? "bg-stone-50 shadow-[0_0_100px_40px_rgba(255,255,255,0.4)]" 
                            : "bg-yellow-100 shadow-[0_0_100px_40px_rgba(253,224,71,0.6)]"
                    )}
                    animate={{ y: [0, 15, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Fireflies (only if dark mode or sunset) */}
                {dimensions.w > 0 && Array.from({ length: 20 }).map((_, i) => (
                    <Firefly key={`firefly-${i}`} width={dimensions.w} height={dimensions.h} />
                ))}
            </div>

            {/* Clickable Area */}
            <button
                type="button"
                ref={containerRef}
                className="absolute inset-0 z-10 cursor-crosshair"
                onClick={handlePlant}
                onTouchStart={handlePlant}
                aria-label="Plant a flower"
            >
                <AnimatePresence>
                    {flowers.map(flower => (
                        <AnimatedFlower key={flower.id} flower={flower} />
                    ))}
                </AnimatePresence>
            </button>

            <AnimatePresence>
                {clickCount >= 3 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={cn(
                            "absolute bottom-32 left-1/2 -translate-x-1/2 z-40 text-center px-8 py-4 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] pointer-events-none backdrop-blur-xl border",
                            theme.isDark ? "bg-[#1c1c1a]/80 text-[#e8e6e3] border-white/10" : "bg-white/80 text-emerald-800 border-emerald-200"
                        )}
                    >
                        <p className="serif-display italic tracking-wide text-lg sm:text-2xl flex items-center justify-center gap-3 drop-shadow-sm font-medium">
                            <Heart size={20} className={cn("fill-current", theme.isDark ? "text-rose-500" : "text-rose-400")} /> 
                            Bloom where you are planted 
                            <Heart size={20} className={cn("fill-current", theme.isDark ? "text-rose-500" : "text-rose-400")} /> 
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Grass overlay at the bottom for lush depth */}
            <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none flex flex-col justify-end">
                <div className={cn(
                    "w-full h-32 filter blur-md",
                    theme.isDark ? "bg-[#0b1c11]/80" : "bg-[#4ade80]/60"
                )} />
                <div className={cn(
                    "w-full h-24 filter blur-sm -mt-16",
                    theme.isDark ? "bg-[#051408]" : "bg-[#22c55e]"
                )} />
            </div>
        </main>
    );
}
