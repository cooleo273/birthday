'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import ConfettiEffect from '@/components/ui/ConfettiEffect';

const WORDS = ['HANA', 'HANI', 'FOREVER', 'SMILE', 'BEAUTIFUL'];
const GRID_SIZE = 10;

// Helper to check if a word fits and place it
function generateGrid() {
    const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Place words loosely
    const directions = [
        [0, 1], // horizontal
        [1, 0], // vertical
        [1, 1], // diagonal down
    ];

    WORDS.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            attempts++;
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const r = Math.floor(Math.random() * GRID_SIZE);
            const c = Math.floor(Math.random() * GRID_SIZE);

            if (r + dir[0] * word.length <= GRID_SIZE && c + dir[1] * word.length <= GRID_SIZE) {
                // Check if space is valid (empty or matching letter)
                let valid = true;
                for (let i = 0; i < word.length; i++) {
                    const char = grid[r + dir[0] * i][c + dir[1] * i];
                    if (char !== '' && char !== word[i]) {
                        valid = false;
                        break;
                    }
                }
                
                if (valid) {
                    for (let i = 0; i < word.length; i++) {
                        grid[r + dir[0] * i][c + dir[1] * i] = word[i];
                    }
                    placed = true;
                }
            }
        }
    });

    // Fill the rest with random letters
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
            }
        }
    }

    return grid;
}

