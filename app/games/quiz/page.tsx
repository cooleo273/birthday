'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCcw, CheckCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const QUESTIONS = [
    {
        q: "What color does Hana's eyes remind you of?",
        options: ['Ocean blue', 'Warm honey', 'Deep hazel', 'Starlit brown'],
        answer: 3,
        fun: 'Like stars you can get lost in! 🌟',
    },
    {
        q: "Hana's superpower?",
        options: ['Making everyone smile', 'Reading minds', 'Flying', 'Time travel'],
        answer: 0,
        fun: 'That smile literally brightens rooms! ☀️',
    },
    {
        q: 'If Hana were a season, she would be:',
        options: ['Winter frost', 'Summer sunshine', 'Spring blossom', 'Autumn warmth'],
        answer: 2,
        fun: 'Fresh, blooming, and bringing life to everything! 🌸',
    },
    {
        q: "Hana's laugh sounds like:",
        options: ['Soft rain', 'Wind chimes', 'Pure magic', 'Gentle bells'],
        answer: 2,
        fun: 'Yes. Pure, undeniable magic! ✨',
    },
    {
        q: 'What does Hana deserve most?',
        options: ['Adventure', 'All the love in the world', 'Success', 'Peace'],
        answer: 1,
        fun: 'Every last bit of love this universe has! 💕',
    },
];

interface QuestionCardProps {
    question: typeof QUESTIONS[0];
    current: number;
    total: number;
    selected: number | null;
    showFun: boolean;
    theme: any;
    onAnswer: (idx: number) => void;
    onNext: () => void;
}

