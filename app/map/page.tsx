'use client';

import { useState, useEffect } from 'react';
import { getMemoryLocations } from '@/lib/actions';
import { MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { MemoryLocation } from '@/types/database';

export default function MapPage() {
    const [locations, setLocations] = useState<MemoryLocation[]>([]);
    const theme = useTimeTheme();

    useEffect(() => {
        getMemoryLocations().then(setLocations);
    }, []);

    return (
        <main className={cn("min-h-screen pt-24 pb-48 px-6 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={8} />

            <div className="max-w-4xl mx-auto px-6 mb-24 text-center relative z-10">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors mb-12 group opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>

                <h1 className={cn("mb-4 serif-display italic", theme.textColor)}>
                    Our <span className="text-romantic-rose">Map.</span>
                </h1>
                <p className={cn("opacity-40 max-w-xl mx-auto font-medium", theme.textColor)}>
                    Every place we've visited together holds a piece of our history.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 relative z-10 max-w-7xl mx-auto px-0">
                {locations.map((loc) => (
                    <div key={loc.id} className={cn(
                        "glass-card group p-6 rounded-[3rem] relative overflow-hidden transition-all duration-700",
                        theme.isDark ? "hover:bg-white/10" : "hover:bg-white/60"
                    )}>
                        <div className={cn(
                            "aspect-[4/3] rounded-[2rem] overflow-hidden mb-8 relative border",
                            theme.isDark ? "border-white/10" : "border-black/5"
                        )}>
                            <img
                                src={loc.image_url || '/placeholder-map.jpg'}
                                alt={loc.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className={cn(
                                "absolute top-4 right-4 p-2.5 rounded-full shadow-sm transition-colors",
                                theme.isDark ? "bg-stone-900/90 text-rose-300" : "bg-white/90 text-black"
                            )}>
                                <MapPin size={18} />
                            </div>
                        </div>

                        <h3 className={cn("mb-2", theme.textColor)}>{loc.title}</h3>
                        <p className={cn("opacity-40 text-[15px] leading-relaxed mb-8 line-clamp-2", theme.textColor)}>
                            {loc.description}
                        </p>

                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors",
                                theme.isDark ? "text-rose-300 hover:text-rose-200" : "text-rose-500 hover:text-rose-600"
                            )}
                        >
                            <span>Explore Spot</span>
                            <ExternalLink size={12} />
                        </a>
                    </div>
                ))}

                {locations.length === 0 && (
                    <div className={cn(
                        "col-span-full py-24 rounded-[3rem] border border-dashed flex flex-col items-center justify-center text-center",
                        theme.isDark ? "bg-white/[0.02] border-white/10" : "bg-black/[0.02] border-black/10"
                    )}>
                        <MapPin size={32} className={cn("opacity-10 mb-4", theme.textColor)} />
                        <p className={cn("opacity-30 italic font-medium", theme.textColor)}>No locations pinned yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
