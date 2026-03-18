'use client';

import { useState } from 'react';
import { adminLogin } from '@/lib/auth-actions';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminLogin(password);
      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Incorrect password');
      }
    } catch (err) {
      setError('System error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[360px] w-full"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <Heart className="text-white w-8 h-8 fill-current" />
          </div>
          <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Admin Portal</h1>
          <p className="text-[15px] font-medium text-[#86868B] mt-2">Hana's Birthday Journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-[#86868B] uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="block w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-[15px] font-medium focus:bg-white focus:border-[#0071E3]/20 transition-all outline-none"
            />
          </div>

          {error && (
            <p className="text-[#FF3B30] text-[13px] font-bold text-center italic">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-8 bg-[#0071E3] text-white font-bold rounded-xl shadow-md hover:bg-[#0077ED] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-[14px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
