/**
 * Ethiopian Orthodox Fasika and Eastern Orthodox Pascha use the Julian-calendar
 * computus; the celebration date is usually observed on the **Gregorian civil
 * calendar** (e.g. April 12, 2026 — not Western Easter on April 5, 2026).
 *
 * Algorithm: Julian Easter Sunday, then +13 days to Gregorian (valid for 1900–2099).
 * @see https://ru.wikipedia.org/wiki/Пасха#Расчёт_даты_Пасхи (same approach as SynCap gist)
 */

export function getEthiopianOrthodoxEasterGregorian(year: number): Date {
    const a = (19 * (year % 19) + 15) % 30;
    const b = (2 * (year % 4) + 4 * (year % 7) + 6 * a + 6) % 7;

    const res =
        a + b > 10
            ? new Date(year, 3, a + b - 9)
            : new Date(year, 2, 22 + a + b);

    res.setDate(res.getDate() + 13);
    return res;
}

/**
 * True if `date` (local civil calendar) is Ethiopian Orthodox Easter / Fasika.
 * Matches the Gregorian date on which the feast is celebrated, not Western Easter.
 */
export function isEasterSunday(date: Date): boolean {
    const y = date.getFullYear();
    const easter = getEthiopianOrthodoxEasterGregorian(y);
    return (
        date.getFullYear() === easter.getFullYear() &&
        date.getMonth() === easter.getMonth() &&
        date.getDate() === easter.getDate()
    );
}
