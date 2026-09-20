import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { MuscleGroup, UserProfile } from '../../types';
import { 
  User, 
  Target, 
  Activity, 
  AlertTriangle, 
  Dumbbell, 
  Calendar, 
  Sliders, 
  Apple,
  Save, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  GripVertical,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface ProfileAssessmentProps {
  onSaved?: () => void;
  onNavigateToPrompt?: () => void;
}

export const ProfileAssessment: React.FC<ProfileAssessmentProps> = ({ 
  onSaved,
  onNavigateToPrompt
}) => {
  const { profile, updateProfile, resetAllData, settings } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [newForbiddenEx, setNewForbiddenEx] = useState('');
  const [newPreferredEx, setNewPreferredEx] = useState('');
  const [newCautionEx, setNewCautionEx] = useState('');
  const [newCustomEquip, setNewCustomEquip] = useState('');

  const handleReset = () => {
    const msg = lang === 'fa' 
      ? 'آیا مطمئن هستید که می‌خواهید تمام داده‌های کاربر و تاریخچه‌ها را پاک کرده و برنامه را کاملاً خام (صفر) کنید؟'
      : 'Are you sure you want to reset all data and history back to a completely clean state?';
    if (window.confirm(msg)) {
      resetAllData();
      setFormData({
        name: '',
        age: undefined,
        sex: 'male',
        height: undefined,
        heightUnit: 'cm',
        weight: undefined,
        weightUnit: 'kg',
        measurements: {},
        primaryGoal: 'Muscle Hypertrophy',
        priorityMuscles: ['Chest', 'Back', 'Shoulders', 'Quadriceps', 'Hamstrings', 'Biceps', 'Triceps'],
        experienceYears: 1,
        experienceLevel: 'intermediate',
        currentSessionsPerWeek: 4,
        avgSessionDurationMinutes: 60,
        gymExperienceNotes: '',
        knownPRs: {},
        hasInjuries: false,
        injuryLocations: [],
        injuryNotes: '',
        hasChronicConditions: false,
        chronicConditionNotes: '',
        forbiddenExercises: [],
        cautionExercises: [],
        preferredExercises: [],
        availableEquipment: ['Full Gym', 'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bench', 'Squat Rack'],
        customEquipment: [],
        daysPerWeek: 4,
        preferredDays: ['Saturday', 'Sunday', 'Tuesday', 'Wednesday'],
        sessionDurationMinutes: 60,
        preferredTrainingSplit: 'Upper / Lower',
        cardioPreference: 'post_workout',
        cardioMinutesPerWeek: 45,
        periodizationPreference: 'linear',
        preferredRepsRange: 'hypertrophy_6_12',
        warmupPreferences: { dynamicStretch: true, cardioMinutes: 5 },
        cooldownPreferences: { staticStretch: true, foamRolling: false },
        rpeTracking: true,
        restTimerPreferenceSeconds: 90,
        nutrition: { dietType: 'standard', dailyMealsCount: 4 }
      });
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  const steps = [
    { id: 'basic', label: labels.stepBasic, icon: User },
    { id: 'goals', label: labels.stepGoals, icon: Target },
    { id: 'experience', label: labels.stepExperience, icon: Activity },
    { id: 'limitations', label: labels.stepLimitations, icon: AlertTriangle },
    { id: 'equipment', label: labels.stepEquipment, icon: Dumbbell },
    { id: 'schedule', label: labels.stepSchedule, icon: Calendar },
    { id: 'preferences', label: labels.stepPreferences, icon: Sliders },
    { id: 'nutrition', label: labels.stepNutrition, icon: Apple },
  ];

  const handleSave = () => {
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    if (onSaved) onSaved();
  };

  const moveMusclePriority = (index: number, direction: 'up' | 'down') => {
    const list = [...formData.priorityMuscles];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData({ ...formData, priorityMuscles: list });
  };

  const allPossibleMuscles: MuscleGroup[] = [
    'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 
    'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Abs'
  ];

  const availableEquipmentOptions = [
    'Full Gym', 'Barbell', 'Dumbbell', 'Machine', 'Cable', 
    'Smith Machine', 'Bench', 'Squat Rack', 'Resistance Bands', 
    'Pull-up Bar', 'Home Gym', 'Bodyweight'
  ];

  const weekdaysList = [
    { en: 'Saturday', fa: 'شنبه' },
    { en: 'Sunday', fa: 'یکشنبه' },
    { en: 'Monday', fa: 'دوشنبه' },
    { en: 'Tuesday', fa: 'سه‌شنبه' },
    { en: 'Wednesday', fa: 'چهارشنبه' },
    { en: 'Thursday', fa: 'پنج‌شنبه' },
    { en: 'Friday', fa: 'جمعه' },
  ];

  const goalOptions = [
    { en: 'Muscle Hypertrophy', fa: 'عضله‌سازی و هایپرتروفی' },
    { en: 'Strength Progression', fa: 'افزایش قدرت و توان' },
    { en: 'Fat Loss', fa: 'کاهش چربی و کات' },
    { en: 'Body Recomposition', fa: 'ریکامپوزیشن (چربی‌سوزی همزمان با حفظ عضله)' },
    { en: 'General Fitness', fa: 'تناسب اندام و سلامت عمومی' },
    { en: 'Endurance', fa: 'استقامت عضلانی و قلبی' },
    { en: 'Athletic Performance', fa: 'عملکرد ورزشی و چابکی' },
    { en: 'Improve Weak Points', fa: 'تقویت نقاط ضعف عضلانی' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-400" />
            {labels.profileTitle}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {labels.profileSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button
            type="button"
            id="btn-reset-clean-state"
            onClick={handleReset}
            title={lang === 'fa' ? 'پاکسازی و بازگشت به حالت کاملاً خام' : 'Reset to clean state'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetSuccess ? (lang === 'fa' ? 'خام شد!' : 'Cleaned!') : (lang === 'fa' ? 'حالت خام' : 'Reset to Raw')}</span>
          </button>

          {onNavigateToPrompt && (
            <button
              onClick={onNavigateToPrompt}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'تولید پرامپت با این اطلاعات' : 'Generate AI Prompt'}</span>
            </button>
          )}

          <button
            id="btn-save-profile"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>{lang === 'fa' ? 'ذخیره شد!' : 'Saved!'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{labels.saveProfile}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-zinc-800">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Contents */}
      <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-5 sm:p-7 shadow-xl">
        {/* STEP 0: BASIC PROFILE */}
        {activeStep === 0 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              {labels.stepBasic}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'نام یا نام مستعار' : 'Full Name / Nickname'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'سن (سال)' : 'Age (years)'}
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'جنسیت بیولوژیک' : 'Biological Sex'}
                </label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="male">{lang === 'fa' ? 'مرد' : 'Male'}</option>
                  <option value="female">{lang === 'fa' ? 'زن' : 'Female'}</option>
                  <option value="other">{lang === 'fa' ? 'سایر' : 'Other'}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {lang === 'fa' ? 'قد' : 'Height'}
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {lang === 'fa' ? 'واحد قد' : 'Height Unit'}
                  </label>
                  <select
                    value={formData.heightUnit}
                    onChange={(e) => setFormData({ ...formData, heightUnit: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cm">cm (سانتی‌متر)</option>
                    <option value="in">in (اینچ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {lang === 'fa' ? 'وزن' : 'Weight'}
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {lang === 'fa' ? 'واحد وزن' : 'Weight Unit'}
                  </label>
                  <select
                    value={formData.weightUnit}
                    onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="kg">kg (کیلوگرم)</option>
                    <option value="lbs">lbs (پوند)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Optional Body Measurements */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-zinc-200">
                  {lang === 'fa' ? 'اندازه‌های بدن (اختیاری - جهت سنجش دقیق‌تر)' : 'Body Measurements (Optional)'}
                </h4>
                <span className="text-[11px] text-zinc-500">
                  {lang === 'fa' ? 'امکان رد کردن وجود دارد' : 'Can skip'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">{lang === 'fa' ? 'دور کمر (cm)' : 'Waist (cm)'}</label>
                  <input
                    type="number"
                    value={formData.measurements.waistCm || ''}
                    placeholder="82"
                    onChange={(e) => setFormData({
                      ...formData,
                      measurements: { ...formData.measurements, waistCm: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">{lang === 'fa' ? 'دور سینه (cm)' : 'Chest (cm)'}</label>
                  <input
                    type="number"
                    value={formData.measurements.chestCm || ''}
                    placeholder="104"
                    onChange={(e) => setFormData({
                      ...formData,
                      measurements: { ...formData.measurements, chestCm: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">{lang === 'fa' ? 'دور بازو (cm)' : 'Arm (cm)'}</label>
                  <input
                    type="number"
                    value={formData.measurements.armCm || ''}
                    placeholder="38"
                    onChange={(e) => setFormData({
                      ...formData,
                      measurements: { ...formData.measurements, armCm: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">{lang === 'fa' ? 'دور ران (cm)' : 'Thigh (cm)'}</label>
                  <input
                    type="number"
                    value={formData.measurements.thighCm || ''}
                    placeholder="58"
                    onChange={(e) => setFormData({
                      ...formData,
                      measurements: { ...formData.measurements, thighCm: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">{lang === 'fa' ? 'دور گردن (cm)' : 'Neck (cm)'}</label>
                  <input
                    type="number"
                    value={formData.measurements.neckCm || ''}
                    placeholder="39"
                    onChange={(e) => setFormData({
                      ...formData,
                      measurements: { ...formData.measurements, neckCm: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">{lang === 'fa' ? 'دور باسن (cm)' : 'Hips (cm)'}</label>
                  <input
                    type="number"
                    value={formData.measurements.hipsCm || ''}
                    placeholder="98"
                    onChange={(e) => setFormData({
                      ...formData,
                      measurements: { ...formData.measurements, hipsCm: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: GOALS & MUSCLE PRIORITY */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              {labels.stepGoals}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'هدف اصلی (Primary Goal)' : 'Primary Goal'}
                </label>
                <select
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {goalOptions.map((g) => (
                    <option key={g.en} value={g.en}>
                      {lang === 'fa' ? g.fa : g.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'هدف فرعی (Secondary Goal)' : 'Secondary Goal'}
                </label>
                <select
                  value={formData.secondaryGoal || ''}
                  onChange={(e) => setFormData({ ...formData, secondaryGoal: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">{lang === 'fa' ? 'بدون هدف فرعی' : 'None'}</option>
                  {goalOptions.map((g) => (
                    <option key={g.en} value={g.en}>
                      {lang === 'fa' ? g.fa : g.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Muscle Priority Reordering (Drag / Up / Down) */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="mb-3">
                <h4 className="text-sm font-bold text-white">
                  {lang === 'fa' ? 'اولویت‌بندی عضلات هدف (توزیع حجم تمرین)' : 'Target Muscle Priority Ranking'}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {lang === 'fa' 
                    ? 'عضلات بالاتر در اولویت حجم و فرکانس قرار خواهند گرفت. با دکمه‌های فلش اولویت را تغییر دهید.' 
                    : 'Muscles at the top receive higher weekly volume and frequency priority.'}
                </p>
              </div>

              <div className="space-y-2">
                {formData.priorityMuscles.map((muscle, idx) => (
                  <div
                    key={muscle}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-zinc-100">{muscle}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveMusclePriority(idx, 'up')}
                        disabled={idx === 0}
                        className="px-2 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMusclePriority(idx, 'down')}
                        disabled={idx === formData.priorityMuscles.length - 1}
                        className="px-2 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: EXPERIENCE & PRS */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              {labels.stepExperience}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'سطح تجربه تمرینی' : 'Experience Level'}
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="beginner">{lang === 'fa' ? 'مبتدی (زیر ۱ سال)' : 'Beginner (< 1 year)'}</option>
                  <option value="intermediate">{lang === 'fa' ? 'متوسط (۱ تا ۳ سال)' : 'Intermediate (1 - 3 years)'}</option>
                  <option value="advanced">{lang === 'fa' ? 'پیشرفته (بیش از ۳ سال)' : 'Advanced (3+ years)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'مدت سابقه تمرین (سال)' : 'Years of Training Experience'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'تعداد جلسات فعلی در هفته' : 'Current Sessions per Week'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.currentSessionsPerWeek}
                  onChange={(e) => setFormData({ ...formData, currentSessionsPerWeek: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'میانگین مدت هر جلسه (دقیقه)' : 'Average Session Duration (minutes)'}
                </label>
                <input
                  type="number"
                  value={formData.avgSessionDurationMinutes}
                  onChange={(e) => setFormData({ ...formData, avgSessionDurationMinutes: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Known PRs */}
            <div className="pt-4 border-t border-zinc-800">
              <h4 className="text-sm font-semibold text-zinc-200 mb-3">
                {lang === 'fa' ? 'رکوردهای تقریبی حرکات اصلی (اختیاری - کیلوگرم)' : 'Known Baseline PRs (Optional - kg)'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Bench Press</label>
                  <input
                    type="number"
                    value={formData.knownPRs?.benchPressKg || ''}
                    placeholder="85"
                    onChange={(e) => setFormData({
                      ...formData,
                      knownPRs: { ...formData.knownPRs, benchPressKg: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Back Squat</label>
                  <input
                    type="number"
                    value={formData.knownPRs?.squatKg || ''}
                    placeholder="105"
                    onChange={(e) => setFormData({
                      ...formData,
                      knownPRs: { ...formData.knownPRs, squatKg: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Deadlift</label>
                  <input
                    type="number"
                    value={formData.knownPRs?.deadliftKg || ''}
                    placeholder="130"
                    onChange={(e) => setFormData({
                      ...formData,
                      knownPRs: { ...formData.knownPRs, deadliftKg: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Overhead Press</label>
                  <input
                    type="number"
                    value={formData.knownPRs?.overheadPressKg || ''}
                    placeholder="55"
                    onChange={(e) => setFormData({
                      ...formData,
                      knownPRs: { ...formData.knownPRs, overheadPressKg: Number(e.target.value) || undefined }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LIMITATIONS & INJURIES (CRITICAL SECTION) */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {labels.stepLimitations}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {lang === 'fa' 
                  ? 'این اطلاعات به عنوان محدودیت قطعی به هوش مصنوعی منتقل می‌شود تا از تجویز حرکات خطرساز جلوگیری کند.' 
                  : 'Passed strictly to the AI prompt as movement boundaries to avoid risky exercises.'}
              </p>
            </div>

            {/* Injury Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div>
                <span className="text-sm font-semibold text-white">
                  {lang === 'fa' ? 'آیا آسیب‌دیدگی یا محدودیت فیزیکی دارید؟' : 'Do you have active injuries or physical limitations?'}
                </span>
                <p className="text-xs text-zinc-400">
                  {lang === 'fa' ? 'مفاصل، تاندون‌ها، کمر یا دیسک' : 'Joints, tendons, lower back, spine'}
                </p>
              </div>

              <input
                type="checkbox"
                checked={formData.hasInjuries}
                onChange={(e) => setFormData({ ...formData, hasInjuries: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {formData.hasInjuries && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {lang === 'fa' ? 'توضیحات مربوط به محدودیت‌ها و آسیب‌ها (فیلد آزاد)' : 'Detailed Description of Limitations'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.injuryDescription || ''}
                    onChange={(e) => setFormData({ ...formData, injuryDescription: e.target.value })}
                    placeholder={lang === 'fa' ? 'مثال: سابقه درد شانه در حرکات پرس بالای سر، یا محدودیت زانو در زاویه کمتر از ۹۰ درجه...' : 'e.g. Mild left shoulder impingement with wide overhead pressing...'}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Forbidden Exercises */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-rose-400 mb-1.5">
                {lang === 'fa' ? 'حرکات ممنوع (تحت هیچ شرایطی در برنامه قرار نگیرد)' : 'Forbidden Exercises (Strictly Excluded)'}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newForbiddenEx}
                  onChange={(e) => setNewForbiddenEx(e.target.value)}
                  placeholder={lang === 'fa' ? 'مثلاً: Behind the Neck Press' : 'e.g. Behind the neck press'}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newForbiddenEx.trim()) {
                      setFormData({
                        ...formData,
                        forbiddenExercises: [...formData.forbiddenExercises, newForbiddenEx.trim()]
                      });
                      setNewForbiddenEx('');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {lang === 'fa' ? 'افزودن' : 'Add'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {formData.forbiddenExercises.map((ex, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  >
                    {ex}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.forbiddenExercises.filter((_, i) => i !== idx);
                        setFormData({ ...formData, forbiddenExercises: updated });
                      }}
                      className="hover:text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Exercises */}
            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-xs font-semibold text-emerald-400 mb-1.5">
                {lang === 'fa' ? 'حرکات مورد علاقه (در صورت تناسب بیومکانیک اولویت داده شود)' : 'Preferred Exercises (Prioritize)'}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newPreferredEx}
                  onChange={(e) => setNewPreferredEx(e.target.value)}
                  placeholder={lang === 'fa' ? 'مثلاً: Incline Dumbbell Press' : 'e.g. Incline DB Press'}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPreferredEx.trim()) {
                      setFormData({
                        ...formData,
                        preferredExercises: [...formData.preferredExercises, newPreferredEx.trim()]
                      });
                      setNewPreferredEx('');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {lang === 'fa' ? 'افزودن' : 'Add'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {formData.preferredExercises.map((ex, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    {ex}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.preferredExercises.filter((_, i) => i !== idx);
                        setFormData({ ...formData, preferredExercises: updated });
                      }}
                      className="hover:text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: EQUIPMENT */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              {labels.stepEquipment}
            </h3>

            <p className="text-xs text-zinc-400">
              {lang === 'fa' 
                ? 'تجهیزاتی که در باشگاه یا منزل به آن‌ها دسترسی دارید را علامت بزنید:' 
                : 'Select the equipment you have consistent access to:'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {availableEquipmentOptions.map((equip) => {
                const isSelected = formData.availableEquipment.includes(equip);
                return (
                  <button
                    key={equip}
                    type="button"
                    onClick={() => {
                      const list = isSelected
                        ? formData.availableEquipment.filter((x) => x !== equip)
                        : [...formData.availableEquipment, equip];
                      setFormData({ ...formData, availableEquipment: list });
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span>{equip}</span>
                    <span className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-emerald-500 border-emerald-400 text-zinc-950' : 'border-zinc-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Equipment */}
            <div className="pt-4 border-t border-zinc-800">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {lang === 'fa' ? 'تجهیزات سفارشی یا اختصاصی دیگر' : 'Custom Equipment'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCustomEquip}
                  onChange={(e) => setNewCustomEquip(e.target.value)}
                  placeholder={lang === 'fa' ? 'مثلاً: Trap Bar, Landmine, TRX' : 'e.g. Trap Bar, TRX'}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCustomEquip.trim()) {
                      setFormData({
                        ...formData,
                        customEquipment: [...formData.customEquipment, newCustomEquip.trim()]
                      });
                      setNewCustomEquip('');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
                >
                  {lang === 'fa' ? 'افزودن' : 'Add'}
                </button>
              </div>

              {formData.customEquipment.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.customEquipment.map((eq, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-zinc-800 text-zinc-200">
                      {eq}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.customEquipment.filter((_, idx) => idx !== i);
                          setFormData({ ...formData, customEquipment: updated });
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-zinc-400 hover:text-rose-400" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: SCHEDULE */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {labels.stepSchedule}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'تعداد جلسات تمرین در هفته' : 'Target Days per Week'}
                </label>
                <select
                  value={formData.daysPerWeek}
                  onChange={(e) => setFormData({ ...formData, daysPerWeek: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={3}>3 {lang === 'fa' ? 'جلسه در هفته' : 'days/week'}</option>
                  <option value={4}>4 {lang === 'fa' ? 'جلسه در هفته (توصیه‌شده)' : 'days/week (Recommended)'}</option>
                  <option value={5}>5 {lang === 'fa' ? 'جلسه در هفته' : 'days/week'}</option>
                  <option value={6}>6 {lang === 'fa' ? 'جلسه در هفته' : 'days/week'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'مدت زمان هر جلسه (دقیقه)' : 'Session Duration (Minutes)'}
                </label>
                <input
                  type="number"
                  min="30"
                  max="120"
                  value={formData.sessionDurationMinutes}
                  onChange={(e) => setFormData({ ...formData, sessionDurationMinutes: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Preferred Weekdays */}
            <div className="pt-3">
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                {lang === 'fa' ? 'روزهای قابل تمرین در هفته' : 'Preferred Training Days'}
              </label>
              <div className="flex flex-wrap gap-2">
                {weekdaysList.map((day) => {
                  const isSelected = formData.preferredDays.includes(day.en);
                  return (
                    <button
                      key={day.en}
                      type="button"
                      onClick={() => {
                        const list = isSelected
                          ? formData.preferredDays.filter((d) => d !== day.en)
                          : [...formData.preferredDays, day.en];
                        setFormData({ ...formData, preferredDays: list });
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {lang === 'fa' ? day.fa : day.en}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: PREFERENCES & ADVANCED TECHNIQUES */}
        {activeStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              {labels.stepPreferences}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'حجم تمرین مورد علاقه' : 'Volume Preference'}
                </label>
                <select
                  value={formData.volumePreference}
                  onChange={(e) => setFormData({ ...formData, volumePreference: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                >
                  <option value="low">{lang === 'fa' ? 'کم (ست‌های کم با شدت حداکثری)' : 'Low Volume'}</option>
                  <option value="moderate">{lang === 'fa' ? 'متوسط (تعادل بهینه ریکاوری)' : 'Moderate Volume'}</option>
                  <option value="high">{lang === 'fa' ? 'بالا (تعداد ست‌های بیشتر)' : 'High Volume'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'محدوده تکرار مورد علاقه' : 'Rep Range Preference'}
                </label>
                <select
                  value={formData.repRangePreference}
                  onChange={(e) => setFormData({ ...formData, repRangePreference: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                >
                  <option value="hypertrophy_6_12">6 - 12 Reps (Hypertrophy Standard)</option>
                  <option value="strength_1_5">1 - 5 Reps (Heavy Strength Focus)</option>
                  <option value="endurance_12_20">12 - 20 Reps (Metabolic Stress)</option>
                  <option value="mixed">Mixed Periodized Range</option>
                </select>
              </div>
            </div>

            {/* Techniques Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800">
              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer">
                <span>{lang === 'fa' ? 'تمرینات سوپرست (Superset)' : 'Allow Supersets'}</span>
                <input
                  type="checkbox"
                  checked={formData.allowSupersets}
                  onChange={(e) => setFormData({ ...formData, allowSupersets: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer">
                <span>{lang === 'fa' ? 'دراپ‌ست (Drop Set)' : 'Allow Drop Sets'}</span>
                <input
                  type="checkbox"
                  checked={formData.allowDropSets}
                  onChange={(e) => setFormData({ ...formData, allowDropSets: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer">
                <span>{lang === 'fa' ? 'استراحت-مکث (Rest-Pause)' : 'Rest-Pause'}</span>
                <input
                  type="checkbox"
                  checked={formData.allowRestPause}
                  onChange={(e) => setFormData({ ...formData, allowRestPause: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>
            </div>
          </div>
        )}

        {/* STEP 7: OPTIONAL NUTRITION */}
        {activeStep === 7 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-400" />
                {labels.stepNutrition}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {lang === 'fa' 
                  ? 'این بخش اختیاری است و صرفاً جهت آگاهی هوش مصنوعی از وضعیت کالری و پروتئین شما در پرامپت قرار می‌گیرد.' 
                  : 'Optional nutrition context for the AI prompt only.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'کالری روزانه تقریبی (کیلوکالری)' : 'Approx Daily Calories (kcal)'}
                </label>
                <input
                  type="number"
                  placeholder="2600"
                  value={formData.nutrition?.approximateCalories || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, approximateCalories: Number(e.target.value) || undefined }
                  })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'پروتئین روزانه تقریبی (گرم)' : 'Approx Daily Protein (g)'}
                </label>
                <input
                  type="number"
                  placeholder="160"
                  value={formData.nutrition?.proteinGrams || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, proteinGrams: Number(e.target.value) || undefined }
                  })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'نوع رژیم غذایی' : 'Diet Style'}
                </label>
                <select
                  value={formData.nutrition?.dietType || 'high_protein'}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, dietType: e.target.value as any }
                  })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                >
                  <option value="high_protein">{lang === 'fa' ? 'پروتئین بالا (ورزشی)' : 'High Protein'}</option>
                  <option value="standard">{lang === 'fa' ? 'عادی و متعادل' : 'Standard Balanced'}</option>
                  <option value="keto">{lang === 'fa' ? 'کتوژنیک' : 'Ketogenic'}</option>
                  <option value="vegan">{lang === 'fa' ? 'گیاه‌خواری مطلق (Vegan)' : 'Vegan'}</option>
                  <option value="vegetarian">{lang === 'fa' ? 'گیاه‌خواری (Vegetarian)' : 'Vegetarian'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {lang === 'fa' ? 'تعداد وعده‌های غذایی در روز' : 'Meals per Day'}
                </label>
                <input
                  type="number"
                  placeholder="4"
                  value={formData.nutrition?.dailyMealsCount || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, dailyMealsCount: Number(e.target.value) || undefined }
                  })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Footer */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-800">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-700/80 transition-colors ${
              activeStep === 0 ? 'opacity-0 pointer-events-none' : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {lang === 'fa' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{labels.back}</span>
          </button>

          <div className="flex items-center gap-2">
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
              >
                <span>{labels.next}</span>
                {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{labels.saveProfile}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
