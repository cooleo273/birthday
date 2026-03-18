export const START_DATE = "2026-03-09T00:00:00";
export const BIRTHDAY_DATE = "2026-05-19T00:00:00";
export const TOTAL_DAYS = 72; // March 9 to May 19

export function getCurrentDay(): number {
    const start = +new Date(START_DATE);
    const now = +new Date();
    const diff = now - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(days, 1), TOTAL_DAYS);
}

export function isDayUnlocked(dayNumber: number): boolean {
    return dayNumber <= getCurrentDay();
}
