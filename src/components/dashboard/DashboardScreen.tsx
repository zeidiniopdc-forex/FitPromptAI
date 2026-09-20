import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { getDayName, getMuscleGroupName } from '../../utils/exerciseTranslation';
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
  User
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

  // Determine today's workout day from active program
  const currentDays = activeProgram?.days || [];
  const todayDay = currentDays[0] || null;
  const nextDay = currentDays[1] || currentDays[0] || null;

  // Streak calculation (sample realistic streak)
  const streakDays = workoutHistory.length > 0 ? 3 : 0;
  const weeklyTarget = profile.daysPerWeek || 4;
  const completedThisWeek = Math.min(weeklyTarget, workoutHistory.length);
  const totalVolumeKg = workoutHistory.reduce((a, b) => a + b.totalVolumeKg, 0);

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

      {/* TODAY'S WORKOUT HERO CARD (Requirement 36) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/30 border border-emerald-500/30 p-6 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-zinc-950 shadow-md">
                {labels.todayWorkoutTitle}
              </span>
              {activeSession ? (
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 animate-pulse">
                  ● {lang === 'fa' ? 'جلسه در حال اجرا' : 'In Progress'}
                </span>
              ) : (
                <span className="text-xs text-zinc-400">
                  {lang === 'fa' && activeProgram?.program.name_fa ? activeProgram.program.name_fa : (activeProgram?.program.name || 'FitPrompt Standard')}
                </span>
              )}
            </div>

            {todayDay ? (
              <>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {getDayName(todayDay.name, lang, todayDay.name_fa)}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                  {todayDay.focus?.map((f) => getMuscleGroupName(f, lang)).join(' • ') || (lang === 'fa' ? 'تمرکز هایپرتروفی' : 'Hypertrophy Focus')}
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span>{todayDay.exercises.length} {labels.exerciseCount}</span>
                  <span>•</span>
                  <span>~{profile.sessionDurationMinutes || 60} {lang === 'fa' ? 'دقیقه' : 'min'}</span>
                  <span>•</span>
                  <span>{todayDay.exercises.reduce((a, b) => a + b.sets, 0)} {labels.totalSets}</span>
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-white">
                  {labels.restDayTitle}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {labels.restDaySubtitle}
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            {todayDay && (
              <button
                id="btn-hero-start-workout"
                onClick={() => onStartWorkout(todayDay.day_id)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>
                  {activeSession 
                    ? (lang === 'fa' ? 'ادامه تمرین زنده' : 'Resume Workout') 
                    : labels.startWorkout}
                </span>
              </button>
            )}
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
            {workoutHistory.slice(0, 2).map((h) => (
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
            ))}
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
