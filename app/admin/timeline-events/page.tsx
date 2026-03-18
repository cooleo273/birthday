'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { getTimelineEvents, upsertTimelineEvent, deleteTimelineEvent } from '@/lib/actions';
import { TimelineEvent } from '@/types/database';
import { Heart, Star, MapPin, Sparkles, Gift } from 'lucide-react';

const icons = { Heart, Star, MapPin, Sparkles, Gift };

export default function TimelineEventsPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<TimelineEvent> | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const data = await getTimelineEvents();
    setEvents(data);
  }

  const columns = [
    { 
      header: 'Date', 
      accessorKey: 'event_date',
      cell: (item: TimelineEvent) => (
        <span className="text-[14px] font-bold text-[#1D1D1F]">
          {new Date(item.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      )
    },
    { 
      header: 'Icon', 
      accessorKey: 'icon_name',
      cell: (item: TimelineEvent) => {
        const Icon = (icons as any)[item.icon_name || 'Heart'] || Heart;
        return (
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F7] flex items-center justify-center text-[#FF2D55]">
            <Icon size={14} strokeWidth={2.5} />
          </div>
        );
      }
    },
    { 
        header: 'Title', 
        accessorKey: 'title',
        cell: (item: TimelineEvent) => <span className="text-[14px] font-bold text-[#1D1D1F] tracking-tight">{item.title}</span>
    },
  ];

  const handleAdd = () => {
    setEditingItem({ 
      title: '', 
      description: '', 
      event_date: new Date().toISOString().split('T')[0],
      icon_name: 'Heart'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TimelineEvent) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: TimelineEvent) => {
    if (confirm(`Remove?`)) {
      await deleteTimelineEvent(item.id);
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await upsertTimelineEvent(editingItem);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Timeline"
        data={events}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Scan history..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Adjust Moment' : 'New Milestone'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Event Date</label>
              <input
                type="date"
                value={editingItem?.event_date || ''}
                onChange={(e) => setEditingItem({ ...editingItem!, event_date: e.target.value })}
                className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Icon</label>
              <select
                value={editingItem?.icon_name || 'Heart'}
                onChange={(e) => setEditingItem({ ...editingItem!, icon_name: e.target.value })}
                className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px] appearance-none"
              >
                {Object.keys(icons).map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Headline</label>
            <input
              type="text"
              value={editingItem?.title || ''}
              onChange={(e) => setEditingItem({ ...editingItem!, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Narrative</label>
            <textarea
              value={editingItem?.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem!, description: e.target.value })}
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px] h-32 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
             <button
               type="button"
               onClick={() => setIsModalOpen(false)}
               className="px-5 py-2 text-[13px] font-bold text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors"
             >
               Cancel
             </button>
             <button
               type="submit"
               className="px-6 py-2 bg-[#0071E3] text-white font-bold rounded-lg shadow-sm hover:bg-[#0077ED] transition-colors text-[13px]"
             >
              {editingItem?.id ? 'Update' : 'Commit'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
