'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Html, OrbitControls, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Memory {
    id: number;
    position: [number, number, number];
    imageUrl: string;
    label: string;
}

const MEMORY_LABELS = [
    'Our first hello',
    'Late night talks',
    'Your smile',
    'That one day',
    'Always you',
    'Our little world',
    'Starlit moments',
    'Just us two',
    'Warm hugs',
    'Stolen glances',
    'Quiet mornings',
    'Dancing hearts',
    'Sweet nothings',
    'Forever us',
    'Magic moments',
    'You & me',
];

const createGalaxyMemories = (count: number): Memory[] => {
    const memories: Memory[] = [];

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 5 + (i % 3);
        const y = (i % 7) - 3;

        memories.push({
            id: i + 1,
            position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
            imageUrl: `/universe/${i + 1}.jpg`,
            label: MEMORY_LABELS[i % MEMORY_LABELS.length],
        });
    }

    return memories;
};

const GALAXY_MEMORIES: Memory[] = createGalaxyMemories(16);

function MemoryCard({ memory, onClick, theme }: { memory: Memory; onClick: (m: Memory) => void; theme: any }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1}>
            <Html
                position={memory.position}
                center
                distanceFactor={10}
                occlude="blending"
            >
                <motion.div
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    onClick={() => onClick(memory)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: hovered ? 1.05 : 1 }}
                    className="cursor-pointer group relative"
                >
                    <div
                        className={cn(
                            "absolute inset-0 blur-2xl rounded-2xl opacity-50 transition-all duration-700",
                            theme.isDark
                                ? "bg-[radial-gradient(circle_at_top,_#f97373_0,_transparent_55%)] group-hover:opacity-80"
                                : "bg-[radial-gradient(circle_at_top,_#fb7185_0,_transparent_55%)] group-hover:opacity-80"
                        )}
                    />

                    <div
                        className={cn(
                            "relative w-24 h-36 backdrop-blur-xl border border-white/20 p-1.5 rounded-xl shadow-[0_12px_30px_rgba(15,23,42,0.4)] flex flex-col items-center overflow-hidden",
                            theme.isDark ? "bg-white/5" : "bg-white/70"
                        )}
                    >
                        <div className="w-full h-24 overflow-hidden rounded-lg bg-neutral-200">
                            <img
                                src={memory.imageUrl}
                                alt={memory.label}
                                className="w-full h-full object-cover scale-105 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0 transition-all duration-[1400ms]"
                            />
                        </div>
                        <div className="flex-1 flex items-center justify-center px-1 pt-1">
                            <p
                                className={cn(
                                    "text-center leading-tight font-medium text-[7px] uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2",
                                    theme.isDark ? "text-white" : "text-[#1d1d1f]"
                                )}
                            >
                                {memory.label}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </Html>
        </Float>
    );
}

export default function UniversePage() {
    const [selected, setSelected] = useState<Memory | null>(null);
    const theme = useTimeTheme();

    return (
        <div className={cn("relative w-full h-screen overflow-hidden transition-colors duration-1000 bg-gradient-to-br", theme.gradient)}>
            {/* Soft Ambient Overlay for depth */}
            {!selected && (
                <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.35),_transparent_60%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(24,24,27,0.9),_transparent_55%)] mix-blend-soft-light pointer-events-none" />
                </>
            )}
            
            {!selected && (
                <>
                    <div className="absolute top-12 left-0 right-0 text-center z-10 pointer-events-none px-6">
                        <div className="flex justify-center mb-8 pointer-events-auto">
                            <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-40 hover:opacity-100", theme.textColor)}>
                                <ArrowLeft size={16} />
                                <span className="label-ui text-[10px]">Home</span>
                            </Link>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 0.9, y: 0 }}
                            transition={{ duration: 2 }}
                            className={cn("font-semibold tracking-tight", theme.textColor)}
                        >
                            Universe of <span className="serif-display italic">Us.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ delay: 1, duration: 2 }}
                            className={cn("text-[10px] mt-3 uppercase tracking-[0.5em]", theme.textColor)}
                        >
                            Floating memories in 3D space
                        </motion.p>
                    </div>

                    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                        <fog attach="fog" args={[theme.isDark ? '#0b0410' : '#fdf2f8', 14, 40]} />
                        <ambientLight intensity={theme.isDark ? 0.35 : 0.75} />
                        <pointLight position={[10, 12, 10]} intensity={1.1} color={theme.isDark ? "#fb7185" : "#f97373"} />
                        <pointLight position={[-12, -8, -10]} intensity={0.6} color={theme.isDark ? "#38bdf8" : "#22c55e"} />

                        <Stars radius={120} depth={60} count={2600} factor={4} saturation={0} fade speed={0.25} />

                        <Suspense fallback={null}>
                            {GALAXY_MEMORIES.map((m) => (
                                <MemoryCard key={m.id} memory={m} onClick={setSelected} theme={theme} />
                            ))}
                        </Suspense>

                        <OrbitControls
                            enableZoom={true}
                            enablePan={false}
                            minDistance={8}
                            maxDistance={25}
                            autoRotate
                            autoRotateSpeed={0.2}
                        />
                    </Canvas>
                </>
            )}

            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
                        onClick={() => setSelected(null)}
                    >
                        <motion.img
                            src={selected.imageUrl}
                            alt="Memory"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 120 }}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {!selected && (
                <div className="absolute bottom-32 sm:bottom-12 left-0 right-0 text-center pointer-events-none opacity-20 hover:opacity-100 transition-opacity">
                    <p className={cn("text-[10px] uppercase tracking-[0.4em]", theme.textColor)}>
                        Drag to explore • Scroll to zoom
                    </p>
                </div>
            )}
        </div>
    );
}
