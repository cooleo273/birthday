'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, VolumeX, SkipForward } from 'lucide-react';

const PLAYLIST = [
    { title: 'Romantic Ambient', path: '/audio/romantic-ambient.mp3' },
    { title: 'Sweet Memories', path: '/audio/sweet-memories.mp3' },
    { title: 'Love Story', path: '/audio/love-story.mp3' },
    { title: 'Midnight Waltz', path: '/audio/midnight-waltz.mp3' },
    { title: 'Forever Yours', path: '/audio/forever-yours.mp3' },
];

const BIRTHDAY_SONG = { title: 'Happy Birthday Hana!', path: '/audio/birthday-song.mp3' };
const BIRTHDAY_DATE = { month: 4, day: 19 }; // May is 4 (0-indexed)

export default function MusicPlayer() {
    const [playing, setPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isBirthday, setIsBirthday] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Check if today is the birthday
        const now = new Date();
        const isBday = now.getMonth() === BIRTHDAY_DATE.month && now.getDate() === BIRTHDAY_DATE.day;
        setIsBirthday(isBday);

        const initialTrack = isBday ? BIRTHDAY_SONG : PLAYLIST[0];
        audioRef.current = new Audio(initialTrack.path);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.25;

        // Try to autoplay
        const attemptPlay = () => {
            audioRef.current?.play()
                .then(() => {
                    setPlaying(true);
                    window.removeEventListener('click', attemptPlay);
                })
                .catch(() => {
                    // Autoplay blocked, wait for interaction
                    console.log('Autoplay blocked. Waiting for user interaction...');
                });
        };

        attemptPlay();
        window.addEventListener('click', attemptPlay);

        return () => {
            audioRef.current?.pause();
            window.removeEventListener('click', attemptPlay);
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;
        
        const track = isBirthday ? BIRTHDAY_SONG : PLAYLIST[currentTrackIndex];
        const wasPlaying = playing;
        
        audioRef.current.src = track.path;
        if (wasPlaying) {
            audioRef.current.play().catch(() => { });
        }
    }, [currentTrackIndex, isBirthday]);

    function toggle() {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => { });
        }
        setPlaying(!playing);
    }

    function nextTrack() {
        if (isBirthday) return; // Only one song on birthday or just keep it simple
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    }

    return (
        <div className="fixed top-6 left-6 z-50 flex items-center gap-2">
            <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-romantic-rose shadow-lg"
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

            {!isBirthday && (
                <motion.button
                    onClick={nextTrack}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-romantic-rose/70 shadow-md"
                    title="Next track"
                >
                    <SkipForward size={14} />
                </motion.button>
            )}

            {playing && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card px-3 py-1 rounded-full text-[10px] font-medium text-romantic-rose/80 whitespace-nowrap hidden sm:block"
                >
                    Now Playing: {isBirthday ? BIRTHDAY_SONG.title : PLAYLIST[currentTrackIndex].title}
                </motion.div>
            )}
        </div>
    );
}
