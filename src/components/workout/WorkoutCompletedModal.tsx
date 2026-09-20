import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { WorkoutSession } from '../../types';
import { getDayName } from '../../utils/exerciseTranslation';
import { 
  Trophy, 
  Flame, 
  Layers, 
  RotateCcw, 
  Clock, 
  Star, 
  CheckCircle2, 
  X 
} from 'lucide-react';

interface WorkoutCompletedModalProps {
  session: WorkoutSession | null;
  onClose: () => void;
}

export const WorkoutCompletedModal: React.FC<WorkoutCompletedModalProps> = ({
  session,
  onClose
}) => {
  const { settings } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  useEffect(() => {
    if (session) {
      // Fire confetti celebration!
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (session.newPRsCount > 0) {
          setTimeout(() => {
            confetti({
              particleCount: 120,
              spread: 100,
              origin: { y: 0.5 }
            });
          }, 400);
        }
      } catch {}
    }
  }, [session]);

  if (!session) return null;

  const durationMin = Math.round((session.durationSeconds || 0) / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 flex items-center justify-center mx-auto mb-3 shadow-xl shadow-emerald-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {labels.workoutCompletedTitle}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {getDayName(session.dayName, lang)} • {session.programName}
          </p>
        </div>

        {/* New PR Badge Alert if any */}
        {session.newPRsCount > 0 && (
          <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-3 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-300">
                {session.newPRsCount} {labels.newPrBadge}!
              </div>
              <p className="text-[11px] text-amber-200/80">
                {lang === 'fa' 
                  ? 'رکوردهای تناژ جدیدی در این جلسه تمرینی به ثبت رسید.' 
                  : 'New personal record logged in this workout session!'}
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-center">
            <span className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-emerald-400" />
              {labels.totalVolume}
            </span>
            <span className="text-sm font-black text-white mt-1 block">
              {session.totalVolumeKg.toLocaleString()} {labels.kgUnit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-center">
            <span className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              {labels.totalSets}
            </span>
            <span className="text-sm font-black text-white mt-1 block">
              {session.totalSets}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-center">
            <span className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
              <RotateCcw className="w-3 h-3 text-indigo-400" />
              {labels.totalReps}
            </span>
            <span className="text-sm font-black text-white mt-1 block">
              {session.totalReps}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-center">
            <span className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              {labels.duration}
            </span>
            <span className="text-sm font-black text-white mt-1 block">
              {durationMin} {lang === 'fa' ? 'دقیقه' : 'min'}
            </span>
          </div>
        </div>

        {/* Star Rating Display */}
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between mb-5">
          <span className="text-xs font-semibold text-zinc-300">
            {lang === 'fa' ? 'امتیاز تمرین:' : 'Workout Rating:'}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= (session.rating || 5)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          id="btn-close-completed-workout"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
        >
          {lang === 'fa' ? 'عالی، بازگشت به داشبورد' : 'Awesome, Back to Dashboard'}
        </button>
      </div>
    </div>
  );
};
