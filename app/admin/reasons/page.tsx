'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { getAllReasons, upsertReason, deleteReason } from '@/lib/actions';
import { Reason } from '@/types/database';

export default function ReasonsPage() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Reason> | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const data = await getAllReasons();
    setReasons(data);
  }

  const columns = [
    { 
      header: 'Day', 
      accessorKey: 'unlock_day', 
      cell: (item: Reason) => (
        <span className="font-bold text-[#1D1D1F]">Day {item.unlock_day}</span>
      ) 
    },
    { 
      header: 'Reason', 
      accessorKey: 'reason_text',
      cell: (item: Reason) => <p className="text-[14px] font-medium text-[#1D1D1F] leading-relaxed line-clamp-2">{item.reason_text}</p>
    },
  ];

  const handleAdd = () => {
    setEditingItem({ reason_text: '', unlock_day: reasons.length + 1 });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Reason) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Reason) => {
    if (confirm(`Delete?`)) {
      await deleteReason(item.id);
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await upsertReason(editingItem);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="100 Reasons"
        data={reasons}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Find reason..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Edit Reason' : 'New Reason'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Unlock Day</label>
            <input
              type="number"
              value={editingItem?.unlock_day || ''}
              onChange={(e) => setEditingItem({ ...editingItem!, unlock_day: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Love Logic</label>
            <textarea
              value={editingItem?.reason_text || ''}
              onChange={(e) => setEditingItem({ ...editingItem!, reason_text: e.target.value })}
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px] h-32 resize-none"
              placeholder="Because..."
              required
            />
          </div>

           <div className="pt-2 flex items-center justify-end gap-3">
             <button
               type="button"
               onClick={() => setIsModalOpen(false)}
               className="px-5 py-2 text-[13px] font-bold text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors"
             >
               Discard
             </button>
             <button
               type="submit"
               className="px-6 py-2 bg-[#0071E3] text-white font-bold rounded-lg shadow-sm hover:bg-[#0077ED] transition-colors text-[13px]"
             >
              {editingItem?.id ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
