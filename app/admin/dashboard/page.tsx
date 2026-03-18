import { 
  getDailySurprises, 
  getMemories, 
  getTimelineEvents, 
  getAllReasons, 
  getCompliments, 
  getJournalEntries,
  getMemoryLocations
} from '@/lib/actions';
import { 
  Gift, 
  Heart, 
  Image as ImageIcon, 
  Calendar, 
  MessageCircleHeart, 
  BookHeart,
  MapPin,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [
    surprises,
    memories,
    timeline,
    reasons,
    compliments,
    journal,
    locations
  ] = await Promise.all([
    getDailySurprises(),
    getMemories(),
    getTimelineEvents(),
    getAllReasons(),
    getCompliments(),
    getJournalEntries(),
    getMemoryLocations()
  ]);

  const cards = [
    { name: 'Daily Surprises', count: surprises.length, icon: Gift, color: '#0071E3', href: '/admin/daily-surprises' },
    { name: 'Memories', count: memories.length, icon: ImageIcon, color: '#AF52DE', href: '/admin/memories' },
    { name: 'Timeline', count: timeline.length, icon: Calendar, color: '#FF2D55', href: '/admin/timeline-events' },
    { name: '100 Reasons', count: reasons.length, icon: Heart, color: '#FF3B30', href: '/admin/reasons' },
    { name: 'Compliments', count: compliments.length, icon: MessageCircleHeart, color: '#FF9500', href: '/admin/compliments' },
    { name: 'Memory Map', count: locations.length, icon: MapPin, color: '#34C759', href: '/admin/memory-locations' },
    { name: 'Journal', count: journal.length, icon: BookHeart, color: '#5856D6', href: '/admin/journal' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[32px] font-bold text-[#1D1D1F] tracking-tight">Overview</h1>
        <p className="text-[15px] font-medium text-[#86868B] mt-1">Status of your romantic journey database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.name} href={card.href} className="group">
            <div className="bg-white p-5 rounded-2xl border border-[#D2D2D7]/30 shadow-sm hover:shadow-md transition-all h-full">
              <div className="flex items-start justify-between">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4"
                  style={{ backgroundColor: card.color }}
                >
                  <card.icon size={20} strokeWidth={2.5} />
                </div>
                <ChevronRight size={16} className="text-[#D2D2D7] group-hover:text-[#1D1D1F] transition-colors" />
              </div>
              <div>
                <p className="text-[28px] font-bold text-[#1D1D1F] leading-none mb-1">{card.count}</p>
                <p className="text-[13px] font-bold text-[#1D1D1F] tracking-tight">{card.name}</p>
                <p className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider mt-2">Active Entries</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-[#F5F5F7] p-8 rounded-2xl border border-[#D2D2D7]/30 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-[#0071E3] rounded-2xl flex items-center justify-center text-white flex-shrink-0">
          <Heart size={32} fill="currentColor" />
        </div>
        <div className="flex-1">
          <h2 className="text-[20px] font-bold text-[#1D1D1F]">Manage with Love</h2>
          <p className="text-[15px] text-[#86868B] mt-1 leading-relaxed">
            All updates are pushed instantly to the user interface. Make sure to review your content before publishing.
          </p>
        </div>
        <button className="px-6 py-2 bg-[#0071E3] text-white text-[13px] font-bold rounded-lg hover:bg-[#0077ED] transition-colors">
          View Website
        </button>
      </div>
    </div>
  );
}
