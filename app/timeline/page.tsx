'use client';

import { useState, useEffect } from 'react';
import { getTimelineEvents } from '@/lib/actions';
import { Heart, Star, MapPin, Camera, Calendar, ArrowLeft } from 'lucide-react';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { TimelineEvent } from '@/types/database';

const iconMap: Record<string, any> = {
    Heart,
    Star,
    MapPin,
    Camera,
    Calendar,
};

export default function TimelinePage() {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const theme = useTimeTheme();

    useEffect(() => {
        getTimelineEvents().then(setEvents);
    }, []);

    return (
        <main className={cn("min-h-screen pt-16 pb-32 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={8} />

            <div className="max-w-4xl mx-auto px-4 mb-16 text-center relative z-10">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors mb-12 group opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>

                <h1 className={cn("mb-4 serif-display italic", theme.textColor)}>
                    Our <span className="text-romantic-rose">History.</span>
                </h1>
                <p className={cn("opacity-40 max-w-lg mx-auto font-medium", theme.textColor)}>Every moment we've shared is a treasure.</p>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 z-10">
                <div className={cn("absolute left-[2.25rem] md:left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2", theme.isDark ? "bg-white/10" : "bg-black/10")} />

                <div className="space-y-10 md:space-y-24">
                    {events.map((event, index) => {
                        const Icon = iconMap[event.icon_name || 'Heart'] || Heart;
                        const isEven = index % 2 === 0;

                        return (
                            <div key={event.id} className="relative flex items-center justify-between md:justify-normal">
                            <div className={cn(
                                    "w-full md:w-[45%] pl-14 md:pl-0",
                                    isEven ? 'md:text-right md:order-1' : 'md:text-left md:order-3'
                                )}>
                                    <div className={cn(
                                        "glass-card p-5 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-700",
                                        theme.isDark ? "hover:bg-white/10" : "hover:bg-white/60"
                                    )}>
                                        <span className={cn("label-ui text-[10px] mb-4 block", theme.textColor, "opacity-30")}>
                                            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <h3 className={cn("mb-4", theme.textColor)}>{event.title}</h3>
                                        <p className={cn("leading-relaxed opacity-60", theme.textColor)}>{event.description}</p>
                                    </div>
                                </div>

                                <div className="absolute left-9 md:left-1/2 -translate-x-1/2 z-10 md:order-2">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full shadow-sm border flex items-center justify-center transition-colors duration-500",
                                        theme.isDark ? "bg-stone-900 border-white/10 text-rose-300" : "bg-white border-black/5 text-black"
                                    )}>
                                        <Icon size={18} strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
