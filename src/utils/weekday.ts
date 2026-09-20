export type WeekdayId = 
  | 'saturday' 
  | 'sunday' 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday';

export interface DayOfWeekInfo {
  id: WeekdayId;
  index: number; // 0 for Saturday, 6 for Friday in Iranian/Solar calendar
  jsDay: number; // 0 for Sunday in JS getDay()
  nameFa: string;
  nameEn: string;
  shortFa: string;
  shortEn: string;
}

export const WEEKDAYS_PERSIAN_ORDER: DayOfWeekInfo[] = [
  { id: 'saturday', index: 0, jsDay: 6, nameFa: 'شنبه', nameEn: 'Saturday', shortFa: 'ش', shortEn: 'Sat' },
  { id: 'sunday', index: 1, jsDay: 0, nameFa: 'یک‌شنبه', nameEn: 'Sunday', shortFa: 'ی', shortEn: 'Sun' },
  { id: 'monday', index: 2, jsDay: 1, nameFa: 'دوشنبه', nameEn: 'Monday', shortFa: 'د', shortEn: 'Mon' },
  { id: 'tuesday', index: 3, jsDay: 2, nameFa: 'سه‌شنبه', nameEn: 'Tuesday', shortFa: 'س', shortEn: 'Tue' },
  { id: 'wednesday', index: 4, jsDay: 3, nameFa: 'چهارشنبه', nameEn: 'Wednesday', shortFa: 'چ', shortEn: 'Wed' },
  { id: 'thursday', index: 5, jsDay: 4, nameFa: 'پنج‌شنبه', nameEn: 'Thursday', shortFa: 'پ', shortEn: 'Thu' },
  { id: 'friday', index: 6, jsDay: 5, nameFa: 'جمعه', nameEn: 'Friday', shortFa: 'ج', shortEn: 'Fri' },
];

/**
 * Returns current day of week info based on current time
 */
export function getCurrentDayOfWeek(date: Date = new Date()): DayOfWeekInfo {
  const jsDay = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const found = WEEKDAYS_PERSIAN_ORDER.find((d) => d.jsDay === jsDay);
  return found || WEEKDAYS_PERSIAN_ORDER[0];
}

/**
 * Matches a program day with current day of week.
 * Looks into day.weekday, day.name, day.name_fa, or position in days list.
 */
export function matchWorkoutDayForDate<T extends { 
  day_id: string; 
  name: string; 
  name_fa?: string; 
  weekday?: string; 
}>(days: T[], preferredDays?: string[], date: Date = new Date()): {
  todayDay: T | null;
  isExplicitMatch: boolean;
  currentDayInfo: DayOfWeekInfo;
} {
  const currentDayInfo = getCurrentDayOfWeek(date);

  if (!days || days.length === 0) {
    return { todayDay: null, isExplicitMatch: false, currentDayInfo };
  }

  // 1. Direct match on day.weekday (e.g. 'Saturday', 'شنبه', 'saturday')
  const weekdayMatch = days.find((d) => {
    if (!d.weekday) return false;
    const w = d.weekday.toLowerCase().trim();
    return (
      w === currentDayInfo.id ||
      w === currentDayInfo.nameEn.toLowerCase() ||
      w === currentDayInfo.shortEn.toLowerCase() ||
      w.includes(currentDayInfo.nameFa) ||
      d.weekday.includes(currentDayInfo.nameFa)
    );
  });

  if (weekdayMatch) {
    return { todayDay: weekdayMatch, isExplicitMatch: true, currentDayInfo };
  }

  // 2. Name search (if day name or name_fa includes the weekday, e.g. "شنبه: بالاتنه A")
  const nameMatch = days.find((d) => {
    const nEn = d.name.toLowerCase();
    const nFa = (d.name_fa || '').toLowerCase();
    return (
      nEn.includes(currentDayInfo.nameEn.toLowerCase()) ||
      nEn.includes(currentDayInfo.id) ||
      nFa.includes(currentDayInfo.nameFa) ||
      d.name.includes(currentDayInfo.nameFa)
    );
  });

  if (nameMatch) {
    return { todayDay: nameMatch, isExplicitMatch: true, currentDayInfo };
  }

  // 3. Trainee preferredDays mapping (e.g. ['Saturday', 'Sunday', 'Tuesday', 'Wednesday'])
  if (preferredDays && preferredDays.length > 0) {
    const currentPrefIndex = preferredDays.findIndex((pd) => {
      const p = pd.toLowerCase().trim();
      return (
        p === currentDayInfo.id ||
        p === currentDayInfo.nameEn.toLowerCase() ||
        p.includes(currentDayInfo.nameFa)
      );
    });

    if (currentPrefIndex !== -1 && days[currentPrefIndex]) {
      return { todayDay: days[currentPrefIndex], isExplicitMatch: true, currentDayInfo };
    }
  }

  // 4. Default: cycle day by Persian week index (day 0 Saturday -> day index 0)
  // or return the day mapped to currentDayInfo.index % days.length
  const fallbackIndex = currentDayInfo.index % days.length;
  return {
    todayDay: days[fallbackIndex] || days[0],
    isExplicitMatch: false,
    currentDayInfo
  };
}
