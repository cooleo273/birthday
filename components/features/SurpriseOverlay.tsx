'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Quote, X } from 'lucide-react';
import { getRandomCompliment } from '@/lib/actions';
import { Compliment } from '@/types/database';

export default function SurpriseOverlay() {
    const [activeSurprise, setActiveSurprise] = useState<string | null>(null);
    const [compliment, setCompliment] = useState<Compliment | null>(null);

    async function handleCompliment() {
        const data = await getRandomCompliment();
        setCompliment(data);
        setActiveSurprise('compliment');
    }

    return (
        <>
            {/* Floating Buttons */}
            <div className="fixed top-6 right-6 z-40 flex flex-col gap-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCompliment}
                    className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-romantic-pink glass-card"
                >
                    <Quote size={20} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveSurprise('random')}
                    className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-romantic-rose glass-card"
                >
                    <Sparkles size={20} />
                </motion.button>
            </div>

            <AnimatePresence>
                {activeSurprise && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-romantic-red/20 backdrop-blur-md p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="glass-card max-w-lg w-full p-12 text-center relative rounded-[3rem] shadow-2xl"
                        >
                            <button
                                onClick={() => setActiveSurprise(null)}
                                className="absolute top-6 right-6 text-romantic-red/40 hover:text-romantic-red"
                            >
                                <X size={24} />
                            </button>

                            <Heart className="mx-auto text-romantic-pink mb-8 animate-pulse" size={48} fill="currentColor" />

                            {activeSurprise === 'compliment' && (
                                <div>
                                    <h2 className="text-sm uppercase tracking-widest font-bold text-romantic-red/50 mb-6">A little reminder...</h2>
                                    <p className="text-2xl md:text-3xl font-serif text-romantic-red font-bold leading-relaxed italic">
                                        "{compliment?.compliment_text || "You're absolutely beautiful inside and out."}"
                                    </p>
                                </div>
                            )}

                            {activeSurprise === 'random' && (
                                <div>
                                    <h2 className="text-sm uppercase tracking-widest font-bold text-romantic-red/50 mb-6">A random surprise</h2>
                                    <p className="text-2xl md:text-3xl font-serif text-romantic-red font-bold leading-relaxed">
                                        You're the best thing that ever happened to me. ❤️
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
