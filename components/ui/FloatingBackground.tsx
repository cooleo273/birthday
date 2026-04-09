'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useViewportMotion } from '@/hooks/useViewportMotion';

type BlobEl = { id: number; x: number; y: number; size: number; duration: number; delay: number };
type ParticleEl = { id: string; left: number; top: number; w: number; duration: number; delay: number };

export default function FloatingBackground({ isDark, count = 15 }: { isDark: boolean; count?: number }) {
    const { isMobileViewport, prefersReducedMotion } = useViewportMotion();
    const [blobs, setBlobs] = useState<BlobEl[]>([]);
    const [particles, setParticles] = useState<ParticleEl[]>([]);

    const blobCount = isMobileViewport ? Math.min(count, 5) : count;
    const particleCount = isMobileViewport ? 8 : 20;
    const blurClass = isMobileViewport ? 'blur-3xl' : 'blur-[60px]';
    const staticLayout = prefersReducedMotion;

    useEffect(() => {
        queueMicrotask(() => {
            setBlobs(
                Array.from({ length: blobCount }).map((_, i) => ({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 40 + 20,
                    duration: Math.random() * 20 + 20,
                    delay: Math.random() * -20,
                }))
            );
            setParticles(
                Array.from({ length: particleCount }).map((_, i) => ({
                    id: `p-${i}`,
                    left: Math.random() * 100,
                    top: Math.random() * 100,
                    w: Math.random() * 3 + 1,
                    duration: Math.random() * 10 + 10,
                    delay: Math.random() * -10,
                }))
            );
        });
    }, [blobCount, particleCount, isDark]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {blobs.map((el) => (
                <motion.div
                    key={el.id}
                    className={`absolute rounded-full ${blurClass}`}
                    style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: el.size * 5,
                        height: el.size * 5,
                        backgroundColor: isDark ? 'rgba(255, 77, 109, 0.05)' : 'rgba(255, 133, 162, 0.08)',
                    }}
                    animate={
                        staticLayout
                            ? { x: 0, y: 0, scale: 1 }
                            : {
                                  x: [0, 40, -40, 0],
                                  y: [0, -40, 40, 0],
                                  scale: [1, 1.2, 0.8, 1],
                              }
                    }
                    transition={
                        staticLayout
                            ? { duration: 0 }
                            : {
                                  duration: el.duration,
                                  repeat: Infinity,
                                  delay: el.delay,
                                  ease: 'linear',
                              }
                    }
                />
            ))}

            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={`absolute rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`}
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: p.w,
                        height: p.w,
                    }}
                    animate={
                        staticLayout
                            ? { y: 0, opacity: 0.2 }
                            : {
                                  y: [-20, 20, -20],
                                  opacity: [0.1, 0.4, 0.1],
                              }
                    }
                    transition={
                        staticLayout
                            ? { duration: 0 }
                            : {
                                  duration: p.duration,
                                  repeat: Infinity,
                                  delay: p.delay,
                              }
                    }
                />
            ))}
        </div>
    );
}
