'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Gift, 
  MessageCircleHeart, 
  Heart, 
  Calendar, 
  Image, 
  MapPin, 
  BookHeart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Daily Surprises', href: '/admin/daily-surprises', icon: Gift },
  { name: 'Coupons', href: '/admin/coupons', icon: Gift },
  { name: 'Compliments', href: '/admin/compliments', icon: MessageCircleHeart },
  { name: '100 Reasons', href: '/admin/reasons', icon: Heart },
  { name: 'Timeline', href: '/admin/timeline-events', icon: Calendar },
  { name: 'Memories', href: '/admin/memories', icon: Image },
  { name: 'Memory Map', href: '/admin/memory-locations', icon: MapPin },
  { name: 'Birthday Program', href: '/admin/birthday-program', icon: Calendar },
  { name: 'Journal', href: '/admin/journal', icon: BookHeart },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#FBFBFD] border-r border-[#D2D2D7]/30 flex flex-col h-screen sticky top-0 z-[100]">
      <div className="px-6 py-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
          <Heart className="text-white w-4 h-4 fill-current" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-[#1D1D1F]">Admin Portal</span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors relative",
                isActive 
                  ? "bg-[#0071E3] text-white" 
                  : "text-[#1D1D1F] hover:bg-[#F5F5F7]"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-[#86868B]")} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="p-4 bg-white/50 border border-[#D2D2D7]/20 rounded-xl">
          <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#28CD41] rounded-full" />
            <span className="text-[12px] font-semibold text-[#1D1D1F]">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
