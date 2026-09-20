import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { validateWorkoutProgramJson } from '../../utils/schemaValidator';
import { SAMPLE_WORKOUT_PROGRAM } from '../../data/sampleProgram';
import { ValidationResult, WorkoutProgramJson } from '../../types';
import { getDayName, getMuscleGroupName } from '../../utils/exerciseTranslation';
import { 
  FileCode, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  Play, 
  Layers, 
  Calendar, 
  Flame,
  ArrowRight,
  ClipboardPaste
} from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramImported?: (programId: string) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onProgramImported
}) => {
  const { importProgram, settings } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  const [jsonInput, setJsonInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'paste' | 'file'>('paste');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [parsedProgram, setParsedProgram] = useState<WorkoutProgramJson | null>(null);
  const [isReadyView, setIsReadyView] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleValidateAndParse = (rawText: string) => {
    setJsonInput(rawText);
    const result = validateWorkoutProgramJson(rawText);
    setValidationResult(result);

    if (result.isValid) {
      try {
        let clean = rawText.trim();
        if (clean.startsWith('```')) {
          clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        }
        const parsed = JSON.parse(clean);
        setParsedProgram(parsed);
        setIsReadyView(true);
      } catch (e) {
        setIsReadyView(false);
      }
    } else {
      setIsReadyView(false);
      setParsedProgram(null);
    }
  };

  const handleLoadSample = () => {
    const sampleStr = JSON.stringify(SAMPLE_WORKOUT_PROGRAM, null, 2);
    handleValidateAndParse(sampleStr);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        handleValidateAndParse(text);
      }
    };
    reader.readAsText(file);
  };

  const handleActivate = () => {
    if (parsedProgram) {
      importProgram(parsedProgram, true);
      onClose();
      if (onProgramImported) onProgramImported(parsedProgram.program.id);
    }
  };

  // Calculate stats for preview
  const totalExercises = parsedProgram?.days.reduce((acc, d) => acc + d.exercises.length, 0) || 0;
  const totalWeeklySets = parsedProgram?.days.reduce((acc, d) => {
    return acc + d.exercises.reduce((exAcc, ex) => exAcc + ex.sets, 0);
  }, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {labels.importModalTitle}
              </h3>
              <span className="text-[10px] text-zinc-400 font-mono">
                Compliant with Schema 1.0
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Toggle between Importer and "Program Ready" screen */}
        <div className="py-4 overflow-y-auto flex-1 space-y-4">
          {!isReadyView ? (
            <>
              {/* Quick Actions & Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => setActiveTab('paste')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === 'paste'
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {labels.pasteJsonTab}
                  </button>
                  <button
                    onClick={() => setActiveTab('file')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === 'file'
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {labels.fileUploadTab}
                  </button>
                </div>

                <button
                  id="btn-load-sample-json"
                  onClick={handleLoadSample}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{labels.loadDemoJson}</span>
                </button>
              </div>

              {/* Paste JSON Mode */}
              {activeTab === 'paste' && (
                <div className="space-y-2">
                  <textarea
                    id="textarea-json-import"
                    rows={10}
                    value={jsonInput}
                    onChange={(e) => handleValidateAndParse(e.target.value)}
                    placeholder='{"schema_version": "1.0", "program": { ... }, "days": [ ... ]}'
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 font-mono text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 selection:bg-emerald-500/30"
                  />
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{lang === 'fa' ? 'اعتبارسنجی آنی در حین تایپ یا الصاق' : 'Real-time live validation'}</span>
                    <span>{jsonInput.length} chars</span>
                  </div>
                </div>
              )}

              {/* File Upload Mode */}
              {activeTab === 'file' && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-colors ${
                    dragActive
                      ? 'border-emerald-500 bg-emerald-500/5'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60'
                  }`}
                >
                  <Upload className="w-10 h-10 text-zinc-500 mb-3" />
                  <p className="text-sm font-semibold text-zinc-200 mb-1">
                    {lang === 'fa' ? 'فایل JSON را به اینجا بکشید یا انتخاب کنید' : 'Drop workout JSON file here or browse'}
                  </p>
                  <p className="text-xs text-zinc-500 mb-4">
                    {lang === 'fa' ? 'فرمت‌های پشتیبانی شده: .json' : 'Supported: .json'}
                  </p>

                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200">
                    {lang === 'fa' ? 'انتخاب فایل از دستگاه' : 'Select File'}
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Validation Feedback */}
              {validationResult && !validationResult.isValid && (
                <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{labels.validationErrorsTitle} ({validationResult.errors.length})</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {validationResult.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-950/80 border border-rose-900/40 rounded-xl p-2.5 text-[11px] font-mono space-y-1"
                      >
                        <div className="flex items-center justify-between text-rose-300">
                          <span className="font-bold">{err.location}</span>
                          <span className="text-[10px] text-zinc-500">#{idx + 1}</span>
                        </div>
                        <p className="text-zinc-300">{err.error}</p>
                        <div className="text-emerald-400/90 text-[10px] bg-emerald-950/40 px-2 py-1 rounded">
                          💡 {labels.fixLabel}: {err.suggestedFix}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validationResult?.warnings && validationResult.warnings.length > 0 && (
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 space-y-1">
                  <div className="font-bold">{labels.validationWarningsTitle}:</div>
                  {validationResult.warnings.map((w, idx) => (
                    <p key={idx} className="text-[11px] text-amber-200/80">• {w}</p>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Program Ready View (Requirement 55) */
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {labels.validSchemaSuccess}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {lang === 'fa' ? 'تمام اعتبارسنجی‌ها پاس شدند و برنامه آماده فعال‌سازی است.' : 'All checks passed. Ready for active tracking.'}
                  </p>
                </div>
              </div>

              {/* Program Details Card */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {labels.programName}
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {lang === 'fa' && parsedProgram?.program.name_fa ? parsedProgram.program.name_fa : parsedProgram?.program.name}
                  </h3>
                  {parsedProgram?.program.description && (
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {parsedProgram.program.description}
                    </p>
                  )}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-zinc-800/80">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      {labels.daysPerWeek}
                    </span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">
                      {parsedProgram?.program.days_per_week || parsedProgram?.days.length}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      {labels.durationWeeks}
                    </span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">
                      {parsedProgram?.program.duration_weeks || 8} {lang === 'fa' ? 'هفته' : 'weeks'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      {labels.exerciseCount}
                    </span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">
                      {totalExercises}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-400" />
                      {lang === 'fa' ? 'مجموع ست‌ها' : 'Total Sets'}
                    </span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">
                      {totalWeeklySets} / wk
                    </span>
                  </div>
                </div>

                {/* Days Overview */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  <span className="text-xs font-semibold text-zinc-300 block">
                    {lang === 'fa' ? 'ساختار روزهای تمرین:' : 'Training Days Breakdown:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {parsedProgram?.days.map((day) => (
                      <div key={day.day_id} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                        <div className="font-bold text-zinc-200">{getDayName(day.name, lang, day.name_fa)}</div>
                        <div className="text-[11px] text-emerald-400 mt-0.5">
                          {day.focus?.map((f) => getMuscleGroupName(f, lang)).join(' • ') || (lang === 'fa' ? 'فول‌بادی' : 'Full Body')}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1">
                          {day.exercises.length} {lang === 'fa' ? 'حرکت تمرینی' : 'exercises'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          {isReadyView ? (
            <>
              <button
                onClick={() => setIsReadyView(false)}
                className="px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                {lang === 'fa' ? 'ویرایش مجدد JSON' : 'Edit JSON'}
              </button>

              <button
                id="btn-activate-imported-program"
                onClick={handleActivate}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{labels.activateProgramNow}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>

              {validationResult?.isValid && (
                <button
                  onClick={() => setIsReadyView(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs"
                >
                  <span>{lang === 'fa' ? 'مشاهده خلاصه برنامه' : 'View Program Summary'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
