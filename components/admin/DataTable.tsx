'use client';

import { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAdd?: () => void;
  title: string;
  searchPlaceholder?: string;
}

export default function DataTable<T extends { id: string | number }>({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onAdd,
  title,
  searchPlaceholder = "Search..."
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((item) => {
    return Object.values(item).some(
      (value) => 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1D1D1F] tracking-tight">{title}</h1>
          <p className="text-[13px] text-[#86868B] mt-0.5">{filteredData.length} total entries</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B] w-4 h-4 transition-colors group-focus-within:text-[#0071E3]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#F5F5F7] border border-transparent rounded-lg text-[13px] outline-none focus:bg-white focus:border-[#0071E3]/20 w-48 md:w-64 transition-all"
            />
          </div>

          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0071E3] text-white text-[13px] font-bold rounded-lg hover:bg-[#0077ED] transition-colors"
            >
              <Plus size={14} strokeWidth={3} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#D2D2D7]/30 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F5F7]/50">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-2.5 text-[11px] font-bold text-[#86868B] uppercase tracking-wider border-b border-[#D2D2D7]/20">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-2.5 text-[11px] font-bold text-[#86868B] uppercase tracking-wider border-b border-[#D2D2D7]/20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D2D2D7]/10">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-[#F5F5F7]/30 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-3.5 text-[13px] text-[#1D1D1F] font-medium leading-[1.4]">
                    {col.cell ? col.cell(item) : (item[col.accessorKey as keyof T] as any)}
                  </td>
                ))}
                <td className="px-6 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-[#86868B] hover:text-[#0071E3] hover:bg-[#0071E3]/10 rounded-md transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-[#86868B] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-md transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-[#86868B] text-[13px] italic">
                  No records stored yet...
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-[#D2D2D7]/20 flex items-center justify-between bg-[#FBFBFD]/50">
            <span className="text-[12px] text-[#86868B]">
              Page <span className="font-bold text-[#1D1D1F]">{currentPage}</span> of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 text-[#86868B] hover:text-[#1D1D1F] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 text-[#86868B] hover:text-[#1D1D1F] disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