function QuestionCard({ question, current, total, selected, showFun, theme, onAnswer, onNext }: QuestionCardProps) {
    return (
        <motion.div
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-2xl px-1 sm:px-6"
        >
            <div className={cn(
                "glass-card p-4 sm:p-10 md:p-12 rounded-3xl sm:rounded-[3.5rem] mb-4 sm:mb-10 shadow-2xl relative overflow-hidden",
                theme.isDark ? "bg-white/5 border-white/10" : "bg-white/20 border-white/60"
            )}>
                <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-20", theme.isDark ? "via-rose-300" : "via-rose-400")} />
                <p className={cn("text-lg sm:text-2xl md:text-3xl font-serif italic text-center mb-4 sm:mb-10 leading-relaxed opacity-90", theme.textColor)}>{question.q}</p>

                <div className="grid grid-cols-1 gap-2 sm:gap-4">
                    {question.options.map((opt, i) => {
                        const isSelected = selected === i;
                        const isCorrect = i === question.answer;
                        const showResult = selected !== null;
                        
                        let btnStyle = "";
                        if (showResult) {
                            if (isCorrect) {
                                btnStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-500";
                            } else if (isSelected) {
                                btnStyle = "bg-rose-500/10 border-rose-500/30 text-rose-500 opacity-70";
                            } else {
                                btnStyle = cn("border-transparent opacity-20", theme.textColor);
                            }
                        } else {
                            btnStyle = theme.isDark 
                                ? "bg-white/5 border-white/5 hover:bg-white/10" 
                                : "bg-white/60 border-black/5 hover:bg-white/80";
                        }

                        return (
                            <motion.button
                                key={`opt-${i}`}
                                whileHover={selected === null ? { scale: 1.01 } : {}}
                                whileTap={selected === null ? { scale: 0.99 } : {}}
                                onClick={() => onAnswer(i)}
                                className={cn(
                                    "w-full px-5 sm:px-8 py-2.5 sm:py-5 rounded-xl sm:rounded-2xl text-left font-serif italic text-sm sm:text-base md:text-xl transition-all border",
                                    btnStyle
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={selected === null ? theme.textColor : ""}>{opt}</span>
                                    {showResult && isCorrect && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-6">
                <AnimatePresence>
                    {showFun && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "px-6 py-1 rounded-2xl text-center font-medium italic serif-display text-sm sm:text-lg opacity-60",
                                theme.textColor
                            )}
                        >
                            {question.fun}
                        </motion.div>
                    )}
                </AnimatePresence>

                {selected !== null && (
                    <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={onNext} 
                        className={cn("btn-apple text-[9px] sm:text-xs flex items-center gap-2 sm:gap-3", theme.buttonClass)}
                    >
                        <span>{current < total - 1 ? 'Next Question' : 'See Results'}</span>
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

interface ResultCardProps {
    score: number;
    total: number;
    theme: any;
    onReset: () => void;
}

function ResultCard({ score, total, theme, onReset }: ResultCardProps) {
    let feedback = 'Every wrong answer is just another reason to learn more about her! 💕';
    if (score === total) {
        feedback = 'Perfect! You know Hana is extraordinary! 💖';
    } else if (score >= 3) {
        feedback = 'You know Hana is amazing! Keep loving her! 🌸';
    }

    const cardStyle = theme.isDark ? "bg-white/5 border-white/5" : "bg-white/40 border-black/5";

    return (
        <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-xl w-full relative z-10 font-serif italic"
        >
            <div className={cn("w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-6 sm:mb-10 flex items-center justify-center bg-yellow-500/10 text-yellow-500")}>
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            
            <h2 className={cn("text-5xl sm:text-8xl mb-4 sm:mb-6", theme.textColor)}>
                {score}<span className="text-2xl sm:text-3xl opacity-40">/{total}</span>
            </h2>
            
            <p className={cn("text-lg sm:text-2xl mb-6 sm:mb-10 opacity-60 px-6", theme.textColor)}>
                {feedback}
            </p>
            
            <div className={cn(
                "glass-card p-6 sm:p-10 rounded-3xl sm:rounded-[3rem] mb-8 sm:mb-12 text-base sm:text-xl opacity-80 serif-display",
                cardStyle,
                theme.textColor
            )}>
                "Hana is the kind of person who makes the world better just by existing."
            </div>
            
            <button onClick={onReset} className={cn("btn-apple text-xs flex items-center gap-3 mx-auto", theme.buttonClass)}>
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
            </button>
        </motion.div>
    );
}

export default function QuizPage() {
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [done, setDone] = useState(false);
    const [showFun, setShowFun] = useState(false);
    const theme = useTimeTheme();

    function handleAnswer(idx: number) {
        if (selected !== null) return;
        setSelected(idx);
        const correct = idx === QUESTIONS[current].answer;
        if (correct) {
            setScore((s) => s + 1);
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        }
        setShowFun(true);
    }

    function next() {
        if (current < QUESTIONS.length - 1) {
            setCurrent((c) => c + 1);
            setSelected(null);
            setShowFun(false);
        } else {
            setDone(true);
            confetti({ particleCount: 150, spread: 120, origin: { y: 0.5 } });
        }
    }

    function reset() {
        setCurrent(0);
        setScore(0);
        setSelected(null);
        setDone(false);
        setShowFun(false);
    }

    const progress = (current / QUESTIONS.length) * 100;

    return (
        <main className={cn("min-h-screen pt-4 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={6} />

            <div className="max-w-4xl mx-auto px-4 mb-4 sm:mb-12 text-center relative z-10">
                <div className="flex justify-center mb-4 sm:mb-6">
                    <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-40 hover:opacity-100", theme.textColor)}>
                        <ArrowLeft size={16} />
                        <span className="label-ui text-[10px]">Home</span>
                    </Link>
                </div>

                <div className="hidden sm:block">
                    <h1 className={cn("mb-2 sm:mb-4 serif-display italic text-3xl sm:text-5xl", theme.textColor)}>
                        Hana Quiz.
                    </h1>
                    <p className={cn("opacity-40 max-w-sm mx-auto font-medium text-[12px] sm:text-sm", theme.textColor)}>
                        How well do you know the girl who changed everything?
                    </p>
                </div>

                <div className="mt-4 sm:mt-10 flex flex-col items-center gap-2 sm:gap-4">
                    <div className={cn("label-ui text-[9px] sm:text-[10px] font-black tracking-[0.4em] opacity-30", theme.textColor)}>
                        Question {current + 1} of {QUESTIONS.length}
                    </div>
                    <div className={cn("w-32 sm:w-48 h-1 rounded-full overflow-hidden", theme.isDark ? "bg-white/5" : "bg-black/5")}>
                        <motion.div
                            className={cn("h-full", theme.isDark ? "bg-rose-400" : "bg-rose-500")}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center relative z-10">
                <AnimatePresence mode="wait">
                    {done ? (
                        <ResultCard score={score} total={QUESTIONS.length} theme={theme} onReset={reset} />
                    ) : (
                        <QuestionCard 
                            question={QUESTIONS[current]} 
                            current={current} 
                            total={QUESTIONS.length} 
                            selected={selected} 
                            showFun={showFun} 
                            theme={theme} 
                            onAnswer={handleAnswer} 
                            onNext={next} 
                        />
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
