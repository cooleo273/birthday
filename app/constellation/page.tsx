'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Star, Lock, ChevronLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Point {
    x: number;
    y: number;
    id: number;
    size: number;
}

type NormalizedPoint = Omit<Point, 'x' | 'y'> & { x: number; y: number };

type Edge = [number, number];

type Level = {
    id: string;
    name: string;
    subtitle: string;
    stars: Array<{ x: number; y: number; size: number }>;
    requiredEdges: Edge[];
    completeMessage: {
        title: string;
        body: string;
    };
};

const STORAGE_KEY = 'birthday.constellation.progress.v1';

const LEVELS: Level[] = [
    {
        id: 'spark-1',
        name: 'Level 1',
        subtitle: 'A first spark',
        stars: [
            { x: 0.20, y: 0.30, size: 1.0 },
            { x: 0.35, y: 0.22, size: 1.2 },
            { x: 0.52, y: 0.30, size: 1.1 },
            { x: 0.68, y: 0.22, size: 1.3 },
            { x: 0.80, y: 0.34, size: 1.0 },
            { x: 0.62, y: 0.48, size: 0.95 },
            { x: 0.40, y: 0.50, size: 1.05 },
        ],
        requiredEdges: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [2, 5],
            [2, 6],
        ],
        completeMessage: {
            title: 'You connected the first spark.',
            body: 'That’s how it started… one tiny moment, and suddenly you were my favorite part of the universe.',
        },
    },
    {
        id: 'heart-2',
        name: 'Level 2',
        subtitle: 'A heart in the sky',
        stars: [
            { x: 0.30, y: 0.30, size: 1.2 },
            { x: 0.42, y: 0.22, size: 1.0 },
            { x: 0.56, y: 0.22, size: 1.0 },
            { x: 0.68, y: 0.30, size: 1.2 },
            { x: 0.62, y: 0.44, size: 1.1 },
            { x: 0.50, y: 0.58, size: 1.3 },
            { x: 0.38, y: 0.44, size: 1.1 },
        ],
        requiredEdges: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6],
            [6, 0],
        ],
        completeMessage: {
            title: 'A constellation shaped like us.',
            body: 'Every line you draw is a reminder: my heart keeps finding its way back to you.',
        },
    },
    {
        id: 'infinity-3',
        name: 'Level 3',
        subtitle: 'Always, again',
        stars: [
            { x: 0.30, y: 0.40, size: 1.1 },
            { x: 0.40, y: 0.30, size: 1.0 },
            { x: 0.50, y: 0.40, size: 1.2 },
            { x: 0.40, y: 0.50, size: 1.0 },
            { x: 0.70, y: 0.40, size: 1.1 },
            { x: 0.60, y: 0.30, size: 1.0 },
            { x: 0.60, y: 0.50, size: 1.0 },
        ],
        requiredEdges: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [2, 5],
            [5, 4],
            [4, 6],
            [6, 2],
        ],
        completeMessage: {
            title: 'Infinite, like the way I choose you.',
            body: 'Not once. Not sometimes. Not when it’s easy. Always.',
        },
    },
    {
        id: 'initials-4',
        name: 'Level 4',
        subtitle: 'Your name, written in starlight',
        stars: [
            { x: 0.25, y: 0.28, size: 1.2 },
            { x: 0.25, y: 0.55, size: 1.2 },
            { x: 0.25, y: 0.42, size: 1.0 },
            { x: 0.40, y: 0.28, size: 1.0 },
            { x: 0.40, y: 0.55, size: 1.0 },
            { x: 0.60, y: 0.28, size: 1.0 },
            { x: 0.60, y: 0.55, size: 1.0 },
            { x: 0.75, y: 0.28, size: 1.2 },
            { x: 0.75, y: 0.55, size: 1.2 },
            { x: 0.75, y: 0.42, size: 1.0 },
        ],
        requiredEdges: [
            // H
            [0, 1],
            [0, 3],
            [3, 4],
            [4, 1],
            [2, 3],
            // H (right)
            [7, 8],
            [5, 7],
            [6, 8],
            [9, 5],
        ],
        completeMessage: {
            title: 'H, twice. Because you’re that important.',
            body: 'If love had a signature, mine would look like your name.',
        },
    },
    {
        id: 'final-5',
        name: 'Final Level',
        subtitle: 'A sky full of reasons',
        stars: [
            { x: 0.18, y: 0.30, size: 1.0 },
            { x: 0.32, y: 0.22, size: 1.0 },
            { x: 0.50, y: 0.18, size: 1.1 },
            { x: 0.68, y: 0.22, size: 1.0 },
            { x: 0.82, y: 0.30, size: 1.0 },
            { x: 0.74, y: 0.46, size: 1.1 },
            { x: 0.60, y: 0.56, size: 1.2 },
            { x: 0.40, y: 0.56, size: 1.2 },
            { x: 0.26, y: 0.46, size: 1.1 },
            { x: 0.50, y: 0.34, size: 1.35 },
        ],
        requiredEdges: [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 8],
            [8, 0],
            [9, 2],
            [9, 6],
            [9, 7],
        ],
        completeMessage: {
            title: 'You finished the sky.',
            body: 'Now comes the part I saved for the very end.',
        },
    },
];

