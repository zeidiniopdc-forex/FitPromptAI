import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { ExerciseLibraryItem, MuscleGroup, EquipmentType } from '../../types';
import { getMuscleGroupName, getEquipmentName } from '../../utils/exerciseTranslation';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Check, 
  AlertCircle, 
  Dumbbell, 
  X
} from 'lucide-react';

export const ExerciseLibraryScreen: React.FC = () => {
  const { exerciseLibrary, addCustomExercise, settings } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [activeExerciseDetail, setActiveExerciseDetail] = useState<ExerciseLibraryItem | null>(null);
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);

  // Custom Exercise Form State
  const [customNameEn, setCustomNameEn] = useState('');
  const [customNameFa, setCustomNameFa] = useState('');
  const [customTargetMuscle, setCustomTargetMuscle] = useState<MuscleGroup>('Chest');
  const [customDifficulty, setCustomDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [customPattern, setCustomPattern] = useState<'Push' | 'Pull' | 'Squat' | 'Hinge' | 'Lunge' | 'Carry' | 'Isolation'>('Push');
  const [customEquipment, setCustomEquipment] = useState<EquipmentType>('Barbell');
  const [customInstructionsFa, setCustomInstructionsFa] = useState('');
  const [customInstructionsEn, setCustomInstructionsEn] = useState('');

  const musclesList: (MuscleGroup | 'all')[] = [
    'all', 
    'Chest', 
    'Back', 
    'Shoulders', 
    'Biceps', 
    'Triceps', 
    'Quadriceps', 
    'Hamstrings', 
    'Glutes', 
    'Calves', 
    'Abs'
  ];

  const equipmentList: (EquipmentType | 'all')[] = [
    'all', 
    'Barbell', 
    'Dumbbell', 
    'Machine', 
    'Cable', 
    'Bench', 
    'Bodyweight'
  ];

  const filteredExercises = exerciseLibrary.filter((ex) => {
    const matchesSearch = 
      ex.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.nameFa.includes(searchQuery);
    const matchesMuscle = selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle;
    const matchesEquip = selectedEquipment === 'all' || ex.equipment === selectedEquipment;
    return matchesSearch && matchesMuscle && matchesEquip;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNameEn.trim()) return;

    addCustomExercise({
      nameEn: customNameEn.trim(),
      nameFa: customNameFa.trim() || customNameEn.trim(),
      muscleGroup: customTargetMuscle,
      secondaryMuscles: [],
      difficulty: customDifficulty,
      movementPattern: customPattern,
      equipment: customEquipment,
      instructionsEn: customInstructionsEn.trim() || 'Execute with controlled tempo and strict form.',
      instructionsFa: customInstructionsFa.trim() || 'اجرای حرکت با کنترل کامل و انقباض موثر در فاز منفی.'
    });

    setShowAddCustomModal(false);
    setCustomNameEn('');
    setCustomNameFa('');
    setCustomInstructionsFa('');
    setCustomInstructionsEn('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            {labels.exerciseLibraryTitle}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {labels.exerciseLibrarySubtitle} ({exerciseLibrary.length} {lang === 'fa' ? 'حرکت' : 'exercises'})
          </p>
        </div>

        <button
          onClick={() => setShowAddCustomModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{labels.addCustomExercise}</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 space-y-3 shadow-lg">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={labels.searchExercisePlaceholder}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Muscle filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none text-xs">
            <span className="text-[11px] text-zinc-500 shrink-0">{labels.filterByMuscle}:</span>
            {musclesList.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMuscle(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedMuscle === m
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {m === 'all' ? labels.allMuscles : getMuscleGroupName(m, lang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercises Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredExercises.map((ex) => {
          const isFa = lang === 'fa' || settings.exerciseNameLanguage === 'fa';
          const displayName = isFa ? (ex.nameFa || ex.nameEn) : ex.nameEn;
          const subName = isFa ? ex.nameEn : ex.nameFa;

          return (
            <div
              key={ex.id}
              onClick={() => setActiveExerciseDetail(ex)}
              className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all hover:bg-zinc-850 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-white">
                    {displayName}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-950 border border-zinc-800 text-zinc-400 shrink-0">
                    {ex.difficulty}
                  </span>
                </div>

                {(settings.exerciseNameLanguage === 'both' || (isFa && subName !== displayName)) && (
                  <span className="text-[11px] text-zinc-400 block mt-0.5 font-sans">
                    {subName}
                  </span>
                )}

                <div className="flex items-center gap-2 text-[11px] text-emerald-400 mt-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/20 font-semibold">
                    {getMuscleGroupName(ex.muscleGroup, lang)}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">{getEquipmentName(ex.equipment, lang)}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                <span>{ex.movementPattern} pattern</span>
                <span className="text-emerald-400 hover:underline">
                  {lang === 'fa' ? 'مشاهده بیومکانیک' : 'View Details'} →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exercise Detail Modal */}
      {activeExerciseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-black text-white">
                  {lang === 'fa' ? (activeExerciseDetail.nameFa || activeExerciseDetail.nameEn) : activeExerciseDetail.nameEn}
                </h3>
                <span className="text-xs text-emerald-400 font-semibold">
                  {lang === 'fa' ? activeExerciseDetail.nameEn : activeExerciseDetail.nameFa}
                </span>
              </div>
              <button
                onClick={() => setActiveExerciseDetail(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                {labels.targetMuscle}: <strong className="text-emerald-400">{getMuscleGroupName(activeExerciseDetail.muscleGroup, lang)}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                {labels.equipmentRequirement}: <strong className="text-white">{getEquipmentName(activeExerciseDetail.equipment, lang)}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                {labels.movementPattern}: <strong className="text-white">{activeExerciseDetail.movementPattern}</strong>
              </span>
            </div>

            {/* Secondary Muscles */}
            {activeExerciseDetail.secondaryMuscles.length > 0 && (
              <div>
                <span className="text-xs font-bold text-zinc-300 block mb-1">
                  {labels.synergistMuscles}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeExerciseDetail.secondaryMuscles.map((m, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {getMuscleGroupName(m, lang)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Execution Instructions */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                {labels.executionGuide}:
              </span>
              <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                <p>{activeExerciseDetail.instructionsFa}</p>
                <p className="text-zinc-500 font-sans text-[11px] pt-1 border-t border-zinc-850">
                  {activeExerciseDetail.instructionsEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Exercise Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in">
          <form onSubmit={handleCreateCustom} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                {labels.addCustomExercise}
              </h3>
              <button type="button" onClick={() => setShowAddCustomModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">نام انگلیسی حرکت</label>
              <input
                type="text"
                required
                value={customNameEn}
                onChange={(e) => setCustomNameEn(e.target.value)}
                placeholder="e.g. Bulgarian Split Squat with DB"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">نام فارسی حرکت</label>
              <input
                type="text"
                value={customNameFa}
                onChange={(e) => setCustomNameFa(e.target.value)}
                placeholder="مثلاً: اسکات بلغاری با دمبل"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">عضله هدف</label>
                <select
                  value={customTargetMuscle}
                  onChange={(e) => setCustomTargetMuscle(e.target.value as MuscleGroup)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {musclesList.filter((m) => m !== 'all').map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">تجهیزات</label>
                <select
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value as EquipmentType)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {equipmentList.filter((e) => e !== 'all').map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">نکات اجرای صحیح (فارسی)</label>
              <textarea
                rows={2}
                value={customInstructionsFa}
                onChange={(e) => setCustomInstructionsFa(e.target.value)}
                placeholder="پای عقب روی نیمکت، زانوی جلو در امتداد انگشتان..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAddCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md"
              >
                ثبت حرکت
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
