'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';

interface Point {
    x: number;
    y: number;
    id: number;
    size: number;
}

export default function ConstellationPage() {
    const theme = useTimeTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [stars, setStars] = useState<Point[]>([]);
    const [connections, setConnections] = useState<[number, number][]>([]);
    const [lastStarId, setLastStarId] = useState<number | null>(null);
    
    // Add hovering state to show potential connections
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    // Generate random stars on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const newStars: Point[] = [];
        for (let i = 0; i < 35; i++) {
            newStars.push({
                x: 20 + Math.random() * (width - 40),
                y: 20 + Math.random() * (height - 40),
                id: i,
                size: 0.8 + Math.random() * 1.5, // Variable star sizes
            });
        }
        setStars(newStars);
    }, []);

    const handleStarClick = (id: number) => {
        if (lastStarId === null) {
            setLastStarId(id);
        } else {
            // Avoid connecting a star to itself
            if (lastStarId !== id) {
                // Check if connection already exists
                const exists = connections.some(
                    ([a, b]) => (a === lastStarId && b === id) || (a === id && b === lastStarId)
                );
                
                if (!exists) {
                    setConnections([...connections, [lastStarId, id]]);
                }
            }
            setLastStarId(id);
        }
    };

    return (
        <main className={cn("min-h-screen relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={14} />

            <div className="absolute top-12 left-0 right-0 z-40 px-6 flex justify-between items-center max-w-7xl mx-auto pointer-events-none">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-60 hover:opacity-100 pointer-events-auto bg-black/10 backdrop-blur-md px-4 py-2 rounded-full", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>
                <div className={cn("text-right opacity-80 bg-black/10 backdrop-blur-md px-4 py-2 rounded-full", theme.textColor)}>
                    <h1 className="text-xl serif-display italic font-medium tracking-wide drop-shadow-md">Our Sky</h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Connect the stars</p>
                </div>
            </div>

            {/* Interactive Canvas Area */}
            <div 
                ref={containerRef} 
                className="absolute inset-0 z-10 pt-32 pb-32"
                onClick={() => setLastStarId(null)} // Click empty space to unselect
            >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Draw existing connections */}
                    {connections.map(([starAId, starBId], index) => {
                        const starA = stars.find(s => s.id === starAId);
                        const starB = stars.find(s => s.id === starBId);
                        if (!starA || !starB) return null;

                        return (
                            <motion.line
                                key={`line-${index}`}
                                x1={starA.x}
                                y1={starA.y}
                                x2={starB.x}
                                y2={starB.y}
                                stroke={theme.isDark ? "rgba(255,180,200,0.8)" : "rgba(255,100,150,0.6)"}
                                strokeWidth="2.5"
                                strokeDasharray="4 4" // Dashed line to look more "constellation-like"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            />
                        );
                    })}
                    
                    {/* Draw potential connection line if hovering */}
                    {lastStarId !== null && hoveredStar !== null && hoveredStar !== lastStarId && (
                        (() => {
                            const starA = stars.find(s => s.id === lastStarId);
                            const starB = stars.find(s => s.id === hoveredStar);
                            if (!starA || !starB) return null;
                            return (
                                <motion.line
                                    x1={starA.x}
                                    y1={starA.y}
                                    x2={starB.x}
                                    y2={starB.y}
                                    stroke="rgba(255,255,255,0.4)"
                                    strokeWidth="1.5"
                                    strokeDasharray="2 6"
                                />
                            );
                        })()
                    )}
                </svg>

                {stars.map((star) => {
                    const isSelected = lastStarId === star.id;
                    const isConnected = connections.some(([a, b]) => a === star.id || b === star.id);

                    return (
                        <motion.button
                            key={star.id}
                            className={cn(
                                "absolute flex items-center justify-center transition-all duration-300 pointer-events-auto rounded-full",
                                isSelected ? "z-30" : "hover:z-30 z-20"
                            )}
                            style={{
                                left: star.x,
                                top: star.y,
                                width: 40,
                                height: 40,
                                transform: 'translate(-50%, -50%)' // Center exactly on coordinates
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStarClick(star.id);
                            }}
                            onMouseEnter={() => setHoveredStar(star.id)}
                            onMouseLeave={() => setHoveredStar(null)}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: Math.random() * 1.5, duration: 1 }}
                            whileHover={{ scale: 1.5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className="relative flex items-center justify-center">
                                {/* The physical star icon */}
                                <Star 
                                    size={16 * star.size} 
                                    className={cn(
                                        "transition-all duration-500",
                                        isSelected ? "text-yellow-100 drop-shadow-[0_0_15px_rgba(253,224,71,1)]" 
                                        : isConnected ? "text-yellow-200 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" 
                                        : "text-white/80 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                                    )}
                                    fill={isSelected || isConnected ? "currentColor" : "none"}
                                />
                                
                                {/* Glow pulse effect around the star */}
                                <motion.div 
                                    className={cn(
                                        "absolute inset-0 rounded-full",
                                        isSelected ? "bg-yellow-200/40" : "bg-white/20"
                                    )}
                                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                                    transition={{ 
                                        duration: 2 + Math.random(), 
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                />
                            </div>
                        </motion.button>
                    );
                })}
            </div>
            
            {/* The Completion Message */}
            <AnimatePresence>
                {(connections.length > 5) && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className={cn(
                            "absolute bottom-32 left-1/2 -translate-x-1/2 z-50 text-center px-8 py-4 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] pointer-events-none backdrop-blur-xl border",
                            theme.isDark ? "bg-[#1c1c1a]/90 text-yellow-100 border-yellow-100/20" : "bg-white/90 text-rose-600 border-rose-200"
                        )}
                    >
                        <p className="serif-display italic tracking-wide text-lg sm:text-2xl flex items-center justify-center gap-3 drop-shadow-sm font-medium">
                            <Sparkles size={20} className={theme.isDark ? "text-yellow-200" : "text-rose-400"} /> 
                            You make my world shine 
                            <Sparkles size={20} className={theme.isDark ? "text-yellow-200" : "text-rose-400"} />
                        </p>
                        <p className={cn("text-xs mt-2 uppercase tracking-widest font-bold opacity-60", theme.isDark ? "text-white" : "text-stone-500")}>
                            Connecting the dots back to you
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
