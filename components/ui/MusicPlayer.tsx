'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Use a royalty-free soft piano loop
        // In production, replace with actual audio file placed in /public/audio/
        audioRef.current = new Audio('/audio/romantic-ambient.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.25;

        return () => {
            audioRef.current?.pause();
        };
    }, []);

    function toggle() {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => { }); // user interaction required
        }
        setPlaying(!playing);
    }

    return (
        <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed top-6 left-6 z-50 w-11 h-11 rounded-full glass-card flex items-center justify-center text-romantic-rose shadow-lg"
            title={playing ? 'Mute music' : 'Play music'}
        >
            <AnimatePresence mode="wait">
                {playing ? (
                    <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Music2 size={18} className="text-romantic-rose" />
                    </motion.div>
                ) : (
                    <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <VolumeX size={18} className="text-romantic-rose/50" />
                    </motion.div>
                )}
            </AnimatePresence>
            {playing && (
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-romantic-pink"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
        </motion.button>
    );
}
