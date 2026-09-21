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
 * Normalizes day strings in Persian, English, or abbreviations to standard WeekdayId
 */
export function normalizeDayString(raw?: string): WeekdayId | null {
  if (!raw) return null;
  const clean = raw.toLowerCase().trim().replace(/[\u200c\s-]+/g, '');

  if (clean.includes('sat') || clean.includes('شنبه') && !clean.includes('یک') && !clean.includes('دو') && !clean.includes('سه') && !clean.includes('چهار') && !clean.includes('پنج')) {
    return 'saturday';
  }
  if (clean.includes('sun') || clean.includes('یکشنبه')) {
    return 'sunday';
  }
  if (clean.includes('mon') || clean.includes('دوشنبه')) {
    return 'monday';
  }
  if (clean.includes('tue') || clean.includes('سهشنبه')) {
    return 'tuesday';
  }
  if (clean.includes('wed') || clean.includes('چهارشنبه')) {
    return 'wednesday';
  }
  if (clean.includes('thu') || clean.includes('پنجشنبه')) {
    return 'thursday';
  }
  if (clean.includes('fri') || clean.includes('جمعه')) {
    return 'friday';
  }
  return null;
}

/**
 * Returns current day of week info based on current time
 */
export function getCurrentDayOfWeek(date: Date = new Date()): DayOfWeekInfo {
  const jsDay = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const found = WEEKDAYS_PERSIAN_ORDER.find((d) => d.jsDay === jsDay);
  return found || WEEKDAYS_PERSIAN_ORDER[0];
}

export interface DayScheduleStatus<T> {
  dayInfo: DayOfWeekInfo;
  assignedWorkout: T | null;
  isToday: boolean;
  isRestDay: boolean;
}

export interface WorkoutDayMatchResult<T> {
  todayDay: T | null;
  isExplicitMatch: boolean;
  isRestDay: boolean;
  nextDay: T | null;
  nextDayInfo?: DayOfWeekInfo;
  currentDayInfo: DayOfWeekInfo;
  weekSchedule: DayScheduleStatus<T>[];
}

/**
 * Matches a program day with current day of week with strict scientific adherence:
 * - Detects explicit day matches (Persian & English)
 * - Adheres to trainee's preferred training days (e.g. Saturday, Monday, Wednesday, Thursday)
 * - Accurately identifies Rest Days instead of assigning wrong workouts
 * - Generates full 7-day schedule status
 */
export function matchWorkoutDayForDate<T extends { 
  day_id: string; 
  name: string; 
  name_fa?: string; 
  weekday?: string; 
}>(days: T[], preferredDays?: string[], date: Date = new Date()): WorkoutDayMatchResult<T> {
  const currentDayInfo = getCurrentDayOfWeek(date);

  if (!days || days.length === 0) {
    return {
      todayDay: null,
      isExplicitMatch: false,
      isRestDay: true,
      nextDay: null,
      currentDayInfo,
      weekSchedule: WEEKDAYS_PERSIAN_ORDER.map((d) => ({
        dayInfo: d,
        assignedWorkout: null,
        isToday: d.id === currentDayInfo.id,
        isRestDay: true
      }))
    };
  }

  // Build a mapped 7-day schedule
  // Strategy:
  // 1. Direct program weekday matches take priority
  // 2. PreferredDays mapping maps unassigned program days to user's preferred days
  const scheduleMap = new Map<WeekdayId, T>();

  // Check which days have explicit weekday tags
  days.forEach((day) => {
    const norm = normalizeDayString(day.weekday);
    if (norm && !scheduleMap.has(norm)) {
      scheduleMap.set(norm, day);
    }
  });

  // If some or all days don't have explicit weekdays, or trainee has custom preferredDays:
  const normalizedPreferredDays: WeekdayId[] = (preferredDays || [])
    .map((pd) => normalizeDayString(pd))
    .filter((id): id is WeekdayId => id !== null);

  if (normalizedPreferredDays.length > 0) {
    // Map program days sequentially to user's preferred days if not already explicitly mapped
    normalizedPreferredDays.forEach((weekdayId, idx) => {
      if (!scheduleMap.has(weekdayId) && days[idx]) {
        scheduleMap.set(weekdayId, days[idx]);
      }
    });
  }

  // If still empty (e.g. program has no weekdays and preferredDays is empty), assign by order starting Saturday
  if (scheduleMap.size === 0) {
    days.forEach((day, idx) => {
      if (idx < WEEKDAYS_PERSIAN_ORDER.length) {
        scheduleMap.set(WEEKDAYS_PERSIAN_ORDER[idx].id, day);
      }
    });
  }

  // Construct complete 7-day schedule
  const weekSchedule: DayScheduleStatus<T>[] = WEEKDAYS_PERSIAN_ORDER.map((dayInfo) => {
    const assigned = scheduleMap.get(dayInfo.id) || null;
    return {
      dayInfo,
      assignedWorkout: assigned,
      isToday: dayInfo.id === currentDayInfo.id,
      isRestDay: assigned === null
    };
  });

  // Determine today's workout
  const todayWorkout = scheduleMap.get(currentDayInfo.id) || null;
  const isRestDay = todayWorkout === null;

  // Find next upcoming workout in sequence starting from tomorrow
  let nextDay: T | null = null;
  let nextDayInfo: DayOfWeekInfo | undefined = undefined;

  for (let offset = 1; offset <= 7; offset++) {
    const nextIdx = (currentDayInfo.index + offset) % 7;
    const targetDayInfo = WEEKDAYS_PERSIAN_ORDER[nextIdx];
    const cand = scheduleMap.get(targetDayInfo.id);
    if (cand) {
      nextDay = cand;
      nextDayInfo = targetDayInfo;
      break;
    }
  }

  if (!nextDay) {
    nextDay = days[0] || null;
  }

  return {
    todayDay: todayWorkout,
    isExplicitMatch: todayWorkout !== null,
    isRestDay,
    nextDay,
    nextDayInfo,
    currentDayInfo,
    weekSchedule
  };
}
