import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { getExerciseName, getDayName, getMuscleGroupName } from '../../utils/exerciseTranslation';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Trophy, 
  Flame, 
  Calendar, 
  Layers, 
  Calculator, 
  TrendingUp, 
  Dumbbell, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const ProgressAnalytics: React.FC = () => {
  const { workoutHistory, personalRecords, settings } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  // 1RM Calculator Interactive State (Brzycki Formula)
  const [calcWeight, setCalcWeight] = useState<number>(85);
  const [calcReps, setCalcReps] = useState<number>(8);

  // Brzycki Formula: 1RM = Weight / (1.0278 - 0.0278 * Reps)
  const calculatedOneRepMax = calcReps > 0 && calcWeight > 0
    ? Math.round((calcWeight / (1.0278 - 0.0278 * Math.min(calcReps, 12))) * 10) / 10
    : 0;

  // Prepare volume progression chart data from history
  const volumeData = workoutHistory.slice(0, 10).reverse().map((session, idx) => ({
    name: getDayName(session.dayName.split('(')[0].trim(), lang) || (lang === 'fa' ? `جلسه ${idx + 1}` : `Session ${idx + 1}`),
    volume: session.totalVolumeKg,
    sets: session.totalSets,
    reps: session.totalReps
  }));

  // Muscle distribution data
  const muscleDistribution = [
    { name: lang === 'fa' ? 'سینه' : 'Chest', value: 18, color: '#10b981' },
    { name: lang === 'fa' ? 'پشت و زیربغل' : 'Back', value: 20, color: '#06b6d4' },
    { name: lang === 'fa' ? 'پا (چهارسر/همسترینگ)' : 'Legs (Quads/Hams)', value: 24, color: '#8b5cf6' },
    { name: lang === 'fa' ? 'سرشانه' : 'Shoulders', value: 14, color: '#f59e0b' },
    { name: lang === 'fa' ? 'بازو (جلو/پشت بازو)' : 'Arms (Biceps/Triceps)', value: 16, color: '#ec4899' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          {labels.progressScreenTitle}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          {labels.progressScreenSubtitle}
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            {lang === 'fa' ? 'جلسات تکمیل‌شده' : 'Completed Sessions'}
          </span>
          <span className="text-xl font-black text-white mt-1 block">
            {workoutHistory.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'fa' ? 'رکوردهای ثبت‌شده' : 'Personal Records'}
          </span>
          <span className="text-xl font-black text-white mt-1 block">
            {personalRecords.length} PRs
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            {lang === 'fa' ? 'مجموع تناژ جابجا شده' : 'Total Volume Moved'}
          </span>
          <span className="text-xl font-black text-white mt-1 block">
            {workoutHistory.reduce((a, b) => a + b.totalVolumeKg, 0).toLocaleString()} {labels.kgUnit}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            {lang === 'fa' ? 'میانگین هر جلسه' : 'Avg Duration'}
          </span>
          <span className="text-xl font-black text-white mt-1 block">
            {workoutHistory.length > 0
              ? Math.round(workoutHistory.reduce((a, b) => a + (b.durationSeconds || 0), 0) / (workoutHistory.length * 60))
              : 0} {lang === 'fa' ? 'دقیقه' : 'min'}
          </span>
        </div>
      </div>

      {/* Chart 1: Volume Progression */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {labels.weeklyVolumeChartTitle}
            </h3>
            <span className="text-[11px] text-zinc-400">
              {lang === 'fa' ? 'تناژ کل (کیلوگرم) در جلسات اخیر' : 'Total volume per session (kg)'}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {labels.kgUnit}
          </span>
        </div>

        <div className="h-64 w-full">
          {volumeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="volume" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-zinc-500">
              {lang === 'fa' ? 'پس از ثبت اولین جلسه، نمودار حجم تمرین در اینجا ترسیم می‌شود.' : 'Log a workout to view volume graph.'}
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Muscle Distribution & 1RM Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Muscle Volume Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1">
              {labels.muscleVolumeBreakdown}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {lang === 'fa' ? 'توزیع ست‌های هفتگی بر اساس برنامه فعال' : 'Weekly target sets by muscle group'}
            </p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={muscleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {muscleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-zinc-400">
            {muscleDistribution.map((m) => (
              <span key={m.name} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span>{m.name}: {m.value} sets</span>
              </span>
            ))}
          </div>
        </div>

        {/* 1RM Calculator (Brzycki formula) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                {lang === 'fa' ? 'ماشین‌حساب پیشرفته 1RM (فرمول Brzycki)' : 'Brzycki 1RM Calculator'}
              </h3>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              {lang === 'fa'
                ? 'محاسبه حداکثر وزنه یک تکرار (1 Rep Max) جهت تخمین شدت و درصدهای تمرینی'
                : 'Scientific estimate of your single-repetition maximum'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                {lang === 'fa' ? 'وزنه جابجا شده (kg)' : 'Weight Lifted (kg)'}
              </label>
              <input
                type="number"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                {lang === 'fa' ? 'تعداد تکرار اجرا شده' : 'Reps Performed'}
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={calcReps}
                onChange={(e) => setCalcReps(Number(e.target.value) || 1)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-bold"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 block">
                {labels.oneRepMaxEstimated}
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {calculatedOneRepMax} {labels.kgUnit}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              1RM = W / (1.0278 - 0.0278×R)
            </span>
          </div>
        </div>
      </div>

      {/* Personal Records (PRs) Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              {labels.personalRecordsListTitle}
            </h3>
          </div>
          <span className="text-xs text-zinc-400">
            {personalRecords.length} {lang === 'fa' ? 'رکورد ثبت‌شده' : 'Records'}
          </span>
        </div>

        <div className="space-y-2">
          {personalRecords.map((pr, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {getExerciseName(pr.exerciseName, lang, { fallbackFa: pr.exerciseNameFa, exerciseId: pr.exerciseId })}
                  </h4>
                  <span className="text-[10px] text-zinc-500">
                    {pr.date} • {pr.metric === 'max_weight' ? 'Max Weight' : 'Max Reps'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm sm:text-base font-black text-emerald-400">
                  {pr.value} {pr.unit}
                </span>
                {pr.previousValue && (
                  <span className="text-[10px] text-zinc-500 block">
                    +{(pr.value - pr.previousValue).toFixed(1)} {pr.unit}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
