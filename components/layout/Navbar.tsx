'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, Image as LucideImage, Globe, Sparkles, LayoutGrid, Clock, PenTool, Moon, Gamepad2, X, Star, Lock, Gift } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTimeTheme } from '@/hooks/useTimeTheme';

const mainNavItems = [
    { name: 'Home', icon: Sparkles, href: '/' },
    { name: 'Journey', icon: Calendar, href: '/calendar' },
    { name: 'For You', icon: Heart, href: '/reasons' },
    { name: 'Universe', icon: Globe, href: '/universe' },
    { name: 'Memories', icon: LucideImage, href: '/gallery' },
];

const secondaryNavItems = [
    { name: 'Timeline', icon: Clock, href: '/timeline' },
    { name: 'Journal', icon: PenTool, href: '/journal' },
    { name: 'Dream Mode', icon: Moon, href: '/dream' },
    { name: 'Memory', icon: Gamepad2, href: '/games/memory' },
    { name: 'Word Search', icon: Gamepad2, href: '/games/word-search' },
    { name: 'Constellation', icon: Star, href: '/constellation' },
    { name: 'Time Capsule', icon: Lock, href: '/time-capsule' },
    { name: 'Coupons', icon: Gift, href: '/coupons' },
    { name: 'Garden', icon: Sparkles, href: '/garden' },
];

export default function Navbar() {
    const pathname = usePathname();
    const theme = useTimeTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (pathname === '/universe') return null;

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4"
             style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                            "mb-2 p-4 sm:p-6 rounded-[2.5rem] shadow-2xl border backdrop-blur-3xl grid grid-cols-2 gap-2 sm:gap-3 min-w-[240px] sm:min-w-[280px] max-w-[calc(100vw-2rem)]",
                            theme.isDark ? "bg-black/60 border-white/10" : "bg-white/60 border-black/5"
                        )}
                    >
                        {secondaryNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl transition-all group",
                                    theme.isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                                )}
                            >
                                <item.icon size={16} className={cn("opacity-40 group-hover:opacity-100 transition-opacity shrink-0", theme.textColor)} />
                                <span className={cn("text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity truncate", theme.textColor)}>
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.nav
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "px-2 py-2 rounded-full shadow-2xl flex items-center justify-center transition-colors duration-500 border",
                    theme.isDark ? "bg-black/40 border-white/10 backdrop-blur-3xl" : "bg-white/40 border-white/20 backdrop-blur-3xl"
                )}
            >
                <ul className="flex items-center gap-0 sm:gap-1">
                    {mainNavItems.map((item) => {
                        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="relative flex items-center justify-center p-2.5 sm:p-3 rounded-full group outline-none"
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className={cn("absolute inset-0 rounded-full", theme.isDark ? "bg-white/10" : "bg-black/5")}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <item.icon
                                        className={cn(
                                            'w-5 h-5 transition-all duration-300 relative z-10 stroke-[1.5px]',
                                            active
                                                ? (theme.isDark ? 'text-white scale-110' : 'text-black scale-110')
                                                : (theme.isDark ? 'text-white/30 group-hover:text-white/60' : 'text-black/30 group-hover:text-black/60')
                                        )}
                                    />
                                    <span className={cn(
                                        "absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden sm:block",
                                        theme.isDark ? "bg-stone-800 text-white/40" : "bg-white text-black/40"
                                    )}>
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}

                    <div className={cn("w-[1px] h-4 mx-1 sm:mx-2 opacity-10", theme.isDark ? "bg-white" : "bg-black")} />

                    <li>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={cn(
                                "relative flex items-center justify-center p-2.5 sm:p-3 rounded-full group outline-none transition-all",
                                isMenuOpen ? (theme.isDark ? "bg-white/10" : "bg-black/5") : ""
                            )}
                        >
                            {isMenuOpen ? (
                                <X size={20} className={cn("relative z-10 stroke-[1.5px]", theme.textColor)} />
                            ) : (
                                <LayoutGrid size={20} className={cn("relative z-10 opacity-30 group-hover:opacity-60 transition-opacity stroke-[1.5px]", theme.textColor)} />
                            )}
                            <span className={cn(
                                "absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden sm:block",
                                theme.isDark ? "bg-stone-800 text-white/40" : "bg-white text-black/40"
                            )}>
                                {isMenuOpen ? "Close" : "More"}
                            </span>
                        </button>
                    </li>
                </ul>
            </motion.nav>
        </div>

    );
}
