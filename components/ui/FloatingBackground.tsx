'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FloatingBackground({ isDark, count = 15 }: { isDark: boolean; count?: number }) {
    const [elements, setElements] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        const items = Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 40 + 20,
            duration: Math.random() * 20 + 20,
            delay: Math.random() * -20,
        }));
        setElements(items);
    }, [count]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className="absolute rounded-full blur-[60px]"
                    style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: el.size * 5,
                        height: el.size * 5,
                        backgroundColor: isDark
                            ? 'rgba(255, 77, 109, 0.05)'
                            : 'rgba(255, 133, 162, 0.08)',
                    }}
                    animate={{
                        x: [0, 40, -40, 0],
                        y: [0, -40, 40, 0],
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        delay: el.delay,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Drifting particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={`p-${i}`}
                    className={`absolute rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 3 + 1,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * -10,
                    }}
                />
            ))}
        </div>
    );
}
