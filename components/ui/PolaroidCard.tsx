import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    title: string;
    date?: string;
    story?: string;
    imageUrl?: string;
    rotation?: number;
    className?: string;
}

export default function PolaroidCard({ title, date, story, imageUrl, rotation = 2, className }: Props) {
    const [expanded, setExpanded] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        const y = ((e.clientX - rect.left) / rect.width - 0.5) * -20;
        setTilt({ x, y });
    }

    return (
        <>
            {/* Card */}
            <motion.div
                ref={ref}
                layoutId={`polaroid-${title}`}
                initial={{ rotate: rotation, opacity: 0, y: 30 }}
                animate={{ rotate: rotation, opacity: 1, y: 0 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 20 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                onClick={() => setExpanded(true)}
                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                className={cn("cursor-pointer relative", className)}
            >
                <motion.div
                    style={{ rotateX: tilt.x, rotateY: tilt.y }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-white p-3 pb-12 shadow-2xl rounded-sm border border-neutral-100"
                >
                    {/* Shine */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-sm" />

                    <div className="aspect-square overflow-hidden relative">
                        {imageUrl ? (
                            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-100 flex items-center justify-center">
                                <span className="text-6xl">❤️</span>
                            </div>
                        )}
                        {/* Zoom hint */}
                        <div className="absolute bottom-2 right-2 bg-black/30 p-1 rounded-full opacity-0 group-hover:opacity-100">
                            <ZoomIn size={14} className="text-white" />
                        </div>
                    </div>

                    <div className="mt-3 px-1 text-center">
                        <p className="font-serif text-neutral-700 font-bold text-sm leading-tight">{title}</p>
                        {date && <p className="text-neutral-400 text-xs mt-1 italic">{date}</p>}
                    </div>
                </motion.div>
            </motion.div>

            {/* Expanded Modal */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-lg"
                        onClick={() => setExpanded(false)}
                    >
                        <motion.div
                            layoutId={`polaroid-${title}`}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white p-4 sm:p-6 pb-12 sm:pb-16 shadow-2xl w-[92vw] max-w-lg mx-auto rounded-sm relative"
                        >
                            <button
                                onClick={() => setExpanded(false)}
                                className="absolute top-4 right-4 bg-neutral-100 p-1.5 rounded-full hover:bg-neutral-200 transition-colors"
                            >
                                <X size={16} />
                            </button>
                            <div className="aspect-[4/3] overflow-hidden mb-4">
                                {imageUrl ? (
                                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center">
                                        <span className="text-8xl">❤️</span>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-neutral-800 mb-2">{title}</h3>
                            {date && <p className="text-rose-400 text-sm font-medium mb-3 italic">{date}</p>}
                            {story && <p className="text-neutral-600 leading-relaxed text-sm italic">{story}</p>}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
