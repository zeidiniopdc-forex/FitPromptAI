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
  dayNumber: number; // 1 (شنبه) to 7 (جمعه)
  jsDay: number; // 0 for Sunday in JS getDay()
  nameFa: string;
  nameEn: string;
  shortFa: string;
  shortEn: string;
}

export const WEEKDAYS_PERSIAN_ORDER: DayOfWeekInfo[] = [
  { id: 'saturday', index: 0, dayNumber: 1, jsDay: 6, nameFa: 'شنبه', nameEn: 'Saturday', shortFa: 'ش', shortEn: 'Sat' },
  { id: 'sunday', index: 1, dayNumber: 2, jsDay: 0, nameFa: 'یک‌شنبه', nameEn: 'Sunday', shortFa: 'ی', shortEn: 'Sun' },
  { id: 'monday', index: 2, dayNumber: 3, jsDay: 1, nameFa: 'دوشنبه', nameEn: 'Monday', shortFa: 'د', shortEn: 'Mon' },
  { id: 'tuesday', index: 3, dayNumber: 4, jsDay: 2, nameFa: 'سه‌شنبه', nameEn: 'Tuesday', shortFa: 'س', shortEn: 'Tue' },
  { id: 'wednesday', index: 4, dayNumber: 5, jsDay: 3, nameFa: 'چهارشنبه', nameEn: 'Wednesday', shortFa: 'چ', shortEn: 'Wed' },
  { id: 'thursday', index: 5, dayNumber: 6, jsDay: 4, nameFa: 'پنج‌شنبه', nameEn: 'Thursday', shortFa: 'پ', shortEn: 'Thu' },
  { id: 'friday', index: 6, dayNumber: 7, jsDay: 5, nameFa: 'جمعه', nameEn: 'Friday', shortFa: 'ج', shortEn: 'Fri' },
];

/**
 * Normalizes day strings in Persian, English, day numbers, or session indices to standard WeekdayId
 * Strictly follows Iranian calendar:
 * Day 1 / اول هفته = شنبه (Saturday)
 * Day 2 = یک‌شنبه (Sunday)
 * Day 3 = دوشنبه (Monday)
 * Day 4 = سه‌شنبه (Tuesday)
 * Day 5 = چهارشنبه (Wednesday)
 * Day 6 = پنج‌شنبه (Thursday)
 * Day 7 = جمعه (Friday)
 */
export function normalizeDayString(raw?: string): WeekdayId | null {
  if (!raw) return null;
  const clean = raw.toLowerCase().trim().replace(/[\u200c\s-_]+/g, '');

  // Specific Day 7 / Friday / جمعه
  if (clean.includes('جمعه') || clean.includes('fri') || clean.includes('آدینه') || clean.includes('روزهفتم') || clean.includes('روز7') || clean.includes('روز۷') || clean.includes('جلسههفتم') || clean.includes('جلسه7') || clean.includes('جلسه۷') || clean.includes('day7')) {
    return 'friday';
  }

  // Specific Day 6 / Thursday / پنج‌شنبه
  if (clean.includes('پنجشنبه') || clean.includes('پنج') || clean.includes('thu') || clean.includes('روزششم') || clean.includes('روز6') || clean.includes('روز۶') || clean.includes('جلسهششم') || clean.includes('جلسه6') || clean.includes('جلسه۶') || clean.includes('day6') || clean.includes('legs_b') || clean.includes('legsb')) {
    return 'thursday';
  }

  // Specific Day 5 / Wednesday / چهارشنبه
  if (clean.includes('چهارشنبه') || clean.includes('چهار') || clean.includes('wed') || clean.includes('روزپنجم') || clean.includes('روز5') || clean.includes('روز۵') || clean.includes('جلسهپنجم') || clean.includes('جلسه5') || clean.includes('جلسه۵') || clean.includes('day5') || clean.includes('pull_b') || clean.includes('pullb')) {
    return 'wednesday';
  }

  // Specific Day 4 / Tuesday / سه‌شنبه
  if (clean.includes('سهشنبه') || (clean.includes('سه') && !clean.includes('شنبه')) || clean.includes('tue') || clean.includes('روزچهارم') || clean.includes('روز4') || clean.includes('روز۴') || clean.includes('جلسهچهارم') || clean.includes('جلسه4') || clean.includes('جلسه۴') || clean.includes('day4') || clean.includes('push_b') || clean.includes('pushb')) {
    return 'tuesday';
  }

  // Specific Day 3 / Monday / دوشنبه
  if (clean.includes('دوشنبه') || clean.includes('mon') || clean.includes('روزسوم') || clean.includes('روز3') || clean.includes('روز۳') || clean.includes('جلسهسوم') || clean.includes('جلسه3') || clean.includes('جلسه۳') || clean.includes('day3') || clean.includes('legs_a') || clean.includes('legsa')) {
    return 'monday';
  }

  // Specific Day 2 / Sunday / یک‌شنبه
  if (clean.includes('یکشنبه') || clean.includes('sun') || clean.includes('روزدوم') || clean.includes('روز2') || clean.includes('روز۲') || clean.includes('جلسهدوم') || clean.includes('جلسه2') || clean.includes('جلسه۲') || clean.includes('day2') || clean.includes('pull_a') || clean.includes('pulla')) {
    return 'sunday';
  }

  // Specific Day 1 / Saturday / شنبه
  if (clean.includes('sat') || clean.includes('شنبه') || clean.includes('روزاول') || clean.includes('روز1') || clean.includes('روز۱') || clean.includes('جلسهاول') || clean.includes('جلسه1') || clean.includes('جلسه۱') || clean.includes('day1') || clean.includes('push_a') || clean.includes('pusha')) {
    return 'saturday';
  }

  return null;
}

