'use server';

import { supabase } from '@/lib/supabase';
import { DailySurprise, Memory, TimelineEvent, Reason, Compliment, JournalEntry, FutureMessage, MemoryLocation, BirthdayEvent, CouponWithRedemption, Coupon } from '@/types/database';
import { revalidatePath } from 'next/cache';

// --- Daily Surprises ---

export async function getDailySurprises(): Promise<DailySurprise[]> {
    const { data, error } = await supabase
        .from('daily_surprises')
        .select('*')
        .order('day_number', { ascending: true });

    if (error) return [];
    return data;
}

export async function getDailySurprise(dayNumber: number): Promise<DailySurprise | null> {
    const { data, error } = await supabase
        .from('daily_surprises')
        .select('*')
        .eq('day_number', dayNumber)
        .single();

    if (error) return null;
    return data;
}

export async function upsertDailySurprise(surprise: Partial<DailySurprise>) {
    const { data, error } = await supabase
        .from('daily_surprises')
        .upsert(surprise)
        .select()
        .single();

    if (error) throw new Error(error.message);
    revalidatePath('/admin/daily-surprises');
    revalidatePath('/calendar');
    revalidatePath('/day/[dayNumber]', 'page');
    revalidatePath('/');
    return data;
}

export async function deleteDailySurprise(id: string) {
    const { error } = await supabase
        .from('daily_surprises')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/daily-surprises');
    revalidatePath('/calendar');
}

// --- Memories ---

export async function getMemories(): Promise<Memory[]> {
    const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('date', { ascending: false });

    if (error) return [];
    return data;
}

export async function upsertMemory(memory: Partial<Memory>) {
    const { data, error } = await supabase
        .from('memories')
        .upsert(memory)
        .select()
        .single();

    if (error) throw new Error(error.message);
    revalidatePath('/admin/memories');
    revalidatePath('/gallery');
    return data;
}

export async function deleteMemory(id: string) {
    const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/memories');
    revalidatePath('/gallery');
}

// --- Timeline ---

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
    const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('event_date', { ascending: true });

    if (error) return [];
    return data;
}

export async function upsertTimelineEvent(event: Partial<TimelineEvent>) {
    const { data, error } = await supabase
        .from('timeline_events')
        .upsert(event)
        .select()
        .single();

    if (error) throw new Error(error.message);
    revalidatePath('/admin/timeline-events');
    revalidatePath('/timeline');
    return data;
}

export async function deleteTimelineEvent(id: string) {
    const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/timeline-events');
}

// --- Reasons ---

export async function getAllReasons(): Promise<Reason[]> {
    const { data, error } = await supabase
        .from('reasons')
        .select('*')
        .order('unlock_day', { ascending: true });

    if (error) return [];
    return data;
}

export async function getReasons(currentDay: number): Promise<Reason[]> {
    const { data, error } = await supabase
        .from('reasons')
        .select('*')
        .lte('unlock_day', currentDay)
        .order('unlock_day', { ascending: true });

    if (error) return [];
    return data;
}

export async function upsertReason(reason: Partial<Reason>) {
    const { data, error } = await supabase
        .from('reasons')
        .upsert(reason)
        .select()
        .single();

    if (error) throw new Error(error.message);
    revalidatePath('/admin/reasons');
    revalidatePath('/reasons');
    return data;
}

export async function deleteReason(id: string) {
    const { error } = await supabase
        .from('reasons')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/reasons');
}

// --- Compliments ---

export async function getCompliments(): Promise<Compliment[]> {
    const { data, error } = await supabase
        .from('compliments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return [];
    return data;
}

export async function getRandomCompliment(): Promise<Compliment | null> {
    const { data, error } = await supabase
        .from('compliments')
        .select('*');

    if (error || !data || data.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

export async function upsertCompliment(compliment: Partial<Compliment>) {
    const { data, error } = await supabase
        .from('compliments')
        .upsert(compliment)
        .select()
        .single();

    if (error) throw new Error(error.message);
    revalidatePath('/admin/compliments');
    return data;
}

export async function deleteCompliment(id: string) {
    const { error } = await supabase
        .from('compliments')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/compliments');
}

// --- Journal ---

export async function saveJournalEntry(text: string) {
    const { error } = await supabase
        .from('journal_entries')
        .insert([{ text }]);

    if (error) throw new Error('Failed to save journal entry');
    revalidatePath('/journal');
    revalidatePath('/admin/journal');
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
    const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return [];
    return data;
}

export async function deleteJournalEntry(id: string) {
    const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/journal');
}

// --- Coupons ---

export async function getCouponsWithRedemptions(): Promise<CouponWithRedemption[]> {
    const { data, error } = await supabase
        .from('coupons')
        .select('*, coupon_redemptions(id, coupon_id, redeemed_at, note)')
        .order('created_at', { ascending: true });

    if (error || !data) return [];

    return data.map((row: any) => {
        const redemption = Array.isArray(row.coupon_redemptions) ? row.coupon_redemptions[0] : null;
        const { coupon_redemptions, ...coupon } = row;
        return {
            ...(coupon as Coupon),
            redemption: redemption ?? null,
        } satisfies CouponWithRedemption;
    });
}

export async function redeemCoupon(couponId: string, note?: string) {
    const { data, error } = await supabase
        .from('coupon_redemptions')
        .insert([{ coupon_id: couponId, note: note ?? null }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    revalidatePath('/coupons');
    revalidatePath('/admin/coupons');
    return data;
}

export async function resetCouponRedemption(couponId: string) {
    const { error } = await supabase
        .from('coupon_redemptions')
        .delete()
        .eq('coupon_id', couponId);

    if (error) throw new Error(error.message);
    revalidatePath('/coupons');
    revalidatePath('/admin/coupons');
}

export async function saveFutureMessage(text: string) {
    const { error } = await supabase
        .from('future_messages')
        .insert([{ text }]);

    if (error) throw new Error('Failed to save future message');
    revalidatePath('/journal');
}

export async function getFutureMessages(): Promise<FutureMessage[]> {
    const { data, error } = await supabase
        .from('future_messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return [];
    return data;
}

// --- Memory Map Locations ---

export async function getMemoryLocations(): Promise<MemoryLocation[]> {
    const { data, error } = await supabase
        .from('memory_locations')
        .select('*');

    if (error) return [];
    return data;
}

export async function upsertMemoryLocation(location: Partial<MemoryLocation>) {
    const { data, error } = await supabase
        .from('memory_locations')
        .upsert(location)
        .select()
        .single();

    if (error) throw new Error(error.message);
    revalidatePath('/admin/memory-locations');
    revalidatePath('/map');
    return data;
}

export async function deleteMemoryLocation(id: string) {
    const { error } = await supabase
        .from('memory_locations')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/memory-locations');
    revalidatePath('/map');
}

// --- Images / Media ---

export async function uploadMedia(file: File, bucket: string = 'media') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}

// --- Birthday Program ---

export async function getBirthdayEvents(): Promise<BirthdayEvent[]> {
    const { data, error } = await supabase
        .from('birthday_program')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) return [];
    return data;
}

export async function upsertBirthdayEvent(event: Partial<BirthdayEvent>) {
    const { data, error } = await supabase
        .from('birthday_program')
        .upsert(event)
        .select()
        .single();

    if (error) throw new Error(error.message);
    revalidatePath('/admin/birthday-program');
    revalidatePath('/day/62'); // Celeb Day
    return data;
}

export async function deleteBirthdayEvent(id: string) {
    const { error } = await supabase
        .from('birthday_program')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/birthday-program');
    revalidatePath('/day/62');
}
