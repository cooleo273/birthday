'use client';

import { useState, useEffect } from 'react';
import { saveJournalEntry, getJournalEntries, saveFutureMessage } from '@/lib/actions';
import { JournalEntry } from '@/types/database';
import { motion } from 'framer-motion';
import { Send, History, Sparkles, MessageCircle } from 'lucide-react';
import FloatingBackground from '@/components/ui/FloatingBackground';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { cn } from '@/lib/utils';

export default function JournalPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [text, setText] = useState('');
    const [isFuture, setIsFuture] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTimeTheme();

    useEffect(() => {
        fetchEntries();
    }, []);

    async function fetchEntries() {
        const data = await getJournalEntries();
        setEntries(data);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim()) return;

        setIsLoading(true);
        try {
            if (isFuture) {
                await saveFutureMessage(text);
                alert('Your message has been sealed until your birthday.');
            } else {
                await saveJournalEntry(text);
            }
            setText('');
            fetchEntries();
        } catch (err) {
            alert('Failed to save.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className={cn("min-h-screen pt-24 pb-48 px-6 relative overflow-hidden bg-gradient-to-br transition-colors duration-1000", theme.gradient)}>
            <FloatingBackground isDark={theme.isDark} count={8} />

            <div className="text-center mb-16 relative z-10">
                <h1 className={cn("mb-4 serif-display italic", theme.textColor)}>Private <span className="text-romantic-rose">Space.</span></h1>
                <p className={cn("opacity-50 max-w-sm mx-auto", theme.textColor)}>A quiet place for your thoughts.</p>
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <div className={cn(
                    "glass-card p-2 rounded-[2.5rem] mb-12 shadow-2xl transition-all duration-700",
                    theme.isDark ? "bg-white/5 border-white/10" : "bg-white/20 border-white/60"
                )}>
                    <div className={cn("flex rounded-[2rem] overflow-hidden mb-1 p-1", theme.isDark ? "bg-white/5" : "bg-black/[0.03]")}>
                        <button
                            onClick={() => setIsFuture(false)}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-[1.75rem] flex items-center justify-center gap-2 transition-all text-xs font-bold uppercase tracking-widest",
                                !isFuture 
                                    ? (theme.isDark ? "bg-rose-50 text-[#321d28] shadow-sm" : "bg-white text-black shadow-sm") 
                                    : cn("opacity-30 hover:opacity-100", theme.textColor)
                            )}
                        >
                            <MessageCircle size={14} />
                            <span>Today</span>
                        </button>
                        <button
                            onClick={() => setIsFuture(true)}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-[1.75rem] flex items-center justify-center gap-2 transition-all text-xs font-bold uppercase tracking-widest",
                                isFuture 
                                    ? (theme.isDark ? "bg-rose-50 text-[#321d28] shadow-sm" : "bg-white text-black shadow-sm") 
                                    : cn("opacity-30 hover:opacity-100", theme.textColor)
                            )}
                        >
                            <Sparkles size={14} />
                            <span>Future</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-10">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={isFuture ? "A message for your birthday..." : "Write anything..."}
                            className={cn(
                                "w-full h-48 bg-transparent border-none focus:ring-0 text-xl font-medium placeholder:opacity-20 resize-none serif-display italic",
                                theme.textColor
                            )}
                        />
                        <div className="flex justify-end mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-apple flex items-center gap-3 disabled:opacity-50"
                            >
                                <Send size={16} />
                                <span className="text-sm">{isFuture ? 'Seal' : 'Save'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-10">
                    <h3 className={cn("flex items-center gap-2 font-bold uppercase tracking-[0.3em] text-[10px] mb-8 opacity-30", theme.textColor)}>
                        <History size={14} />
                        Past Entries
                    </h3>
                    <div className="space-y-6">
                        {entries.map((entry) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                key={entry.id}
                                className={cn(
                                    "glass-card p-10 rounded-[2.5rem] shadow-lg transition-all duration-500",
                                    theme.isDark ? "bg-white/5 border-white/5" : "bg-white/40 border-black/5"
                                )}
                            >
                                <p className={cn("text-lg md:text-xl mb-6 leading-relaxed serif-display italic opacity-70", theme.textColor)}>"{entry.text}"</p>
                                <p className={cn("text-[10px] font-black uppercase tracking-widest opacity-20", theme.textColor)}>
                                    {new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
