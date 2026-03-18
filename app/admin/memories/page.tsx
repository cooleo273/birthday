'use client';

import { useState, useEffect, useRef } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { getMemories, upsertMemory, deleteMemory, uploadMedia } from '@/lib/actions';
import { Memory } from '@/types/database';
import { ImageIcon, X, Upload, Loader2 } from 'lucide-react';

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Memory> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const data = await getMemories();
    setMemories(data);
  }

  const columns = [
    { 
      header: 'Photo', 
      accessorKey: 'image_url',
      cell: (item: Memory) => (
        <div className="w-12 h-10 rounded-lg overflow-hidden bg-[#F5F5F7] border border-[#D2D2D7]/30 shadow-sm shrink-0">
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#D2D2D7]">
              <ImageIcon size={16} />
            </div>
          )}
        </div>
      )
    },
    { 
        header: 'Context', 
        accessorKey: 'title',
        cell: (item: Memory) => (
            <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#1D1D1F] tracking-tight">{item.title}</span>
                <span className="text-[12px] font-medium text-[#86868B] line-clamp-1 max-w-[150px] mt-0.5">{item.story}</span>
            </div>
        )
    },
    { 
      header: 'Date', 
      accessorKey: 'date',
      cell: (item: Memory) => (
        <span className="text-[#1D1D1F] font-bold text-[13px]">
          {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
  ];

  const handleAdd = () => {
    setEditingItem({ title: '', story: '', date: new Date().toISOString().split('T')[0], image_url: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Memory) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Memory) => {
    if (confirm(`Remove?`)) {
      await deleteMemory(item.id);
      loadData();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadMedia(file, 'media');
      setEditingItem({ ...editingItem!, image_url: url });
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await upsertMemory(editingItem);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Memories"
        data={memories}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Find moment..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Adjust Memory' : 'Archive New Photo'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Asset</label>
            <div 
              className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-[#D2D2D7]/50 flex flex-col items-center justify-center bg-[#F5F5F7]/30 hover:bg-[#F5F5F7] transition-all cursor-pointer overflow-hidden group"
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              {editingItem?.image_url ? (
                <>
                  <img src={editingItem.image_url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem({ ...editingItem, image_url: '' });
                      }}
                      className="w-10 h-10 bg-white text-[#FF3B30] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#86868B]">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
                  ) : (
                    <>
                      <Upload size={20} strokeWidth={2.5} />
                      <p className="font-bold text-[#1D1D1F] text-[13px]">Select Asset</p>
                    </>
                  )}
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Title</label>
              <input
                type="text"
                value={editingItem?.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem!, title: e.target.value })}
                className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Date</label>
              <input
                type="date"
                value={editingItem?.date || ''}
                onChange={(e) => setEditingItem({ ...editingItem!, date: e.target.value })}
                className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Narrative</label>
            <textarea
              value={editingItem?.story || ''}
              onChange={(e) => setEditingItem({ ...editingItem!, story: e.target.value })}
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px] h-32 resize-none"
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
               disabled={uploading}
               className="px-6 py-2 bg-[#0071E3] text-white font-bold rounded-lg shadow-sm hover:bg-[#0077ED] transition-colors text-[13px]"
             >
                {editingItem?.id ? 'Adjust' : 'Archive'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
