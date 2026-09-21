import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { getDayName, getMuscleGroupName } from '../../utils/exerciseTranslation';
import { matchWorkoutDayForDate, getCurrentDayOfWeek } from '../../utils/weekday';
import { 
  Play, 
  Flame, 
  Trophy, 
  Layers, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileCode, 
  Dumbbell,
  Star,
  ChevronRight,
  User,
  Moon,
  CalendarDays,
  RotateCcw
} from 'lucide-react';

interface DashboardScreenProps {
  onStartWorkout: (dayId: string) => void;
  onNavigateToPrompt: () => void;
  onNavigateToProgram: () => void;
  onNavigateToProgress: () => void;
  onOpenImport: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartWorkout,
  onNavigateToPrompt,
  onNavigateToProgram,
  onNavigateToProgress,
  onOpenImport
}) => {
  const { profile, activeProgram, workoutHistory, personalRecords, activeSession, settings } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  // Intelligently detect today's day of week & match dedicated workout session
  const currentDays = activeProgram?.days || [];
  const { 
    todayDay, 
    isExplicitMatch, 
    isRestDay, 
    nextDay, 
    nextDayInfo, 
    currentDayInfo, 
    weekSchedule 
  } = matchWorkoutDayForDate(currentDays, profile.preferredDays);

  // Trainee can click any day in the 7-day schedule ribbon to preview or launch that session
  const [selectedDayId, setSelectedDayId] = React.useState<string | null>(null);

  // Active workout to display: either user-selected day, or today's matched workout day
  const displayedDay = selectedDayId 
    ? (currentDays.find((d) => d.day_id === selectedDayId) || todayDay)
    : todayDay;

  const isViewingDifferentDay = Boolean(selectedDayId && (!todayDay || selectedDayId !== todayDay.day_id));

  // Dynamic calculation based strictly on real user data (clean state)
  const streakDays = workoutHistory.length > 0 ? workoutHistory.length : 0;
  const weeklyTarget = profile.daysPerWeek || (activeProgram?.program.days_per_week) || 4;
  const completedThisWeek = Math.min(weeklyTarget, workoutHistory.length);
  const totalVolumeKg = workoutHistory.reduce((a, b) => a + (b.totalVolumeKg || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {labels.greeting}, {profile.name || 'ورزشکار'}
            </h2>
            <span className="text-xl">💪</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {labels.welcomeBackSubtitle}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToPrompt}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'پرامپت هوش مصنوعی' : 'AI Prompt'}</span>
          </button>

          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 transition-all"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{labels.importJson}</span>
          </button>
        </div>
      </div>

      {/* 7-DAY INTERACTIVE WEEKLY SCHEDULE RIBBON */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
            <CalendarDays className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'fa' ? 'تقویم و توزیع هفتگی جلسات شما' : 'Weekly Training Schedule'}</span>
          </div>
          {isViewingDifferentDay && (
            <button
              onClick={() => setSelectedDayId(null)}
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'fa' ? 'بازگشت به امروز' : 'Back to Today'}</span>
            </button>
          )}
        </div>

        {/* 7 Day Pills Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekSchedule.map((slot) => {
            const isToday = slot.isToday;
            const isSelected = selectedDayId === slot.assignedWorkout?.day_id;
            const hasWorkout = Boolean(slot.assignedWorkout);

            return (
              <button
                key={slot.dayInfo.id}
                disabled={!hasWorkout}
                onClick={() => {
                  if (slot.assignedWorkout) {
                    setSelectedDayId(slot.assignedWorkout.day_id);
                  }
                }}
                className={`relative flex flex-col items-center justify-between p-2 rounded-xl text-center transition-all ${
                  isToday 
                    ? 'bg-emerald-500/15 border-2 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : isSelected
                    ? 'bg-teal-500/20 border-2 border-teal-400 text-white ring-2 ring-teal-500/30'
                    : hasWorkout
                    ? 'bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 cursor-pointer'
                    : 'bg-zinc-950/40 border border-zinc-800/40 text-zinc-500 opacity-60 cursor-default'
                }`}
              >
                {/* Today Pin Indicator */}
                {isToday && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500 text-zinc-950 uppercase tracking-tighter shadow">
                    امروز
                  </span>
                )}

                <span className="text-[10px] sm:text-xs font-bold block pt-1">
                  {slot.dayInfo.nameFa}
                </span>

                <span className="text-[9px] text-zinc-400">
                  روز {slot.dayInfo.dayNumber}
                </span>

                <div className="mt-1">
                  {hasWorkout ? (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                      <Dumbbell className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-zinc-800/40 flex items-center justify-center text-zinc-500 mx-auto">
                      <Moon className="w-2.5 h-2.5 opacity-60" />
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-medium truncate w-full mt-1 px-0.5 opacity-90">
                  {hasWorkout
                    ? (slot.assignedWorkout?.name_fa || slot.assignedWorkout?.name)
                    : 'استراحت'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TODAY'S / SELECTED WORKOUT HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/30 border border-emerald-500/30 p-6 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-zinc-950 shadow-md flex items-center gap-1">
                <Calendar className="w-3 h-3 inline-block" />
                <span>{currentDayInfo.nameFa} (روز {currentDayInfo.dayNumber} هفته)</span>
                <span className="opacity-75 font-normal">
                  • {isViewingDifferentDay ? 'جلسه انتخابی' : 'جلسه امروز'}
                </span>
              </span>

              {isExplicitMatch && !isViewingDifferentDay && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  جلسه اختصاصی امروز در تقویم ایران
                </span>
              )}

              {isViewingDifferentDay && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  پیش‌نمایش جلسه دیگر
                </span>
              )}

              {activeSession ? (
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 animate-pulse">
                  ● تمرین زنده در حال اجرا
                </span>
              ) : (
                <span className="text-xs text-zinc-400">
                  {activeProgram?.program.name_fa || activeProgram?.program.name || 'برنامه پیش‌فرض فیت‌پارسی'}
                </span>
              )}
            </div>

            {displayedDay ? (
              <>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {displayedDay.name_fa || displayedDay.name}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                  {displayedDay.focus?.map((f) => getMuscleGroupName(f, 'fa')).join(' • ') || 'تمرکز هایپرتروفی'}
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span>{displayedDay.exercises.length} حرکت تمرینی</span>
                  <span>•</span>
                  <span>~{profile.sessionDurationMinutes || 60} دقیقه</span>
                  <span>•</span>
                  <span>{displayedDay.exercises.reduce((a, b) => a + b.sets, 0)} ست کاری کل</span>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Moon className="w-5 h-5" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    امروز روز استراحت است
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 max-w-md">
                  امروز در برنامه شما روز استراحت و بازسازی عضلانی است. ریکاوری و تغذیه مناسب برای رشد بهینه عضلات ضروری است.
                </p>
                {nextDay && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
                    <span className="text-emerald-400 font-bold">جلسه بعدی:</span>
                    <span>{nextDay.name_fa || nextDay.name}</span>
                    {nextDayInfo && <span className="text-zinc-400">({nextDayInfo.nameFa} - روز {nextDayInfo.dayNumber})</span>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {displayedDay ? (
              <button
                id="btn-hero-start-workout"
                onClick={() => onStartWorkout(displayedDay.day_id)}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>
                  {activeSession 
                    ? 'ادامه تمرین زنده' 
                    : isViewingDifferentDay
                    ? 'شروع این جلسه'
                    : 'شروع تمرین امروز'}
                </span>
              </button>
            ) : nextDay ? (
              <button
                id="btn-hero-start-next-workout"
                onClick={() => onStartWorkout(nextDay.day_id)}
                className="px-6 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-emerald-500/30 text-emerald-300 font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>شروع جلسه بعدی پیش از موعد</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 4 KEY KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Weekly Completion Goal */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400">
              {labels.weeklyGoalProgress}
            </span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{completedThisWeek}</span>
              <span className="text-xs text-zinc-500">/ {weeklyTarget}</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all"
                style={{ width: `${(completedThisWeek / weeklyTarget) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Volume Moved */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400">
              {labels.totalVolume}
            </span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              {totalVolumeKg.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-sans">
              {labels.kgUnit} ({lang === 'fa' ? 'کل جلسات' : 'all-time'})
            </span>
          </div>
        </div>

        {/* Workout Streak */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400">
              {labels.streak}
            </span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              {streakDays}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">
              {lang === 'fa' ? 'روز پیوسته تمرین' : 'Days Streak'}
            </span>
          </div>
        </div>

        {/* New PRs */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400">
              {labels.newPrsRecorded}
            </span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              {personalRecords.length}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">
              {lang === 'fa' ? 'رکورد وزنه ثبت‌شده' : 'Active PRs'}
            </span>
          </div>
        </div>
      </div>

      {/* Next Upcoming Workout & Recent Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Workout Card */}
        {nextDay && (
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span className="font-semibold text-zinc-300">{labels.nextWorkoutPreview}</span>
                <Dumbbell className="w-4 h-4 text-zinc-500" />
              </div>
              <h4 className="text-base font-black text-white mt-1">
                {getDayName(nextDay.name, lang, nextDay.name_fa)}
              </h4>
              <p className="text-xs text-emerald-400 mt-0.5">
                {nextDay.focus?.map((f) => getMuscleGroupName(f, lang)).join('، ')}
              </p>
              <p className="text-[11px] text-zinc-400 mt-2">
                {nextDay.exercises.length} {labels.exerciseCount} • {nextDay.exercises.reduce((a, b) => a + b.sets, 0)} {labels.totalSets}
              </p>
            </div>

            <button
              onClick={() => onStartWorkout(nextDay.day_id)}
              className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>{lang === 'fa' ? 'مشاهده و اجرای این جلسه' : 'View & Execute'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Recent Workouts Card */}
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-300">
              {labels.recentWorkoutsTitle}
            </h4>
            <button
              onClick={onNavigateToProgress}
              className="text-[11px] text-emerald-400 hover:underline"
            >
              {labels.viewAll}
            </button>
          </div>

          <div className="space-y-2">
            {workoutHistory.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs">
                <Dumbbell className="w-6 h-6 mx-auto mb-2 text-zinc-600 opacity-60" />
                <p>{lang === 'fa' ? 'هنوز جلسه‌ای ثبت نشده است' : 'No workout recorded yet'}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">
                  {lang === 'fa' ? 'با شروع اولین تمرین، آمار و پیشرفت شما اینجا ثبت می‌شود' : 'Start your first workout to track analytics'}
                </p>
              </div>
            ) : (
              workoutHistory.slice(0, 2).map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block line-clamp-1">{getDayName(h.dayName, lang)}</span>
                    <span className="text-[10px] text-zinc-500">
                      {h.totalVolumeKg.toLocaleString()} {labels.kgUnit} • {h.totalSets} {lang === 'fa' ? 'ست' : 'sets'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">{h.startTime.split('T')[0]}</span>
                    <span className="text-emerald-400 font-bold text-[10px]">
                      ★ {h.rating || 5}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={onNavigateToProgress}
            className="w-full py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
          >
            {labels.viewAnalyticsButton}
          </button>
        </div>
      </div>
    </div>
  );
};
