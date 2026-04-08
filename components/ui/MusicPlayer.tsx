'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Music2,
    VolumeX,
    SkipForward,
    SkipBack,
    ChevronDown,
    ChevronUp,
    Pause,
    Play,
    Repeat,
    Volume2,
} from 'lucide-react';

const PLAYLIST = [
    { title: 'Romantic Ambient', path: '/audio/romantic-ambient.mp3' },
    { title: 'Sweet Memories', path: '/audio/sweet-memories.mp3' },
    { title: 'Love Story', path: '/audio/love-story.mp3' },
    { title: 'Midnight Waltz', path: '/audio/midnight-waltz.mp3' },
];

const BIRTHDAY_SONG = { title: 'Happy Birthday Hana!', path: '/audio/birthday-song.mp3' };
const BIRTHDAY_DATE = { month: 4, day: 19 }; // May is 4 (0-indexed)

function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
    const [playing, setPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isBirthday, setIsBirthday] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [bufferedEnd, setBufferedEnd] = useState(0);
    const [volume, setVolume] = useState(0.25);
    const [muted, setMuted] = useState(false);
    const [loop, setLoop] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const userInitiatedRef = useRef(false);
    const scrubbingRef = useRef(false);

    const track = useMemo(() => {
        return isBirthday ? BIRTHDAY_SONG : PLAYLIST[currentTrackIndex];
    }, [currentTrackIndex, isBirthday]);

    useEffect(() => {
        // Check if today is the birthday
        const now = new Date();
        const isBday = now.getMonth() === BIRTHDAY_DATE.month && now.getDate() === BIRTHDAY_DATE.day;
        setIsBirthday(isBday);

        const initialTrack = isBday ? BIRTHDAY_SONG : PLAYLIST[0];
        const audio = new Audio(initialTrack.path);
        audio.preload = 'metadata';
        audio.loop = true;
        audio.volume = 0.25;
        audio.playbackRate = 1;
        audioRef.current = audio;

        const onLoadedMetadata = () => {
            setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        };
        const onTimeUpdate = () => {
            if (!scrubbingRef.current) setCurrentTime(audio.currentTime || 0);
        };
        const onProgress = () => {
            try {
                const b = audio.buffered;
                if (!b || b.length === 0) return setBufferedEnd(0);
                setBufferedEnd(b.end(b.length - 1));
            } catch {
                setBufferedEnd(0);
            }
        };
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        const onWaiting = () => setLoading(true);
        const onPlaying = () => setLoading(false);
        const onEnded = () => {
            if (audio.loop) return;
            if (isBday) return;
            setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('progress', onProgress);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('playing', onPlaying);
        audio.addEventListener('ended', onEnded);

        // Try to autoplay
        const attemptPlay = () => {
            userInitiatedRef.current = true;
            audio.play()
                .then(() => {
                    globalThis.removeEventListener('click', attemptPlay);
                })
                .catch(() => {
                    // Autoplay blocked, wait for interaction
                    console.log('Autoplay blocked. Waiting for user interaction...');
                });
        };

        attemptPlay();
        globalThis.addEventListener('click', attemptPlay);

        return () => {
            audio.pause();
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('progress', onProgress);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('playing', onPlaying);
            audio.removeEventListener('ended', onEnded);
            globalThis.removeEventListener('click', attemptPlay);
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        setLoading(true);
        setDuration(0);
        setCurrentTime(0);
        setBufferedEnd(0);

        const wasPlaying = !audio.paused;
        audio.src = track.path;
        audio.load();
        if (wasPlaying) audio.play().catch(() => { });
    }, [currentTrackIndex, isBirthday]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.muted = muted;
    }, [muted]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.loop = loop || isBirthday;
    }, [loop, isBirthday]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.playbackRate = playbackRate;
    }, [playbackRate]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!expanded) return;
            const target = e.target as HTMLElement | null;
            const tag = target?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || (target as any)?.isContentEditable) return;

            const audio = audioRef.current;
            if (!audio) return;

            if (e.code === 'Space') {
                e.preventDefault();
                userInitiatedRef.current = true;
                if (audio.paused) audio.play().catch(() => { });
                else audio.pause();
            }

            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                audio.currentTime = Math.max(0, (audio.currentTime || 0) - 5);
            }
            if (e.code === 'ArrowRight') {
                e.preventDefault();
                audio.currentTime = Math.min(duration || audio.duration || 0, (audio.currentTime || 0) + 5);
            }
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                setMuted(false);
                setVolume((v) => Math.min(1, Math.round((v + 0.05) * 100) / 100));
            }
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                setMuted(false);
                setVolume((v) => Math.max(0, Math.round((v - 0.05) * 100) / 100));
            }
        };
        globalThis.addEventListener('keydown', onKeyDown);
        return () => globalThis.removeEventListener('keydown', onKeyDown);
    }, [expanded, duration]);

    function togglePlay() {
        const audio = audioRef.current;
        if (!audio) return;
        userInitiatedRef.current = true;
        if (audio.paused) audio.play().catch(() => { });
        else audio.pause();
    }

    function nextTrack() {
        if (isBirthday) return; // Only one song on birthday or just keep it simple
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    }

    function prevTrack() {
        if (isBirthday) return;
        setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    }

    function seekTo(nextTime: number) {
        const audio = audioRef.current;
        if (!audio) return;
        const t = Math.max(0, Math.min(duration || audio.duration || 0, nextTime));
        audio.currentTime = t;
        setCurrentTime(t);
    }

    const title = track.title;
    const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferedPct = duration > 0 ? (Math.min(bufferedEnd, duration) / duration) * 100 : 0;
    const showAdvanced = expanded && userInitiatedRef.current;
    let loopTitle = 'Loop off';
    if (isBirthday) loopTitle = 'Loop is always on for birthday song';
    else if (loop) loopTitle = 'Loop on';

    return (
        <div className="fixed top-6 left-6 z-50 flex items-center gap-2">
            <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-romantic-rose shadow-lg"
                title={playing ? 'Pause music' : 'Play music'}
            >
                <AnimatePresence mode="wait">
                    {playing
                        ? (
                            <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Pause size={18} className="text-romantic-rose" />
                            </motion.div>
                        )
                        : (
                            <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Play size={18} className="text-romantic-rose/70" />
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
                <div className="flex items-center gap-2">
                    <motion.button
                        onClick={prevTrack}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-romantic-rose/70 shadow-md"
                        title="Previous track"
                    >
                        <SkipBack size={14} />
                    </motion.button>
                    <motion.button
                        onClick={nextTrack}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-romantic-rose/70 shadow-md"
                        title="Next track"
                    >
                        <SkipForward size={14} />
                    </motion.button>
                </div>
            )}

            <motion.button
                onClick={() => setExpanded((v) => !v)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-romantic-rose/70 shadow-md hidden sm:flex"
                title={expanded ? 'Hide controls' : 'Show controls'}
            >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </motion.button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        className="glass-card rounded-2xl px-4 py-3 shadow-lg hidden sm:block min-w-[320px]"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <Music2 size={14} className="text-romantic-rose/70 shrink-0" />
                                    <p className="text-[11px] font-bold text-romantic-rose/80 uppercase tracking-widest truncate">
                                        {isBirthday ? 'Birthday Song' : 'Now Playing'}
                                    </p>
                                    {loading && (
                                        <span className="text-[10px] font-semibold text-romantic-rose/50">Loading…</span>
                                    )}
                                </div>
                                <p className="text-[13px] font-semibold text-romantic-rose/90 truncate">
                                    {title}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <motion.button
                                    onClick={() => setMuted((m) => !m)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center text-romantic-rose/80"
                                    title={muted ? 'Unmute' : 'Mute'}
                                >
                                    {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </motion.button>

                                <motion.button
                                    onClick={() => setLoop((v) => !v)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                    disabled={isBirthday}
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center text-romantic-rose/80 disabled:opacity-40 disabled:cursor-not-allowed"
                                    title={loopTitle}
                                >
                                    <Repeat size={16} className={loop || isBirthday ? 'opacity-100' : 'opacity-50'} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Seek bar */}
                        <div className="mt-3">
                            <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className="absolute inset-y-0 left-0 bg-white/15"
                                    style={{ width: `${Math.max(0, Math.min(100, bufferedPct))}%` }}
                                />
                                <div
                                    className="absolute inset-y-0 left-0 bg-romantic-rose/70"
                                    style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={Math.max(0, duration)}
                                    step={0.1}
                                    value={Math.min(currentTime, duration || 0)}
                                    onMouseDown={() => { scrubbingRef.current = true; }}
                                    onMouseUp={() => { scrubbingRef.current = false; }}
                                    onTouchStart={() => { scrubbingRef.current = true; }}
                                    onTouchEnd={() => { scrubbingRef.current = false; }}
                                    onChange={(e) => seekTo(Number.parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    aria-label="Seek"
                                />
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-romantic-rose/60">
                                <span>{formatTime(currentTime)}</span>
                                <span>-{formatTime(Math.max(0, (duration || 0) - currentTime))}</span>
                            </div>
                        </div>

                        {/* Advanced controls */}
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[10px] font-bold text-romantic-rose/60 uppercase tracking-widest mb-1">
                                    Volume
                                </p>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={muted ? 0 : volume}
                                    onChange={(e) => {
                                        const v = Number.parseFloat(e.target.value);
                                        setMuted(false);
                                        setVolume(v);
                                    }}
                                    className="w-full accent-[rgb(244,63,94)]"
                                    aria-label="Volume"
                                />
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-romantic-rose/60 uppercase tracking-widest mb-1">
                                    Speed
                                </p>
                                <div className="flex items-center gap-2">
                                    {[0.75, 1, 1.25, 1.5].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setPlaybackRate(r)}
                                            className={[
                                                "px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors",
                                                playbackRate === r ? "bg-romantic-rose/80 text-white" : "bg-white/10 text-romantic-rose/70 hover:bg-white/15",
                                            ].join(' ')}
                                        >
                                            {r}x
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {showAdvanced && (
                            <p className="mt-3 text-[10px] font-medium text-romantic-rose/40">
                                Shortcuts (while open): Space play/pause, ←/→ seek 5s, ↑/↓ volume.
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
