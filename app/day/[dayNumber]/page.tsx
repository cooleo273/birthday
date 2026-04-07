'use client';

import { motion } from 'framer-motion';
import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react';
import Link from 'next/link';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import ConfettiEffect from '@/components/ui/ConfettiEffect';
import { DailySurprise, BirthdayEvent } from '@/types/database';
import { getDailySurprise, getBirthdayEvents } from '@/lib/actions';
import { isDayUnlocked, TOTAL_DAYS } from '@/lib/date-utils';

export default function DayPage({ params }: Readonly<{ params: Promise<{ dayNumber: string }> }>) {
    const { dayNumber: dayNumberStr } = use(params);
    const dayNumber = Number.parseInt(dayNumberStr, 10);
    const theme = useTimeTheme();
    const [surprise, setSurprise] = useState<DailySurprise | null>(null);
    const [loading, setLoading] = useState(true);
    const [birthdayEvents, setBirthdayEvents] = useState<BirthdayEvent[]>([]);

    useEffect(() => {
        if (Number.isNaN(dayNumber) || dayNumber < 1 || dayNumber > TOTAL_DAYS) return;

        async function fetchData() {
            try {
                const [surpriseData, programData] = await Promise.all([
                    getDailySurprise(dayNumber),
                    dayNumber === 62 ? getBirthdayEvents() : Promise.resolve([] as BirthdayEvent[]),
                ]);
                setSurprise(surpriseData);
                setBirthdayEvents(programData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        if (isDayUnlocked(dayNumber)) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [dayNumber]);

    if (Number.isNaN(dayNumber) || dayNumber < 1 || dayNumber > TOTAL_DAYS) return notFound();

    const prevDay = dayNumber > 1 ? dayNumber - 1 : null;
    const nextDay = dayNumber < TOTAL_DAYS ? dayNumber + 1 : null;

    if (!isDayUnlocked(dayNumber)) {
        return (
            <main className={cn("min-h-screen pt-16 pb-32 px-4 relative overflow-hidden bg-gradient-to-br flex flex-col items-center justify-center text-center transition-colors duration-1000", theme.gradient)}>
                <FloatingBackground isDark={theme.isDark} count={4} />
                <div className={cn("w-16 h-16 rounded-full border mb-8 flex items-center justify-center opacity-40", theme.isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5")}>
                    <span className="text-2xl">🌙</span>
                </div>
                <h1 className={cn("text-2xl md:text-3xl font-serif italic mb-2 opacity-40", theme.textColor)}>Not yet.</h1>
                <p className={cn("text-xs md:text-sm max-w-xs mx-auto opacity-30 font-medium", theme.textColor)}>This moment hasn't arrived. Come back on day {dayNumber}.</p>
                <div className="mt-10 flex items-center justify-center gap-2">
                    {prevDay ? (
                        <Link
                            href={`/day/${prevDay}`}
                            className={cn(
                                "inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold border backdrop-blur-xl transition-all active:scale-[0.98] opacity-70 hover:opacity-100",
                                theme.isDark ? "bg-white/5 border-white/10 text-white" : "bg-white/40 border-white/60 text-black"
                            )}
                        >
                            Prev
                        </Link>
                    ) : (
                        <span className={cn("inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold border opacity-20", theme.isDark ? "border-white/10 text-white" : "border-black/10 text-black")}>
                            Prev
                        </span>
                    )}
                    <span className={cn("text-[10px] font-bold uppercase tracking-[0.25em] opacity-30", theme.textColor)}>
                        Day {dayNumber}
                    </span>
                    {nextDay ? (
                        <Link
                            href={`/day/${nextDay}`}
                            className={cn(
                                "inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold border backdrop-blur-xl transition-all active:scale-[0.98] opacity-70 hover:opacity-100",
                                theme.isDark ? "bg-white/5 border-white/10 text-white" : "bg-white/40 border-white/60 text-black"
                            )}
                        >
                            Next
                        </Link>
                    ) : (
                        <span className={cn("inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold border opacity-20", theme.isDark ? "border-white/10 text-white" : "border-black/10 text-black")}>
                            Next
                        </span>
                    )}
                </div>
                <Link href="/calendar" className={cn("mt-12 label-ui hover:opacity-100 transition-opacity", theme.textColor)}>Return to Journey</Link>
            </main>
        );
    }

    const renderMedia = () => {
        if (!surprise?.media_url) return null;

        const isVideo = surprise.media_url.match(/\.(mp4|webm|ogg)$/i) || surprise.type === 'video';
        const isAudio = surprise.media_url.match(/\.(mp3|wav|ogg)$/i) || surprise.type === 'voice';

        if (isVideo) {
            return (
                <div className="w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black mb-8 aspect-video">
                    <video src={surprise.media_url} controls className="w-full h-full" />
                </div>
            );
        }

        if (isAudio) {
            return (
                <div className={cn("w-full p-8 rounded-2xl border flex items-center gap-6 mb-8 shadow-xl", theme.isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-white/60")}>
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                        <Volume2 size={24} />
                    </div>
                    <audio src={surprise.media_url} controls className="flex-1" />
                </div>
            );
        }

        // Default to Image
        return (
            <div className="w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl mb-8 bg-white/5">
                <img src={surprise.media_url} alt={surprise.title} className="w-full h-auto object-cover max-h-[500px]" />
            </div>
        );
    };

    return (
        <main className={cn("min-h-screen pt-16 pb-32 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <ConfettiEffect active={!loading && !!surprise} />
            <FloatingBackground isDark={theme.isDark} count={6} />

            <div className="max-w-xl mx-auto px-4 flex flex-col items-center relative z-10">
                <Link href="/calendar" className={cn("inline-flex items-center gap-2 transition-colors mb-20 group self-start opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Journey</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                >
                    <div className="text-center mb-12">
                        <div className={cn("label-ui mb-3 font-black", theme.accentColor)}>
                            {surprise?.type || 'Something for you'}
                        </div>
                        <h1 className={cn("text-2xl md:text-4xl font-serif italic mb-2 tracking-tight line-clamp-2", theme.textColor)}>
                            {surprise?.title || 'Today'}
                        </h1>
                        <div className={cn("w-12 h-0.5 mx-auto mt-6 opacity-10", theme.isDark ? "bg-white" : "bg-black")} />
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4 opacity-20">
                            <Sparkles className="animate-pulse" />
                            <p className="italic serif-display">Unwrapping...</p>
                        </div>
                    ) : (
                        <div className={cn(
                            "glass-card p-5 md:p-7 rounded-[2.25rem] shadow-2xl relative overflow-hidden",
                            theme.isDark ? "bg-white/5 border-white/10" : "bg-white/20 border-white/60"
                        )}>
                            <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-20", theme.isDark ? "via-rose-300" : "via-rose-400")} />

                            {renderMedia()}

                            <div className="prose prose-stone max-w-none">
                                <p className={cn("text-base md:text-lg leading-relaxed serif-display italic font-medium opacity-80", theme.textColor)}>
                                    {surprise?.content || "No message attached, but you're still amazing!"}
                                </p>
                            </div>

                            <div className={cn("mt-8 flex items-center gap-2 opacity-20", theme.textColor)}>
                                <Sparkles size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Day {dayNumber} • Hand-crafted with love</span>
                            </div>
                        </div>
                    )}
                </motion.div>

                <div className="w-full mt-10 flex items-center justify-between gap-3">
                    {prevDay ? (
                        <Link
                            href={`/day/${prevDay}`}
                            className={cn(
                                "flex-1 inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold border backdrop-blur-xl transition-all active:scale-[0.98] opacity-70 hover:opacity-100",
                                theme.isDark ? "bg-white/5 border-white/10 text-white" : "bg-white/40 border-white/60 text-black"
                            )}
                        >
                            Prev
                        </Link>
                    ) : (
                        <span className={cn("flex-1 inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold border opacity-20", theme.isDark ? "border-white/10 text-white" : "border-black/10 text-black")}>
                            Prev
                        </span>
                    )}

                    <span className={cn("px-2 text-[10px] font-bold uppercase tracking-[0.25em] opacity-30", theme.textColor)}>
                        Day {dayNumber}
                    </span>

                    {nextDay ? (
                        <Link
                            href={`/day/${nextDay}`}
                            className={cn(
                                "flex-1 inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold border backdrop-blur-xl transition-all active:scale-[0.98] opacity-70 hover:opacity-100",
                                theme.isDark ? "bg-white/5 border-white/10 text-white" : "bg-white/40 border-white/60 text-black"
                            )}
                        >
                            Next
                        </Link>
                    ) : (
                        <span className={cn("flex-1 inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold border opacity-20", theme.isDark ? "border-white/10 text-white" : "border-black/10 text-black")}>
                            Next
                        </span>
                    )}
                </div>

                {dayNumber === 62 && (
                    <section className="w-full mt-16 space-y-6">
                        <div className="text-center">
                            <div className={cn("label-ui mb-3 font-black", theme.accentColor)}>
                                Birthday Program
                            </div>
                            <h2 className={cn("text-2xl md:text-3xl font-serif italic", theme.textColor)}>
                                Today&apos;s Celebration Plan
                            </h2>
                        </div>

                        {birthdayEvents.length === 0 ? (
                            <div
                                className={cn(
                                    "glass-card p-8 rounded-3xl text-center text-sm opacity-70",
                                    theme.isDark ? "bg-white/5 border-white/10" : "bg-white/30 border-white/60"
                                )}
                            >
                                <p className="serif-display italic">
                                    The plan is still being written behind the scenes. Just know that whatever we do today,
                                    it&apos;s all for you. 💫
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {birthdayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className={cn(
                                            "glass-card p-5 rounded-3xl flex items-start gap-4 shadow-lg",
                                            theme.isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-white/60"
                                        )}
                                    >
                                        <div className="flex flex-col items-center mr-1">
                                            <span
                                                className={cn(
                                                    "text-[10px] font-bold uppercase tracking-[0.25em] opacity-60",
                                                    theme.textColor
                                                )}
                                            >
                                                {event.event_time}
                                            </span>
                                            <span
                                                className={cn(
                                                    "mt-2 w-1 h-8 rounded-full opacity-20",
                                                    theme.accentColor
                                                )}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p
                                                className={cn(
                                                    "text-sm font-bold tracking-tight",
                                                    theme.textColor
                                                )}
                                            >
                                                {event.activity}
                                            </p>
                                            {event.location && (
                                                <p className="text-xs font-semibold text-[#86868B]">
                                                    {event.location}
                                                </p>
                                            )}
                                            {event.note && (
                                                <p className="text-xs opacity-70 serif-display italic">
                                                    {event.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                <Link href="/calendar" className={cn("mt-20 label-ui opacity-40 hover:opacity-100 transition-opacity", theme.textColor)}>
                    Keep exploring
                </Link>
            </div>
        </main>
    );
}
