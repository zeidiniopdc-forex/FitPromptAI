import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { getExerciseName, getMuscleGroupName, getDayName } from '../../utils/exerciseTranslation';
import { 
  FolderKanban, 
  Copy, 
  Trash2, 
  Download, 
  Check, 
  Plus, 
  Play, 
  Calendar, 
  Layers, 
  Flame, 
  FileCode, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Share2
} from 'lucide-react';

interface ProgramManagerProps {
  onOpenImport: () => void;
  onStartWorkoutDay?: (dayId: string) => void;
}

export const ProgramManager: React.FC<ProgramManagerProps> = ({
  onOpenImport,
  onStartWorkoutDay
}) => {
  const { 
    programs, 
    activeProgramId, 
    activateProgram, 
    duplicateProgram, 
    deleteProgram, 
    exportProgramJson, 
    settings 
  } = useApp();

  const lang = settings.language;
  const labels = t[lang];

  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(activeProgramId);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleExport = async (progId: string) => {
    const jsonStr = exportProgramJson(progId);
    try {
      await navigator.clipboard.writeText(jsonStr);
      setCopiedId(progId);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Create downloadable file blob
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitprompt_program_${progId}.json`;
      a.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-emerald-400" />
            {labels.programManagementTitle}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {labels.programManagementSubtitle}
          </p>
        </div>

        <button
          id="btn-import-program-top"
          onClick={onOpenImport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <FileCode className="w-4 h-4" />
          <span>{labels.importJson}</span>
        </button>
      </div>

      {/* Programs List */}
      <div className="space-y-4">
        {programs.map((prog) => {
          const isCurrentActive = prog.program.id === activeProgramId;
          const isExpanded = expandedProgramId === prog.program.id;
          const totalExercises = prog.days.reduce((acc, d) => acc + d.exercises.length, 0);

          return (
            <div
              key={prog.program.id}
              className={`border rounded-3xl overflow-hidden transition-all ${
                isCurrentActive
                  ? 'bg-zinc-900 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
                  : 'bg-zinc-900/60 border-zinc-800'
              }`}
            >
              {/* Program Card Header */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                      isCurrentActive
                        ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      <FolderKanban className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-black text-white">
                          {lang === 'fa' && prog.program.name_fa ? prog.program.name_fa : prog.program.name}
                        </h3>
                        {isCurrentActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {labels.activeProgramBadge}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-500 font-mono">
                          v{prog.schema_version}
                        </span>
                      </div>

                      {prog.program.description && (
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-xl">
                          {prog.program.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Top Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {!isCurrentActive && (
                      <button
                        onClick={() => activateProgram(prog.program.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
                      >
                        {labels.activateProgram}
                      </button>
                    )}

                    <button
                      onClick={() => duplicateProgram(prog.program.id)}
                      title={labels.duplicateProgram}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleExport(prog.program.id)}
                      title={labels.exportProgramJson}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                    >
                      {copiedId === prog.program.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                    </button>

                    {programs.length > 1 && (
                      <button
                        onClick={() => deleteProgram(prog.program.id)}
                        title={labels.deleteProgram}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-zinc-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedProgramId(isExpanded ? null : prog.program.id)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Metrics Pill row */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 pt-3 border-t border-zinc-800/80 text-xs text-zinc-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{prog.program.days_per_week || prog.days.length} {labels.daysPerWeek}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{totalExercises} {labels.exerciseCount}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{prog.program.duration_weeks || 8} {labels.durationWeeks}</span>
                  </span>
                </div>
              </div>

              {/* Expanded Days Breakdown */}
              {isExpanded && (
                <div className="bg-zinc-950/70 p-5 border-t border-zinc-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-zinc-300">
                    {lang === 'fa' ? 'برنامه روزها و حرکات:' : 'Workout Days & Routines:'}
                  </h4>

                  <div className="space-y-3">
                    {prog.days.map((day) => {
                      const dayDisplayName = getDayName(day.name, lang, day.name_fa);
                      const focusDisplayName = day.focus?.map((f) => getMuscleGroupName(f, lang)).join(' • ') || (lang === 'fa' ? 'فول‌بادی' : 'Full Body');

                      return (
                        <div
                          key={day.day_id}
                          className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-bold text-white block">
                                {dayDisplayName}
                              </span>
                              <span className="text-[11px] text-emerald-400">
                                {focusDisplayName}
                              </span>
                            </div>

                            {onStartWorkoutDay && (
                              <button
                                onClick={() => {
                                  activateProgram(prog.program.id);
                                  onStartWorkoutDay(day.day_id);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold transition-colors"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>{labels.startWorkout}</span>
                              </button>
                            )}
                          </div>

                          {/* Exercises preview tags */}
                          <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                            {day.exercises.map((ex, i) => {
                              const exDisplayName = getExerciseName(ex.name, lang, {
                                fallbackFa: ex.name_fa,
                                exerciseId: ex.exercise_id
                              });

                              return (
                                <div
                                  key={ex.exercise_id || i}
                                  className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60"
                                >
                                  <span className="font-semibold text-zinc-200">
                                    {i + 1}. {exDisplayName}
                                  </span>
                                  <span className="text-[11px] text-zinc-400 font-mono">
                                    {ex.sets} {lang === 'fa' ? 'ست' : 'sets'} × {typeof ex.reps === 'number' ? ex.reps : `${ex.reps.min}-${ex.reps.max}`}
                                    {ex.target_weight ? ` @ ${ex.target_weight}kg` : ''}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