function edgeKey(a: number, b: number) {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function clamp01(n: number) {
    return Math.max(0, Math.min(1, n));
}

export default function ConstellationPage() {
    const theme = useTimeTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [stars, setStars] = useState<Point[]>([]);
    const [connections, setConnections] = useState<Edge[]>([]);
    const [lastStarId, setLastStarId] = useState<number | null>(null);
    
    // Add hovering state to show potential connections
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    const [levelIndex, setLevelIndex] = useState(0);
    const [maxUnlocked, setMaxUnlocked] = useState(0);
    const [showComplete, setShowComplete] = useState(false);
    const [showFinal, setShowFinal] = useState(false);
    const [wrongPulse, setWrongPulse] = useState(0);

    const level = LEVELS[levelIndex];

    const requiredSet = useMemo(() => {
        return new Set(level.requiredEdges.map(([a, b]) => edgeKey(a, b)));
    }, [levelIndex]);

    const connectedSet = useMemo(() => {
        return new Set(connections.map(([a, b]) => edgeKey(a, b)));
    }, [connections]);

    const progressPct = level.requiredEdges.length > 0
        ? Math.round((Array.from(connectedSet).filter((k) => requiredSet.has(k)).length / level.requiredEdges.length) * 100)
        : 0;

    const isLevelComplete = level.requiredEdges.every(([a, b]) => connectedSet.has(edgeKey(a, b)));
    const isLastLevel = levelIndex === LEVELS.length - 1;

    useEffect(() => {
        // Load progress
        try {
            const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as { maxUnlocked?: number; lastLevel?: number } | null;
            if (!parsed) return;
            if (typeof parsed.maxUnlocked === 'number') setMaxUnlocked(Math.max(0, Math.min(LEVELS.length - 1, parsed.maxUnlocked)));
            if (typeof parsed.lastLevel === 'number') setLevelIndex(Math.max(0, Math.min(LEVELS.length - 1, parsed.lastLevel)));
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        // Persist progress
        try {
            globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify({ maxUnlocked, lastLevel: levelIndex }));
        } catch {
            // ignore
        }
    }, [maxUnlocked, levelIndex]);

    // Build stars from normalized points + container size (responsive)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const compute = () => {
            const rect = el.getBoundingClientRect();
            const padX = 36;
            const padY = 36;
            const w = Math.max(0, rect.width - padX * 2);
            const h = Math.max(0, rect.height - padY * 2);

            const pts: NormalizedPoint[] = level.stars.map((s, idx) => ({
                id: idx,
                x: clamp01(s.x),
                y: clamp01(s.y),
                size: s.size,
            }));

            const newStars: Point[] = pts.map((p) => ({
                id: p.id,
                x: padX + p.x * w,
                y: padY + p.y * h,
                size: p.size,
            }));

            setStars(newStars);
        };

        compute();
        const ro = new ResizeObserver(() => compute());
        ro.observe(el);
        return () => ro.disconnect();
    }, [levelIndex]);

    useEffect(() => {
        // Reset level state when switching levels
        setConnections([]);
        setLastStarId(null);
        setHoveredStar(null);
        setShowComplete(false);
        setShowFinal(false);
        setLoadingHintTick(0);
    }, [levelIndex]);

    const [loadingHintTick, setLoadingHintTick] = useState(0);

    const triggerWrong = () => {
        setWrongPulse((n) => n + 1);
        setTimeout(() => setWrongPulse((n) => n + 1), 220);
    };

    const handleStarClick = (id: number) => {
        if (showComplete || showFinal) return;
        if (lastStarId === null) {
            setLastStarId(id);
            return;
        }

        if (lastStarId === id) {
            setLastStarId(id);
            return;
        }

        const key = edgeKey(lastStarId, id);
        const already = connectedSet.has(key);
        if (already) {
            setLastStarId(id);
            return;
        }

        // Only allow required edges (levels)
        if (!requiredSet.has(key)) {
            triggerWrong();
            setLastStarId(id);
            return;
        }

        setConnections((prev) => [...prev, [lastStarId, id]]);
        setLastStarId(id);
    };

    const selectedStar = lastStarId;
    const validNextStars = useMemo(() => {
        if (selectedStar === null) return new Set<number>();
        const valid = new Set<number>();
        for (const [a, b] of level.requiredEdges) {
            const k = edgeKey(a, b);
            if (connectedSet.has(k)) continue;
            if (a === selectedStar) valid.add(b);
            if (b === selectedStar) valid.add(a);
        }
        return valid;
    }, [selectedStar, levelIndex, connections]);

    useEffect(() => {
        if (!isLevelComplete) return;

        setShowComplete(true);
        confetti({
            particleCount: isLastLevel ? 220 : 120,
            spread: isLastLevel ? 120 : 80,
            origin: { y: 0.6 },
            colors: ['#fb7185', '#f43f5e', '#ffffff', '#fde68a'],
        });

        const nextUnlocked = Math.max(maxUnlocked, Math.min(LEVELS.length - 1, levelIndex + 1));
        if (nextUnlocked !== maxUnlocked) setMaxUnlocked(nextUnlocked);

        if (isLastLevel) {
            setTimeout(() => setShowFinal(true), 650);
        }
    }, [isLevelComplete]);

    const goPrev = () => {
        setLevelIndex((i) => Math.max(0, i - 1));
    };
    const goNext = () => {
        setLevelIndex((i) => Math.min(maxUnlocked, i + 1));
    };

    const resetLevel = () => {
        setConnections([]);
        setLastStarId(null);
        setHoveredStar(null);
        setLoadingHintTick((n) => n + 1);
    };

    return (
        <main className={cn("min-h-screen relative overflow-hidden bg-gradient-to-br transition-colors duration-1000 pb-48 sm:pb-32", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={14} />

            <div className="absolute top-12 left-0 right-0 z-40 px-6 flex justify-between items-center max-w-7xl mx-auto pointer-events-none">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-60 hover:opacity-100 pointer-events-auto bg-black/10 backdrop-blur-md px-4 py-2 rounded-full", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>
                <div className={cn("text-right opacity-80 bg-black/10 backdrop-blur-md px-4 py-2 rounded-full pointer-events-auto", theme.textColor)}>
                    <div className="flex items-center gap-3 justify-end">
                        <div className="text-right">
                            <h1 className="text-xl serif-display italic font-medium tracking-wide drop-shadow-md">Constellation</h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">
                                {level.name} • {level.subtitle}
                            </p>
                        </div>
                        <div className={cn(
                            "px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.35em] opacity-90",
                            theme.isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                        )}>
                            {progressPct}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Canvas Area */}
            <div 
                ref={containerRef} 
                className="absolute inset-0 z-10 pt-32 pb-44 sm:pb-32"
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
                            const k = edgeKey(lastStarId, hoveredStar);
                            const allowed = requiredSet.has(k) && !connectedSet.has(k);
                            return (
                                <motion.line
                                    x1={starA.x}
                                    y1={starA.y}
                                    x2={starB.x}
                                    y2={starB.y}
                                    stroke={
                                        allowed
                                            ? (theme.isDark ? "rgba(253,224,71,0.55)" : "rgba(244,63,94,0.45)")
                                            : "rgba(255,255,255,0.12)"
                                    }
                                    strokeWidth={allowed ? "2.25" : "1.25"}
                                    strokeDasharray="2 6"
                                />
                            );
                        })()
                    )}
                </svg>

                {stars.map((star) => {
                    const isSelected = lastStarId === star.id;
                    const isConnected = connections.some(([a, b]) => a === star.id || b === star.id);
                    const isNeeded = level.requiredEdges.some(([a, b]) => a === star.id || b === star.id);
                    const isValidNext = selectedStar !== null && validNextStars.has(star.id);

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
                                        theme.isDark
                                            ? (
                                                isSelected
                                                    ? "text-yellow-100 drop-shadow-[0_0_18px_rgba(253,224,71,1)]"
                                                    : isConnected
                                                        ? "text-yellow-200 drop-shadow-[0_0_14px_rgba(253,224,71,0.9)]"
                                                        : isValidNext
                                                            ? "text-rose-200 drop-shadow-[0_0_14px_rgba(251,113,133,0.8)]"
                                                            : isNeeded
                                                                ? "text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                                                                : "text-white/50 drop-shadow-[0_0_5px_rgba(255,255,255,0.45)]"
                                            )
                                            : (
                                                isSelected
                                                    ? "text-rose-500 drop-shadow-[0_0_18px_rgba(244,63,94,0.9)]"
                                                    : isConnected
                                                        ? "text-rose-400 drop-shadow-[0_0_14px_rgba(244,63,94,0.65)]"
                                                        : isValidNext
                                                            ? "text-rose-500 drop-shadow-[0_0_14px_rgba(244,63,94,0.65)]"
                                                            : isNeeded
                                                                ? "text-rose-500/80 drop-shadow-[0_0_10px_rgba(244,63,94,0.45)]"
                                                                : "text-black/25 drop-shadow-[0_0_0px_rgba(0,0,0,0)]"
                                            )
                                    )}
                                    fill={(isSelected || isConnected || isValidNext || (isNeeded && !theme.isDark)) ? "currentColor" : "none"}
                                />
                                
                                {/* Glow pulse effect around the star */}
                                <motion.div 
                                    className={cn(
                                        "absolute inset-0 rounded-full",
                                        theme.isDark
                                            ? (isSelected ? "bg-yellow-200/40" : isValidNext ? "bg-rose-200/25" : "bg-white/20")
                                            : (isSelected ? "bg-rose-400/25" : isValidNext ? "bg-rose-400/20" : "bg-black/5")
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
            
            {/* Bottom Controls */}
            <div
                className="fixed bottom-28 sm:bottom-10 left-0 right-0 z-[200] px-4 sm:px-6"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className={cn(
                        "glass-card px-5 py-3 rounded-3xl border shadow-2xl backdrop-blur-xl",
                        theme.isDark ? "bg-stone-900/40 border-white/10" : "bg-white/40 border-white/30"
                    )}>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={goPrev}
                                disabled={levelIndex === 0}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                    theme.isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10",
                                    (levelIndex === 0) ? "opacity-30 cursor-not-allowed" : "opacity-90"
                                )}
                                title="Previous level"
                            >
                                <ChevronLeft size={18} className={theme.textColor} />
                            </button>

                            <div className="min-w-[190px]">
                                <p className={cn("text-[10px] font-black uppercase tracking-[0.35em] opacity-40", theme.textColor)}>
                                    {level.name}
                                </p>
                                <p className={cn("text-[14px] font-semibold serif-display italic", theme.textColor)}>
                                    {level.subtitle}
                                </p>
                            </div>

                            <button
                                onClick={goNext}
                                disabled={levelIndex >= maxUnlocked}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                    theme.isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10",
                                    (levelIndex >= maxUnlocked) ? "opacity-30 cursor-not-allowed" : "opacity-90"
                                )}
                                title="Next level"
                            >
                                <ChevronRight size={18} className={theme.textColor} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            onClick={resetLevel}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "glass-card px-5 py-3 rounded-3xl border shadow-2xl backdrop-blur-xl inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em]",
                                theme.isDark ? "bg-stone-900/40 border-white/10 text-white/70" : "bg-white/40 border-white/30 text-black/60"
                            )}
                            title="Reset level"
                        >
                            <RotateCcw size={14} className={theme.isDark ? "text-white/60" : "text-black/50"} />
                            Reset
                        </motion.button>

                        <div
                            key={wrongPulse}
                            className={cn(
                                "glass-card px-6 py-3 rounded-3xl border shadow-2xl backdrop-blur-xl text-center",
                                theme.isDark ? "bg-stone-900/40 border-white/10" : "bg-white/40 border-white/30"
                            )}
                        >
                            <p className={cn("text-[10px] font-black uppercase tracking-[0.35em] opacity-40", theme.textColor)}>
                                Connect
                            </p>
                            <p className={cn(
                                "text-[13px] font-semibold",
                                theme.textColor
                            )}>
                                {Array.from(connectedSet).filter((k) => requiredSet.has(k)).length} / {level.requiredEdges.length}
                            </p>
                        </div>

                        <div className={cn(
                            "glass-card px-5 py-3 rounded-3xl border shadow-2xl backdrop-blur-xl inline-flex items-center gap-2",
                            theme.isDark ? "bg-stone-900/40 border-white/10" : "bg-white/40 border-white/30"
                        )}>
                            {levelIndex > maxUnlocked ? (
                                <>
                                    <Lock size={14} className={theme.isDark ? "text-white/40" : "text-black/30"} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-[0.35em] opacity-50", theme.textColor)}>
                                        Locked
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={14} className={theme.isDark ? "text-yellow-200/70" : "text-rose-400"} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-[0.35em] opacity-60", theme.textColor)}>
                                        Only connect glowing paths
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Level Complete Modal */}
            <AnimatePresence>
                {showComplete && !showFinal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/25"
                        onClick={() => setShowComplete(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "glass-card p-9 sm:p-12 rounded-[3.5rem] text-center max-w-lg shadow-2xl relative overflow-hidden border",
                                theme.isDark ? "bg-stone-900/92 border-white/10" : "bg-white/92 border-black/5"
                            )}
                        >
                            <div className={cn("w-16 h-16 rounded-full mx-auto mb-7 flex items-center justify-center bg-rose-500/10 text-rose-500")}>
                                <Sparkles size={28} />
                            </div>
                            <p className={cn("text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3", theme.textColor)}>
                                Completed
                            </p>
                            <h2 className={cn("text-3xl sm:text-4xl font-serif italic mb-5", theme.textColor)}>
                                {level.completeMessage.title}
                            </h2>
                            <p className={cn("text-[15px] sm:text-lg leading-relaxed italic serif-display opacity-70 mb-8", theme.textColor)}>
                                {level.completeMessage.body}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                {!isLastLevel && (
                                    <button
                                        onClick={() => {
                                            setShowComplete(false);
                                            setLevelIndex((i) => Math.min(maxUnlocked, i + 1));
                                        }}
                                        className={cn("btn-apple text-[10px] px-7 py-3", theme.buttonClass)}
                                    >
                                        Next level
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowComplete(false)}
                                    className={cn(
                                        "px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.35em] border transition-colors",
                                        theme.isDark ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10" : "bg-black/5 border-black/10 text-black/60 hover:bg-black/10"
                                    )}
                                >
                                    Keep stargazing
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Final Message Reveal */}
            <AnimatePresence>
                {showFinal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-black/35"
                        onClick={() => setShowFinal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 26 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 26 }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "glass-card w-full max-w-2xl rounded-[3.75rem] shadow-2xl border overflow-hidden",
                                theme.isDark ? "bg-stone-900/92 border-white/10" : "bg-white/92 border-black/5"
                            )}
                        >
                            <div className="relative p-10 sm:p-14">
                                <div className={cn(
                                    "absolute inset-0 opacity-80",
                                    theme.isDark
                                        ? "bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(253,224,71,0.18),transparent_60%)]"
                                        : "bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(253,224,71,0.14),transparent_60%)]"
                                )} />

                                <div className="relative">
                                    <div className="flex items-center justify-center gap-3 mb-7">
                                        <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", theme.isDark ? "bg-white/5" : "bg-black/5")}>
                                            <Trophy className={cn("w-7 h-7", theme.isDark ? "text-yellow-200/80" : "text-rose-500")} />
                                        </div>
                                    </div>

                                    <p className={cn("text-[10px] font-black uppercase tracking-[0.45em] opacity-40 text-center", theme.textColor)}>
                                        Final message
                                    </p>
                                    <h2 className={cn("mt-3 text-center text-4xl sm:text-6xl serif-display italic leading-[1.05]", theme.textColor)}>
                                        You are my <span className="text-romantic-rose">favorite</span> constellation.
                                    </h2>
                                    <p className={cn("mt-6 text-center text-[15px] sm:text-lg leading-relaxed opacity-70 font-medium", theme.textColor)}>
                                        Not because you’re perfect… but because you make everything feel like it has meaning.
                                        You turn ordinary days into memories I want to keep forever.
                                    </p>

                                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { t: 'Soft', b: 'You calm the storm in me.' },
                                            { t: 'Bright', b: 'You make my world glow.' },
                                            { t: 'Home', b: 'You feel like arriving.' },
                                        ].map((m) => (
                                            <div
                                                key={m.t}
                                                className={cn(
                                                    "rounded-[2.25rem] p-6 border backdrop-blur-xl",
                                                    theme.isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-black/5"
                                                )}
                                            >
                                                <p className={cn("text-[10px] font-black uppercase tracking-[0.35em] opacity-40 mb-2", theme.textColor)}>
                                                    {m.t}
                                                </p>
                                                <p className={cn("serif-display italic text-[15px] leading-relaxed opacity-80", theme.textColor)}>
                                                    {m.b}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                                        <button
                                            onClick={() => {
                                                confetti({ particleCount: 220, spread: 140, origin: { y: 0.55 }, colors: ['#fb7185', '#f43f5e', '#ffffff', '#fde68a'] });
                                            }}
                                            className={cn("btn-apple text-[10px] px-8 py-3", theme.buttonClass)}
                                        >
                                            One more sparkle
                                        </button>
                                        <button
                                            onClick={() => setShowFinal(false)}
                                            className={cn(
                                                "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.35em] border transition-colors",
                                                theme.isDark ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10" : "bg-black/5 border-black/10 text-black/60 hover:bg-black/10"
                                            )}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
