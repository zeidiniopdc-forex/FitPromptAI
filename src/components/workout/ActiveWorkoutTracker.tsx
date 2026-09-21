import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { LoggedExercise, LoggedSet, WorkoutSession } from '../../types';
import { getExerciseName, getMuscleGroupName, getDayName } from '../../utils/exerciseTranslation';
import { 
  Check, 
  Plus, 
  Minus, 
  Timer, 
  AlertCircle, 
  Dumbbell, 
  CheckCircle2, 
  RotateCcw, 
  Flame, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Info,
  Clock,
  Sparkles,
  StopCircle
} from 'lucide-react';

interface ActiveWorkoutTrackerProps {
  onSessionFinished?: (session: WorkoutSession) => void;
  onSessionDiscarded?: () => void;
  onNavigateToProgram?: () => void;
}

export const ActiveWorkoutTracker: React.FC<ActiveWorkoutTrackerProps> = ({
  onSessionFinished,
  onSessionDiscarded,
  onNavigateToProgram
}) => {
  const { 
    activeSession, 
    updateLoggedSet, 
    completeSet, 
    finishWorkoutSession, 
    discardWorkoutSession,
    startRestTimer,
    activeProgram,
    startWorkoutSession,
    settings 
  } = useApp();

  const lang = settings.language;
  const labels = t[lang];

  const [expandedExerciseIndex, setExpandedExerciseIndex] = useState<number>(0);
  const [workoutNotes, setWorkoutNotes] = useState<string>('');
  const [workoutRating, setWorkoutRating] = useState<number>(5);
  const [showFinishConfirm, setShowFinishConfirm] = useState<boolean>(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);

  // Scroll to top immediately when active workout tracker mounts to guarantee first exercise is 100% visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeSession?.dayId]);

  // If no active session, show quick-start selector for active program days
  if (!activeSession) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pb-28">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <Dumbbell className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {lang === 'fa' ? 'هیچ تمرین فعالی در حال اجرا نیست' : 'No Active Workout Running'}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            {lang === 'fa'
              ? 'برای شروع ثبت ست‌ها در باشگاه، یکی از روزهای برنامه فعال را انتخاب و تمرین را شروع کنید.'
              : 'Select a workout day from your active program to start logging weights and reps.'}
          </p>

          {activeProgram ? (
            <div className="pt-4 max-w-md mx-auto space-y-2.5">
              <span className="text-xs font-semibold text-zinc-300 block text-right">
                {lang === 'fa' ? 'روز تمرینی مورد نظر:' : 'Select Day:'} ({lang === 'fa' && activeProgram.program.name_fa ? activeProgram.program.name_fa : activeProgram.program.name})
              </span>
              {activeProgram.days.map((day) => {
                const dayDisplayName = getDayName(day.name, lang, day.name_fa);
                return (
                  <button
                    key={day.day_id}
                    id={`btn-start-day-${day.day_id}`}
                    onClick={() => startWorkoutSession(day.day_id)}
                    className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 flex items-center justify-between text-right transition-all group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {dayDisplayName}
                      </h4>
                      <span className="text-[11px] text-zinc-500">
                        {day.exercises.length} {lang === 'fa' ? 'حرکت' : 'exercises'} • {day.focus?.map((f) => getMuscleGroupName(f, lang)).join('، ')}
                      </span>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-bold">
                      {lang === 'fa' ? 'شروع تمرین' : 'Start'}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="pt-4">
              <button
                onClick={onNavigateToProgram}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs"
              >
                {lang === 'fa' ? 'ایجاد یا انتخاب برنامه' : 'Create or Select Program'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quick weight adjuster helper (+1.25, +2.5, +5, etc.)
  const adjustSetWeight = (exIdx: number, setIdx: number, delta: number) => {
    const currentWeight = activeSession.exercises[exIdx]?.sets[setIdx]?.actualWeightKg || 0;
    const newWeight = Math.max(0, Math.round((currentWeight + delta) * 100) / 100);
    updateLoggedSet(exIdx, setIdx, { actualWeightKg: newWeight });
  };

  // Quick reps adjuster helper (+1, -1)
  const adjustSetReps = (exIdx: number, setIdx: number, delta: number) => {
    const currentReps = activeSession.exercises[exIdx]?.sets[setIdx]?.actualReps || 0;
    const newReps = Math.max(0, currentReps + delta);
    updateLoggedSet(exIdx, setIdx, { actualReps: newReps });
  };

  // Auto-advance logic when user checks off a set
  const handleSetCheckClick = (exIdx: number, setIdx: number) => {
    const currentEx = activeSession.exercises[exIdx];
    const currentSet = currentEx?.sets[setIdx];
    const willBeCompleted = !currentSet?.isCompleted;

    completeSet(exIdx, setIdx);

    if (willBeCompleted) {
      // If there is another set in the current exercise, smoothly scroll to it
      if (setIdx < currentEx.sets.length - 1) {
        setTimeout(() => {
          const nextSetEl = document.getElementById(`set-row-${exIdx}-${setIdx + 1}`);
          if (nextSetEl) {
            nextSetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nextSetEl.classList.add('ring-2', 'ring-emerald-500/50');
            setTimeout(() => {
              nextSetEl.classList.remove('ring-2', 'ring-emerald-500/50');
            }, 800);
          }
        }, 80);
      } else {
        // Last set of current exercise! Automatically advance to the next exercise
        if (exIdx + 1 < activeSession.exercises.length) {
          setExpandedExerciseIndex(exIdx + 1);
          setTimeout(() => {
            const nextExCard = document.getElementById(`exercise-card-${exIdx + 1}`);
            if (nextExCard) {
              nextExCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              nextExCard.classList.add('ring-2', 'ring-emerald-500/50');
              setTimeout(() => {
                nextExCard.classList.remove('ring-2', 'ring-emerald-500/50');
              }, 900);
            }
          }, 150);
        } else {
          // Last set of the entire workout! Scroll to finish button
          setTimeout(() => {
            const finishBtn = document.getElementById('btn-finish-session-modal-open');
            finishBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 150);
        }
      }
    }
  };

  const handleFinish = () => {
    const finished = finishWorkoutSession(workoutNotes, workoutRating);
    if (finished && onSessionFinished) {
      onSessionFinished(finished);
    }
  };

  const handleDiscard = () => {
    discardWorkoutSession();
    setShowDiscardConfirm(false);
    if (onSessionDiscarded) onSessionDiscarded();
  };

  const completedSetsCount = activeSession.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length,
    0
  );
  const totalSetsCount = activeSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-32 overflow-x-hidden">
      {/* Top Session Status Bar (Relative flow prevents obscuring the first exercise) */}
      <div className="relative bg-zinc-900/90 border border-zinc-800/80 rounded-2xl px-3.5 sm:px-4 py-3.5 mb-5 flex items-center justify-between gap-2 shadow-md w-full">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm sm:text-base font-black text-white line-clamp-1">
              {getDayName(activeSession.dayName, lang)}
            </h2>
          </div>
          <p className="text-[11px] text-zinc-400">
            {completedSetsCount} / {totalSetsCount} {labels.totalSets}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Rest Timer Quick trigger */}
          <button
            onClick={() => startRestTimer(settings.defaultRestSeconds)}
            title="Start Rest Timer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <Timer className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{labels.restTimerTitle}</span>
          </button>

          {/* Finish Button */}
          <button
            id="btn-finish-session-modal-open"
            onClick={() => setShowFinishConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{labels.finishWorkout}</span>
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {activeSession.exercises.map((exercise, exIdx) => {
          const isExpanded = expandedExerciseIndex === exIdx;
          const completedInThisEx = exercise.sets.filter((s) => s.isCompleted).length;

          return (
            <div
              id={`exercise-card-${exIdx}`}
              key={exercise.exerciseId || exIdx}
              className={`scroll-mt-24 sm:scroll-mt-28 border rounded-2xl overflow-hidden transition-all ${
                completedInThisEx === exercise.sets.length && exercise.sets.length > 0
                  ? 'bg-zinc-900/40 border-emerald-500/30'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              {/* Exercise Header Card (Accordion toggle) */}
              <div
                onClick={() => setExpandedExerciseIndex(isExpanded ? -1 : exIdx)}
                className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none hover:bg-zinc-800/30 transition-colors gap-2"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    completedInThisEx === exercise.sets.length
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {exIdx + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 truncate">
                      {getExerciseName(exercise.name, lang, { fallbackFa: exercise.nameFa, exerciseId: exercise.exerciseId })}
                      {completedInThisEx === exercise.sets.length && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] text-zinc-400 mt-0.5 flex-wrap">
                      <span className="text-emerald-400">{getMuscleGroupName(exercise.muscleGroup, lang)}</span>
                      <span>•</span>
                      <span>{exercise.sets.length} {labels.totalSets}</span>
                      <span>•</span>
                      <span className="text-zinc-500">
                        {completedInThisEx}/{exercise.sets.length} {lang === 'fa' ? 'انجام شد' : 'done'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Expanded Exercise Body */}
              {isExpanded && (
                <div className="p-3.5 sm:p-4 pt-0 border-t border-zinc-800/80 space-y-3">
                  {exercise.notes && (
                    <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{exercise.notes}</span>
                    </div>
                  )}

                  {/* Sets Table */}
                  <div className="space-y-2.5">
                    {exercise.sets.map((set, setIdx) => (
                      <div
                        id={`set-row-${exIdx}-${setIdx}`}
                        key={setIdx}
                        className={`scroll-mt-24 sm:scroll-mt-28 p-2.5 sm:p-3 rounded-xl border transition-all ${
                          set.isCompleted
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : 'bg-zinc-950 border-zinc-800'
                        }`}
                      >
                        {/* Set Top Row: Set #, Target Info, Checkbox */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1 flex flex-wrap items-center gap-1.5">
                            <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center shrink-0">
                              {set.setNumber}
                            </span>
                            <span className="text-[11px] text-zinc-400 truncate">
                              {lang === 'fa' ? 'هدف:' : 'Target:'} {set.targetReps} reps
                              {set.targetWeightKg ? ` @ ${set.targetWeightKg}kg` : ''}
                              {set.targetRir !== null ? ` (RIR ${set.targetRir})` : ''}
                            </span>
                            {set.isWarmup && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 font-bold shrink-0">
                                WARMUP
                              </span>
                            )}
                            {set.isDropSet && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 font-bold shrink-0">
                                DROP SET
                              </span>
                            )}
                          </div>

                          {/* Big Checkbox for Complete (Gym ergonomics) */}
                          <button
                            id={`btn-check-set-${exIdx}-${setIdx}`}
                            onClick={() => handleSetCheckClick(exIdx, setIdx)}
                            className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all active:scale-95 ${
                              set.isCompleted
                                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            <Check className="w-5 h-5 stroke-[3]" />
                          </button>
                        </div>

                        {/* Set Controls: Weight Input & Reps Input + Quick Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {/* Weight Control */}
                          <div className="bg-zinc-900/90 rounded-xl p-2 border border-zinc-800/80">
                            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                              <span>{labels.weightInput} ({labels.kgUnit})</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => adjustSetWeight(exIdx, setIdx, -2.5)}
                                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
                                >
                                  -2.5
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adjustSetWeight(exIdx, setIdx, +2.5)}
                                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
                                >
                                  +2.5
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => adjustSetWeight(exIdx, setIdx, -1.25)}
                                className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center text-xs shrink-0"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                step="0.5"
                                value={set.actualWeightKg ?? ''}
                                onChange={(e) =>
                                  updateLoggedSet(exIdx, setIdx, {
                                    actualWeightKg: Number(e.target.value) || 0
                                  })
                                }
                                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-center font-bold text-sm text-white focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                type="button"
                                onClick={() => adjustSetWeight(exIdx, setIdx, +1.25)}
                                className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center text-xs shrink-0"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Reps Control */}
                          <div className="bg-zinc-900/90 rounded-xl p-2 border border-zinc-800/80">
                            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                              <span>{labels.repsInput}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => adjustSetReps(exIdx, setIdx, -1)}
                                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
                                >
                                  -1
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adjustSetReps(exIdx, setIdx, +1)}
                                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
                                >
                                  +1
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => adjustSetReps(exIdx, setIdx, -1)}
                                className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center text-xs shrink-0"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={set.actualReps ?? ''}
                                onChange={(e) =>
                                  updateLoggedSet(exIdx, setIdx, {
                                    actualReps: Number(e.target.value) || 0
                                  })
                                }
                                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-center font-bold text-sm text-white focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                type="button"
                                onClick={() => adjustSetReps(exIdx, setIdx, +1)}
                                className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center text-xs shrink-0"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Session Action Controls */}
      <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setShowDiscardConfirm(true)}
          className="text-xs text-zinc-500 hover:text-rose-400 transition-colors flex items-center gap-1.5 order-2 sm:order-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{lang === 'fa' ? 'انصراف و حذف این جلسه تمرینی' : 'Discard Workout Session'}</span>
        </button>

        <button
          id="btn-finish-session-bottom"
          onClick={() => setShowFinishConfirm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95 order-1 sm:order-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {labels.finishWorkout} ({completedSetsCount} / {totalSetsCount} {labels.totalSets})
          </span>
        </button>
      </div>

      {/* Finish Workout Confirmation Dialog */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'fa' ? 'ثبت و پایان جلسه تمرین' : 'Complete Workout Session'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {completedSetsCount} / {totalSetsCount} {labels.totalSets}
                </p>
              </div>
            </div>

            {/* Workout Rating */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {lang === 'fa' ? 'کیفیت و سطح انرژی تمرین امروز:' : 'Session Rating & Energy Level:'}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setWorkoutRating(val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      workoutRating === val
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    ★ {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Notes */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {lang === 'fa' ? 'یادداشت این جلسه (اختیاری):' : 'Session Notes (Optional):'}
              </label>
              <textarea
                rows={3}
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder={lang === 'fa' ? 'پمپ عالی، درد خفیف شانه برطرف شده بود...' : 'Great pump, felt strong on bench...'}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFinishConfirm(false)}
                className="px-4 py-2 rounded-xl border border-zinc-700 text-xs text-zinc-300"
              >
                {lang === 'fa' ? 'ادامه تمرین' : 'Continue Workout'}
              </button>

              <button
                id="btn-confirm-finish-session"
                type="button"
                onClick={handleFinish}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md"
              >
                {lang === 'fa' ? 'پایان و ثبت آمار' : 'Save & Finish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Confirmation Dialog */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {lang === 'fa' ? 'آیا از حذف این جلسه مطمئن هستید؟' : 'Discard this Workout Session?'}
            </h3>
            <p className="text-xs text-zinc-400">
              {lang === 'fa' 
                ? 'ست‌های ثبت‌شده در این جلسه پاک خواهند شد و در تاریخچه ثبت نمی‌شود.' 
                : 'Logged sets for this session will not be saved.'}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="px-4 py-2 rounded-xl border border-zinc-700 text-xs text-zinc-300"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                onClick={handleDiscard}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs"
              >
                {lang === 'fa' ? 'بله، حذف کن' : 'Yes, Discard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