export default function WordSearchPage() {
    const theme = useTimeTheme();
    const [grid, setGrid] = useState<string[][]>([]);
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState<{r: number, c: number} | null>(null);
    const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set());
    const [won, setWon] = useState(false);

    useEffect(() => {
        setGrid(generateGrid());
    }, []);

    // Simple line drawing selection mechanism for touch/mouse
    const handleCellDown = (r: number, c: number) => {
        setIsSelecting(true);
        setSelectionStart({r, c});
        setCurrentSelection(new Set([`${r},${c}`]));
    };

    const handleCellEnter = (r: number, c: number) => {
        if (!isSelecting || !selectionStart) return;

        // Calculate line (horizontal, vertical, or diagonal)
        const dr = r - selectionStart.r;
        const dc = c - selectionStart.c;
        
        // Ensure it's a straight line
        if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return;

        const newSelection = new Set<string>();
        const steps = Math.max(Math.abs(dr), Math.abs(dc));
        
        const rStep = dr === 0 ? 0 : dr / Math.abs(dr);
        const cStep = dc === 0 ? 0 : dc / Math.abs(dc);

        for (let i = 0; i <= steps; i++) {
            newSelection.add(`${selectionStart.r + i * rStep},${selectionStart.c + i * cStep}`);
        }
        setCurrentSelection(newSelection);
    };

    const handleUp = () => {
        if (!isSelecting) return;
        setIsSelecting(false);

        // Check if current selection forms a valid word forward or backward
        let wordStr = '';
        const cellsArray = Array.from(currentSelection);
        
        // Because sets don't guarantee order exactly as we drew them, we reconstruct the string based on coordinates.
        if (selectionStart && cellsArray.length > 0) {
            // Find end point
            const lastCellStr = cellsArray[cellsArray.length - 1]; // mostly accurate for our usage
            const [endR, endC] = lastCellStr.split(',').map(Number);
            
            const dr = endR - selectionStart.r;
            const dc = endC - selectionStart.c;
            const steps = Math.max(Math.abs(dr), Math.abs(dc));
            const rStep = dr === 0 ? 0 : dr / Math.abs(dr);
            const cStep = dc === 0 ? 0 : dc / Math.abs(dc);

            for (let i = 0; i <= steps; i++) {
                wordStr += grid[selectionStart.r + i * rStep][selectionStart.c + i * cStep];
            }
            
            const reversedStr = wordStr.split('').reverse().join('');

            const foundWord = WORDS.find(w => w === wordStr || w === reversedStr);

            if (foundWord && !foundWords.has(foundWord)) {
                // Add to found words
                const newFound = new Set(foundWords);
                newFound.add(foundWord);
                setFoundWords(newFound);

                // Add to permanently selected cells
                const newSelectedCells = new Set(selectedCells);
                currentSelection.forEach(c => newSelectedCells.add(c));
                setSelectedCells(newSelectedCells);

                if (newFound.size === WORDS.length) {
                    setWon(true);
                }
            }
        }
        
        setCurrentSelection(new Set());
        setSelectionStart(null);
    };

    return (
        <main 
            className={cn("min-h-screen pt-24 pb-48 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}
            onMouseUp={handleUp}
            onTouchEnd={handleUp}
            onMouseLeave={handleUp}
        >
            <ConfettiEffect active={won} />
            <FloatingBackground isDark={theme.isDark} count={6} />

            <div className="absolute top-12 left-0 right-0 z-20 px-6 max-w-4xl mx-auto flex justify-between items-center">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest", theme.textColor)}>
                    Words: {foundWords.size} / {WORDS.length}
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center mt-8">
                <div className="text-center mb-10">
                    <h1 className={cn("mb-2 text-4xl serif-display italic", theme.textColor)}>Find Us</h1>
                    <p className={cn("text-xs opacity-60 font-medium tracking-wide", theme.textColor)}>
                        Swipe or drag to select words
                    </p>
                </div>

                <div className={cn("p-4 sm:p-6 rounded-[2rem] shadow-2xl border backdrop-blur-xl touch-none select-none",
                    theme.isDark ? "bg-stone-900/40 border-white/5" : "bg-white/40 border-white/20"
                )}>
                    <div 
                        className="grid gap-1 sm:gap-2"
                        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                    >
                        {grid.map((row, r) => (
                            row.map((letter, c) => {
                                const cellKey = `${r},${c}`;
                                const isFound = selectedCells.has(cellKey);
                                const isCurrent = currentSelection.has(cellKey);
                                
                                return (
                                    <motion.div
                                        key={cellKey}
                                        onMouseDown={() => handleCellDown(r, c)}
                                        onMouseEnter={() => handleCellEnter(r, c)}
                                        onTouchStart={(e) => {
                                            // Handle touch
                                            handleCellDown(r, c);
                                        }}
                                        onTouchMove={(e) => {
                                            const touch = e.touches[0];
                                            const el = document.elementFromPoint(touch.clientX, touch.clientY);
                                            const rAttr = el?.getAttribute('data-r');
                                            const cAttr = el?.getAttribute('data-c');
                                            if (rAttr && cAttr) {
                                                handleCellEnter(parseInt(rAttr), parseInt(cAttr));
                                            }
                                        }}
                                        data-r={r}
                                        data-c={c}
                                        className={cn(
                                            "w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl font-bold text-sm sm:text-base cursor-pointer transition-colors duration-200",
                                            isFound 
                                                ? (theme.isDark ? "bg-rose-500/80 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "bg-rose-400 text-white shadow-md") 
                                                : isCurrent 
                                                    ? (theme.isDark ? "bg-white/20 text-white" : "bg-rose-200 text-rose-900")
                                                    : (theme.isDark ? "bg-stone-800/50 text-stone-300 hover:bg-stone-700/50" : "bg-white/50 text-stone-600 hover:bg-white/80")
                                        )}
                                        animate={{
                                            scale: isCurrent || isFound ? 1.1 : 1,
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        {letter}
                                    </motion.div>
                                );
                            })
                        ))}
                    </div>
                </div>

                <div className="mt-12 w-full max-w-sm flex flex-wrap justify-center gap-3">
                    {WORDS.map(word => {
                        const found = foundWords.has(word);
                        return (
                            <div 
                                key={word}
                                className={cn(
                                    "px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all duration-500",
                                    found 
                                        ? (theme.isDark ? "bg-rose-900/50 text-rose-200 shadow-[0_0_10px_rgba(225,29,72,0.2)]" : "bg-rose-100 text-rose-600") 
                                        : (theme.isDark ? "bg-stone-800/50 text-stone-500" : "bg-white/50 text-stone-400 opacity-60")
                                )}
                            >
                                {found && <CheckCircle2 size={14} />}
                                {word}
                            </div>
                        )
                    })}
                </div>

                <AnimatePresence>
                    {won && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 text-center"
                        >
                            <p className={cn("text-xl serif-display italic mb-4", theme.textColor)}>
                                You found everything! Just like I found you.
                            </p>
                            <Link href="/">
                                <button className={cn("btn-apple mx-auto flex items-center gap-2", theme.buttonClass)}>
                                    <Sparkles size={16} /> Heart is Full
                                </button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
