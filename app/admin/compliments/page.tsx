'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { getCompliments, upsertCompliment, deleteCompliment } from '@/lib/actions';
import { Compliment } from '@/types/database';

export default function ComplimentsPage() {
  const [compliments, setCompliments] = useState<Compliment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Compliment> | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const data = await getCompliments();
    setCompliments(data);
  }

  const columns = [
    { 
      header: 'Compliment Content', 
      accessorKey: 'compliment_text',
      cell: (item: Compliment) => (
        <p className="text-[14px] font-medium text-[#1D1D1F] italic leading-relaxed">"{item.compliment_text}"</p>
      )
    },
  ];

  const handleAdd = () => {
    setEditingItem({ compliment_text: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Compliment) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Compliment) => {
    if (confirm(`Remove this compliment?`)) {
      await deleteCompliment(item.id);
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await upsertCompliment(editingItem);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Compliments"
        data={compliments}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Find words..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Edit Words' : 'New Compliment'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Expressions</label>
            <textarea
              value={editingItem?.compliment_text || ''}
              onChange={(e) => setEditingItem({ ...editingItem!, compliment_text: e.target.value })}
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px] h-32 resize-none"
              placeholder="Your smile..."
              required
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
              {editingItem?.id ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
