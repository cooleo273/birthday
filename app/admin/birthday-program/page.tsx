'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { getBirthdayEvents, upsertBirthdayEvent, deleteBirthdayEvent } from '@/lib/actions';
import type { BirthdayEvent } from '@/types/database';

export default function BirthdayProgramPage() {
  const [events, setEvents] = useState<BirthdayEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<BirthdayEvent> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await getBirthdayEvents();
    setEvents(data);
  }

  const columns = [
    {
      header: 'Order',
      accessorKey: 'order_index',
      cell: (item: BirthdayEvent) => (
        <span className="font-bold text-[#1D1D1F]">#{item.order_index}</span>
      ),
    },
    {
      header: 'Time',
      accessorKey: 'event_time',
      cell: (item: BirthdayEvent) => (
        <span className="text-[13px] font-medium text-[#1D1D1F]">
          {item.event_time}
        </span>
      ),
    },
    {
      header: 'Activity',
      accessorKey: 'activity',
      cell: (item: BirthdayEvent) => (
        <span className="text-[14px] font-bold text-[#1D1D1F] tracking-tight">
          {item.activity}
        </span>
      ),
    },
    {
      header: 'Location / Notes',
      accessorKey: 'location',
      cell: (item: BirthdayEvent) => (
        <div className="flex flex-col">
          {item.location && (
            <span className="text-[12px] font-semibold text-[#1D1D1F]">
              {item.location}
            </span>
          )}
          {item.note && (
            <span className="text-[11px] text-[#86868B] line-clamp-2 mt-0.5">
              {item.note}
            </span>
          )}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingItem({
      order_index: events.length + 1,
      event_time: '',
      activity: '',
      location: '',
      note: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: BirthdayEvent) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: BirthdayEvent) => {
    if (confirm(`Remove this moment from the program?`)) {
      await deleteBirthdayEvent(item.id);
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await upsertBirthdayEvent(editingItem);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Birthday Program"
        data={events}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Find moment..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Adjust Program Moment' : 'Add Program Moment'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">
                Order
              </label>
              <input
                type="number"
                value={editingItem?.order_index ?? ''}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem!,
                    order_index: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">
                Time
              </label>
              <input
                type="time"
                value={editingItem?.event_time || ''}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem!,
                    event_time: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">
              Activity
            </label>
            <input
              type="text"
              value={editingItem?.activity || ''}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem!,
                  activity: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
              placeholder="Breakfast surprise, walk, movie night..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">
              Location (optional)
            </label>
            <input
              type="text"
              value={editingItem?.location || ''}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem!,
                  location: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px]"
              placeholder="Home, cafe, park..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider ml-1">
              Note (optional)
            </label>
            <textarea
              value={editingItem?.note || ''}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem!,
                  note: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0071E3]/20 text-[14px] h-32 resize-none"
              placeholder="Any sweet details you want to remember..."
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
              {editingItem?.id ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

