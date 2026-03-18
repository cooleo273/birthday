export type SurpriseType = 'letter' | 'photo' | 'video' | 'voice' | 'game' | 'story' | 'compliment' | 'question';

export interface DailySurprise {
    id: string;
    day_number: number;
    type: SurpriseType;
    title: string;
    content: string | null;
    media_url: string | null;
    created_at: string;
}

export interface Memory {
    id: string;
    title: string;
    story: string | null;
    image_url: string | null;
    date: string | null;
    created_at: string;
}

export interface TimelineEvent {
    id: string;
    event_date: string;
    title: string;
    description: string | null;
    icon_name: string | null;
    created_at: string;
}

export interface Reason {
    id: string;
    reason_text: string;
    unlock_day: number;
    created_at: string;
}

export interface Compliment {
    id: string;
    compliment_text: string;
    created_at: string;
}

export interface JournalEntry {
    id: string;
    text: string;
    created_at: string;
}

export interface FutureMessage {
    id: string;
    message: string;
    created_at: string;
    unlocked: boolean;
}

export interface MemoryLocation {
    id: string;
    title: string;
    description: string | null;
    latitude: number;
    longitude: number;
    image_url: string | null;
    created_at: string;
}

export interface BirthdayEvent {
    id: string;
    event_time: string;
    activity: string;
    location: string | null;
    note: string | null;
    order_index: number;
    created_at: string;
}