/**
 * Returns current day of week info based on current time in Iranian calendar
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
 * Matches a program day with current day of week with strict Iranian calendar adherence:
 * - Week starts strictly on Saturday (شنبه = روز ۱)
 * - Monday is Day 3 (دوشنبه = روز ۳)
 * - In a 6-day program:
 *    Day 1 = شنبه
 *    Day 2 = یک‌شنبه
 *    Day 3 = دوشنبه (امروز!)
 *    Day 4 = سه‌شنبه
 *    Day 5 = چهارشنبه (پول B)
 *    Day 6 = پنج‌شنبه
 *    جمعه = استراحت و ریکاوری
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

  const scheduleMap = new Map<WeekdayId, T>();

  // Special handling for 6-day programs:
  // In Iranian training culture, 6-day programs run Saturday through Thursday, with Friday as Rest.
  if (days.length === 6) {
    const iranian6DayWeekdays: WeekdayId[] = [
      'saturday',  // شنبه - روز اول
      'sunday',    // یک‌شنبه - روز دوم
      'monday',    // دوشنبه - روز سوم (امروز!)
      'tuesday',   // سه‌شنبه - روز چهارم
      'wednesday', // چهارشنبه - روز پنجم (پول B)
      'thursday'   // پنج‌شنبه - روز ششم
    ];

    // Check if days already have explicit weekday assignments
    days.forEach((day, idx) => {
      const explicitNorm = normalizeDayString(day.weekday) || normalizeDayString(day.day_id) || normalizeDayString(day.name);
      if (explicitNorm) {
        scheduleMap.set(explicitNorm, day);
      } else if (idx < iranian6DayWeekdays.length) {
        // Map sequential day to Iranian weekday
        scheduleMap.set(iranian6DayWeekdays[idx], day);
      }
    });

    // Fill any missing days among the 6 working days
    iranian6DayWeekdays.forEach((weekdayId, idx) => {
      if (!scheduleMap.has(weekdayId) && days[idx]) {
        scheduleMap.set(weekdayId, days[idx]);
      }
    });
  } else {
    // 1. Direct explicit day matches (Persian names, weekday tags, or day IDs)
    days.forEach((day) => {
      const norm = normalizeDayString(day.weekday) || normalizeDayString(day.day_id) || normalizeDayString(day.name);
      if (norm && !scheduleMap.has(norm)) {
        scheduleMap.set(norm, day);
      }
    });

    // 2. User's preferred days (normalized to Iranian weekdays)
    const normalizedPreferredDays: WeekdayId[] = (preferredDays || [])
      .map((pd) => normalizeDayString(pd))
      .filter((id): id is WeekdayId => id !== null);

    if (normalizedPreferredDays.length > 0) {
      normalizedPreferredDays.forEach((weekdayId, idx) => {
        if (!scheduleMap.has(weekdayId) && days[idx]) {
          scheduleMap.set(weekdayId, days[idx]);
        }
      });
    }

    // 3. Sequential fallback starting Saturday (شنبه)
    if (scheduleMap.size === 0) {
      days.forEach((day, idx) => {
        if (idx < WEEKDAYS_PERSIAN_ORDER.length) {
          scheduleMap.set(WEEKDAYS_PERSIAN_ORDER[idx].id, day);
        }
      });
    }
  }

  // Construct complete 7-day schedule (Saturday to Friday)
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
