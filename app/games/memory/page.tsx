'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, CheckCircle, ArrowLeft, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// 8 pairs of romantic emojis = 16 cards
const EMOJIS = ['🌸', '💖', '✨', '🌹', '🦋', '🍬', '🎀', '🌈'];
const CARDS = [...EMOJIS, ...EMOJIS];

function shuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

interface CardState {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function MemoryGamePage() {
    const [cards, setCards] = useState<CardState[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [solved, setSolved] = useState(false);
    const theme = useTimeTheme();

    const initializeGame = useCallback(() => {
        const shuffledEmojis = shuffle(CARDS);
        const initialCards = shuffledEmojis.map((emoji, index) => ({
            id: index,
            emoji: emoji,
            isFlipped: false,
            isMatched: false,
        }));
        setCards(initialCards);
        setFlippedCards([]);
        setMoves(0);
        setSolved(false);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const handleCardClick = (id: number) => {
        if (solved || flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

        setFlippedCards(prev => [...prev, id]);
        setCards(prev => prev.map(card => 
            card.id === id ? { ...card, isFlipped: true } : card
        ));
    };

    useEffect(() => {
        if (flippedCards.length !== 2) return;

        setMoves(m => m + 1);
        const [id1, id2] = flippedCards;

        const updateCards = (idA: number, idB: number, matched: boolean) => {
            setCards(prev => prev.map(card => 
                (card.id === idA || card.id === idB) 
                    ? { ...card, isMatched: matched, isFlipped: matched ? card.isFlipped : false } 
                    : card
            ));
            setFlippedCards([]);
        };

        if (cards[id1].emoji === cards[id2].emoji) {
            updateCards(id1, id2, true);
        } else {
            const timer = setTimeout(() => updateCards(id1, id2, false), 1000);
            return () => clearTimeout(timer);
        }
    }, [flippedCards, cards]);

    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched)) {
            setSolved(true);
            setTimeout(() => {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#fb7185', '#f43f5e', '#ffffff']
                });
            }, 500);
        }
    }, [cards]);

    return (
        <main className={cn("min-h-screen pt-24 pb-48 px-6 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={6} />

            <div className="max-w-4xl mx-auto px-6 mb-12 text-center relative z-10">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors mb-12 group opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>

                <h1 className={cn("mb-4 serif-display italic", theme.textColor)}>
                    Romantic <span className="text-rose-500">Memory.</span>
                </h1>
                <p className={cn("opacity-40 max-w-sm mx-auto font-medium", theme.textColor)}>
                    Match the pairs to reveal a secret birthday message.
                </p>

                <div className={cn("mt-8 inline-flex items-center gap-3 px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all", 
                    theme.isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5",
                    theme.textColor
                )}>
                    <span className="opacity-40">Moves</span>
                    <span className={theme.accentColor}>{moves}</span>
                </div>
            </div>

            <div className="flex flex-col items-center relative z-10">
                <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-12 max-w-[400px] w-full px-4">
                    {cards.map((card) => {
                        const cardBg = card.isMatched 
                            ? "bg-rose-500/20 border-rose-500/40" 
                            : theme.isDark 
                                ? "bg-white/20 border-white/20" 
                                : "bg-white border-white/80";

                        return (
                            <div key={card.id} className="aspect-square perspective-1000">
                                <motion.div
                                    onClick={() => handleCardClick(card.id)}
                                    initial={false}
                                    animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                                    className="w-full h-full relative preserve-3d cursor-pointer"
                                >
                                    {/* Card Front (Face down) */}
                                    <div className={cn(
                                        "absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl border flex items-center justify-center shadow-lg transition-colors overflow-hidden",
                                        theme.isDark ? "bg-white/10 border-white/10" : "bg-white/80 border-white/40"
                                    )}>
                                        <div className="absolute inset-0 bg-neutral-500/5 backdrop-blur-sm" />
                                        <Heart size={20} className="text-rose-400 opacity-20" />
                                    </div>

                                    {/* Card Back (Face up) */}
                                    <div className={cn(
                                        "absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl border flex items-center justify-center shadow-xl rotate-y-180 transition-colors",
                                        cardBg
                                    )}>
                                        <span className="text-2xl sm:text-3xl filter drop-shadow-sm">{card.emoji}</span>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                <button 
                    onClick={initializeGame} 
                    className={cn("flex items-center gap-2 transition-opacity opacity-40 hover:opacity-100 uppercase tracking-[0.3em] text-[10px] font-bold mb-12", theme.textColor)}
                >
                    <RefreshCcw size={12} /> Reset Game
                </button>

                {/* Celebration Modal */}
                <AnimatePresence>
                    {solved && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/20"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={cn(
                                    "glass-card p-10 sm:p-14 rounded-[3.5rem] text-center max-w-md shadow-2xl relative overflow-hidden",
                                    theme.isDark ? "bg-stone-900/95 border-white/10" : "bg-white/95 border-black/5"
                                )}
                            >
                                <div className={cn("w-16 h-16 rounded-full mx-auto mb-8 flex items-center justify-center bg-rose-500/10 text-rose-500")}>
                                    <CheckCircle size={32} />
                                </div>
                                <h2 className={cn("text-3xl font-serif italic mb-6", theme.textColor)}>Matched! 💖</h2>
                                <p className={cn("text-xl leading-relaxed italic serif-display opacity-80 mb-8", theme.textColor)}>
                                    "Like these pairs, we're better together. You matched my heart from the start."
                                </p>
                                <p className={cn("text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-10", theme.textColor)}>Completed in {moves} moves ✨</p>
                                
                                <button 
                                    onClick={initializeGame}
                                    className={cn("btn-apple w-full text-xs py-4", theme.buttonClass)}
                                >
                                    Play Again
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </main>
    );
}
