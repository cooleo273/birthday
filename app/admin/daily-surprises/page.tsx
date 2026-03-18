'use client';

import { useState, useEffect, useRef } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { getDailySurprises, upsertDailySurprise, deleteDailySurprise, uploadMedia } from '@/lib/actions';
import { DailySurprise } from '@/types/database';
import { ImageIcon, X, Upload, Loader2 } from 'lucide-react';

export default function DailySurprisesPage() {
  const [surprises, setSurprises] = useState<DailySurprise[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurprise, setEditingSurprise] = useState<Partial<DailySurprise> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSurprises();
  }, []);

  async function loadSurprises() {
    const data = await getDailySurprises();
    setSurprises(data);
  }

  const columns = [
    { 
      header: 'Preview', 
      accessorKey: 'media_url',
      cell: (item: DailySurprise) => (
        <div className="w-12 h-10 rounded-lg overflow-hidden bg-[#F5F5F7] border border-[#D2D2D7]/30 shadow-sm shrink-0">
          {item.media_url ? (
            item.type === 'photo' ? (
                <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-[#0071E3] bg-[#0071E3]/5">
                    <span className="text-[10px] font-bold uppercase">{item.type}</span>
                </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#D2D2D7]">
              <ImageIcon size={16} />
            </div>
          )}
        </div>
      )
    },
    { 
      header: 'Day', 
      accessorKey: 'day_number',
      cell: (item: DailySurprise) => (
        <span className="font-bold text-[#1D1D1F]">Day {item.day_number}</span>
      )
    },
    { 
      header: 'Type', 
      accessorKey: 'type',
      cell: (item: DailySurprise) => (
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868B] bg-[#F5F5F7] px-2 py-1 rounded-md">
          {item.type}
        </span>
      )
    },
    { header: 'Title', accessorKey: 'title' },
  ];

  const handleAdd = () => {
    setEditingSurprise({ 
        day_number: surprises.length + 1,
        type: 'letter',
        title: '',
        content: '',
        media_url: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: DailySurprise) => {
    setEditingSurprise(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: DailySurprise) => {
    if (confirm(`Delete day ${item.day_number}?`)) {
      await deleteDailySurprise(item.id);
      loadSurprises();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadMedia(file, 'media');
      setEditingSurprise({ ...editingSurprise!, media_url: url });
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSurprise) return;

    try {
      await upsertDailySurprise(editingSurprise);
      setIsModalOpen(false);
      loadSurprises();
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Daily Surprises"
        data={surprises}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Find day..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSurprise?.id ? 'Edit Surprise' : 'Create New Day'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Sequence</label>
              <input
                type="number"
                value={editingSurprise?.day_number || ''}
                onChange={(e) => setEditingSurprise({ ...editingSurprise!, day_number: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Type</label>
              <select
                value={editingSurprise?.type || 'letter'}
                onChange={(e) => setEditingSurprise({ ...editingSurprise!, type: e.target.value as any })}
                className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px] appearance-none"
              >
                <option value="letter">Letter</option>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="puzzle">Puzzle</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Headline</label>
            <input
              type="text"
              value={editingSurprise?.title || ''}
              onChange={(e) => setEditingSurprise({ ...editingSurprise!, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Content</label>
            <textarea
              value={editingSurprise?.content || ''}
              onChange={(e) => setEditingSurprise({ ...editingSurprise!, content: e.target.value })}
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px] h-32 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">Media Asset</label>
            <div 
              className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-[#D2D2D7]/50 flex flex-col items-center justify-center bg-[#F5F5F7]/30 hover:bg-[#F5F5F7] transition-all cursor-pointer overflow-hidden group"
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              {editingSurprise?.media_url ? (
                <>
                  {editingSurprise.type === 'photo' ? (
                    <img src={editingSurprise.media_url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#0071E3]">
                        <ImageIcon size={32} />
                        <p className="text-[12px] font-bold uppercase tracking-widest">{editingSurprise.type} Uploaded</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSurprise({ ...editingSurprise!, media_url: '' });
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
                      <p className="font-bold text-[#1D1D1F] text-[13px]">Upload {editingSurprise?.type || 'File'}</p>
                      <p className="text-[11px]">Tap to select a file</p>
                    </>
                  )}
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
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
                {editingSurprise?.id ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
