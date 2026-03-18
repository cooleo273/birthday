'use client';

import { adminLogout } from '@/lib/auth-actions';
import { LogOut, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminHeader() {
  return (
    <header className="h-[52px] bg-[#FBFBFD]/80 backdrop-blur-xl border-b border-[#D2D2D7]/30 px-8 flex items-center justify-between sticky top-0 z-[90]">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest">Hana's Birthday Journey</span>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-1.5 text-[#86868B] hover:text-[#1D1D1F] transition-colors relative">
          <Bell size={18} strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF3B30] border border-white rounded-full" />
        </button>

        <div className="h-4 w-[1px] bg-[#D2D2D7]/50" />

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <p className="text-[12px] font-bold text-[#1D1D1F]">Admin</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#F5F5F7] border border-[#D2D2D7]/30 flex items-center justify-center">
              <User size={14} className="text-[#86868B]" />
            </div>

            <button
              onClick={() => adminLogout()}
              className="p-1.5 text-[#86868B] hover:text-[#FF3B30] transition-colors"
              title="Logout"
            >
              <LogOut size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
