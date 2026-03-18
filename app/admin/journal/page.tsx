'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { getJournalEntries, deleteJournalEntry } from '@/lib/actions';
import { JournalEntry } from '@/types/database';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const data = await getJournalEntries();
    setEntries(data);
  }

  const columns = [
    { 
      header: 'Created At', 
      accessorKey: 'created_at',
      cell: (item: JournalEntry) => (
        <span className="text-[12px] font-bold text-[#86868B]">
          {new Date(item.created_at || '').toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Entry Fragment', 
      accessorKey: 'text',
      cell: (item: JournalEntry) => (
        <p className="text-[14px] text-[#1D1D1F] font-medium line-clamp-2 max-w-[400px]">
          {item.text}
        </p>
      )
    },
  ];

  const handleDelete = async (item: JournalEntry) => {
    if (confirm(`Remove this sensitive entry?`)) {
      await deleteJournalEntry(item.id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#F5F5F7] border border-[#D2D2D7]/30 rounded-2xl p-6 mb-8 flex items-start gap-4">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shrink-0">
          <span className="font-bold text-[18px]">!</span>
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-[#1D1D1F]">Confidential Log</h2>
          <p className="text-[13px] text-[#86868B] mt-1 leading-relaxed">
            Journal entries are read-only and represent protected personal data. You may only delete entries if requested by the user.
          </p>
        </div>
      </div>

      <DataTable
        title="Journal Entries"
        data={entries}
        columns={columns}
        onDelete={handleDelete}
        searchPlaceholder="Scan logs..."
      />
    </div>
  );
}
