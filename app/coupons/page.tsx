'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Gift, Heart, Coffee, Film, Utensils, Star, CheckCircle2, RotateCcw } from 'lucide-react';
import { getCouponsWithRedemptions, redeemCoupon } from '@/lib/actions';
import { CouponWithRedemption } from '@/types/database';

const ICONS: Record<string, any> = {
    Film,
    Heart,
    Coffee,
    Utensils,
    Star,
    Gift,
};

function Card({
    coupon,
    index,
    total,
    onSwipe,
    isRedeeming,
}: {
    readonly coupon: CouponWithRedemption;
    readonly index: number;
    readonly total: number;
    readonly onSwipe: (coupon: CouponWithRedemption) => void;
    readonly isRedeeming: boolean;
}) {
    const theme = useTimeTheme();
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    const isFront = index === total - 1;
    const iconKey = coupon.icon ?? 'Gift';
    const Icon = ICONS[iconKey] ?? Gift;
    const used = !!coupon.redemption;

    return (
        <motion.div
            style={{
                x: isFront ? x : 0,
                rotate: (() => {
                    if (isFront) return rotate;
                    return index % 2 === 0 ? -2 : 2;
                })(),
                opacity: isFront ? opacity : 1,
                zIndex: index,
            }}
            animate={{
                scale: isFront ? 1 : 1 - (total - 1 - index) * 0.05,
                y: isFront ? 0 : (total - 1 - index) * -15, // stack visually
            }}
            drag={isFront && !used ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
                if (!isFront || used) return;
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000 || swipe > 10000 || Math.abs(offset.x) > 100) {
                    onSwipe(coupon);
                }
            }}
            className={cn(
                "absolute top-0 left-0 right-0 h-[400px] rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between items-center text-center border overflow-hidden",
                theme.isDark ? "bg-[#252328] border-[#3f3b45]" : "bg-[#fdfbf7] border-[#eadccc]"
            )}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />

            <div className="w-full flex justify-between items-start opacity-30">
                <Gift size={24} />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">No. {(index + 1).toString().padStart(3, '0')}</span>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 space-y-6 relative z-10 w-full">
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center shadow-inner", theme.isDark ? "bg-black/20" : "bg-black/5")}>
                    <Icon size={36} className={coupon.color ?? ''} />
                </div>
                
                <h2 className={cn("text-3xl font-serif italic leading-tight", theme.textColor)}>
                    {coupon.title}
                </h2>
                
                <div className="w-12 h-[1px] bg-current opacity-20" />
                
                <p className={cn("text-sm uppercase tracking-widest opacity-60 font-medium px-4", theme.textColor)}>
                    {coupon.description}
                </p>
            </div>

            <div className="w-full border-t border-dashed border-current opacity-20 pt-4 text-[10px] uppercase font-bold tracking-[0.3em]">
                {(() => {
                    if (used) {
                        return `Used • ${new Date(coupon.redemption!.redeemed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                    }
                    if (isRedeeming && isFront) return 'Saving...';
                    return 'Swipe to Use';
                })()}
            </div>
            
            {/* Stamp indicator when dragging */}
            <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"
                style={{ opacity: useTransform(x, [-100, -50, 50, 100], [1, 0, 0, 1]) }}
            >
                <div className="text-4xl font-black uppercase border-4 border-rose-500 text-rose-500 px-6 py-2 rounded-xl rotate-[-15deg] opacity-60 backdrop-blur-sm">
                    USE
                </div>
            </motion.div>

            {used && (
                <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Used</span>
                </div>
            )}
        </motion.div>
    );
}

export default function CouponsPage() {
    const theme = useTimeTheme();
    const [allCoupons, setAllCoupons] = useState<CouponWithRedemption[]>([]);
    const [redeemingId, setRedeemingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshCoupons() {
        setLoading(true);
        try {
            const data = await getCouponsWithRedemptions();
            setAllCoupons(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshCoupons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cards = useMemo(
        () => allCoupons.filter((c) => !c.redemption),
        [allCoupons]
    );

    const handleSwipe = async (coupon: CouponWithRedemption) => {
        if (redeemingId) return;
        setRedeemingId(coupon.id);
        try {
            await redeemCoupon(coupon.id);
            setAllCoupons((prev) =>
                prev.map((c) =>
                    c.id === coupon.id
                        ? { ...c, redemption: { id: 'local', coupon_id: coupon.id, redeemed_at: new Date().toISOString(), note: null } }
                        : c
                )
            );
        } catch {
            alert('Could not save redemption. Make sure Supabase tables exist, then try again.');
        } finally {
            setRedeemingId(null);
        }
    };

    const resetCards = async () => {
        // Reset is a DB action (admin). Here we just refresh.
        await refreshCoupons();
    };

    return (
        <main className={cn("min-h-screen pt-16 pb-32 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={8} />

            <div className="absolute top-10 left-0 right-0 z-20 px-4 max-w-4xl mx-auto flex justify-between items-center">
                <Link href="/" className={cn("inline-flex items-center gap-2 transition-colors group opacity-40 hover:opacity-100", theme.textColor)}>
                    <ArrowLeft size={16} />
                    <span className="label-ui text-[10px]">Home</span>
                </Link>
                
                <button 
                    onClick={resetCards}
                    className={cn("text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity", theme.textColor)}
                >
                    <span className="inline-flex items-center gap-2">
                        <RotateCcw size={14} />
                        Refresh
                    </span>
                </button>
            </div>

            <div className="max-w-md mx-auto px-4 relative z-10 flex flex-col items-center mt-10">
                <div className="text-center mb-12">
                    <h1 className={cn("mb-2 text-3xl md:text-4xl serif-display italic", theme.textColor)}>Love Coupons</h1>
                    <p className={cn("text-xs opacity-60 font-medium tracking-wide uppercase", theme.textColor)}>
                        Swipe to use one (we’ll remember when)
                    </p>
                </div>

                <div className="relative w-[300px] h-[400px]">
                    <AnimatePresence>
                        {(() => {
                            if (loading) {
                                return (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={cn(
                                            "absolute inset-0 flex flex-col items-center justify-center text-center p-8 rounded-[2rem] border border-dashed",
                                            theme.isDark ? "border-white/20 bg-white/5" : "border-black/20 bg-black/5"
                                        )}
                                    >
                                        <Gift size={48} className={cn("mb-6 opacity-30", theme.textColor)} />
                                        <p className={cn("text-[10px] uppercase tracking-widest font-bold opacity-50", theme.textColor)}>
                                            Loading...
                                        </p>
                                    </motion.div>
                                );
                            }

                            if (cards.length > 0) {
                                return cards.map((coupon, index) => (
                                    <Card
                                        key={coupon.id}
                                        coupon={coupon}
                                        index={index}
                                        total={cards.length}
                                        onSwipe={handleSwipe}
                                        isRedeeming={redeemingId === coupon.id}
                                    />
                                ));
                            }

                            return (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={cn(
                                        "absolute inset-0 flex flex-col items-center justify-center text-center p-8 rounded-[2rem] border border-dashed",
                                        theme.isDark ? "border-white/20 bg-white/5" : "border-black/20 bg-black/5"
                                    )}
                                >
                                    <Heart size={48} className={cn("mb-6 opacity-30", theme.textColor)} />
                                    <h3 className={cn("text-2xl serif-display italic mb-2", theme.textColor)}>All Used Up!</h3>
                                    <p className={cn("text-[10px] uppercase tracking-widest font-bold opacity-50", theme.textColor)}>
                                        Check the Admin page to see what was used.
                                    </p>
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
