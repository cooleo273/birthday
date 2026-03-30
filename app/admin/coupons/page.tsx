'use client';

import { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { CouponWithRedemption } from '@/types/database';
import { getCouponsWithRedemptions, resetCouponRedemption } from '@/lib/actions';

const columns = [
  {
    header: 'Title',
    accessorKey: 'title',
    cell: (item: any) => <span className="font-bold text-[#1D1D1F]">{item.title}</span>,
  },
  { header: 'Status', accessorKey: 'status' },
  {
    header: 'Used At',
    accessorKey: 'usedAt',
    cell: (item: any) =>
      item.usedAt ? (
        <span className="font-mono text-[12px] text-[#1D1D1F]/70">
          {new Date(item.usedAt).toLocaleString()}
        </span>
      ) : (
        <span className="text-[#86868B]">—</span>
      ),
  },
  {
    header: 'Note',
    accessorKey: 'note',
    cell: (item: any) =>
      item.note ? <span className="text-[#1D1D1F]/80">{item.note}</span> : <span className="text-[#86868B]">—</span>,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponWithRedemption[]>([]);

  async function load() {
    const data = await getCouponsWithRedemptions();
    setCoupons(data);
  }

  useEffect(() => {
    load();
  }, []);

  const data = useMemo(() => {
    return coupons.map((c) => ({
      ...c,
      status: c.redemption ? 'Used' : 'Available',
      usedAt: c.redemption?.redeemed_at ?? '',
      note: c.redemption?.note ?? '',
    })) as any[];
  }, [coupons]);

  const handleDelete = async (item: any) => {
    if (!confirm(`Reset redemption for "${item.title}"?`)) return;
    await resetCouponRedemption(item.id);
    await load();
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Coupons"
        data={data}
        columns={columns}
        onDelete={handleDelete}
        searchPlaceholder="Find coupon..."
      />
      <div className="text-[12px] text-[#86868B]">
        Tip: “Delete” here does not delete the coupon — it only clears the redemption so it becomes available again.
      </div>
    </div>
  );
}

