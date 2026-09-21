import { UserProfile } from '../types';
import { normalizeDayString, WEEKDAYS_PERSIAN_ORDER } from './weekday';

export const PROMPT_VERSION = "2.0";

// Formulate deep scientific guidance based on Primary & Secondary Goals
function getGoalSpecificDirectives(primaryGoal: string, secondaryGoal?: string): string {
  const goalDescriptions: Record<string, string> = {
    'Muscle Hypertrophy': `
- PRIMARY GOAL DIRECTIVE (HYPERTROPHY / عضله‌سازی و افزایش حجم خالص عضلانی):
  * Physiological Driver: Maximize mechanical tension across the full active muscle excursion, combined with controlled metabolic stress.
  * Loading Spectrum: 6-12 rep core hypertrophy window (6-8 reps for heavy multi-joint primers, 8-12 reps for mechanical tension compound drivers, 10-15 reps for stable cable/machine isolations).
  * Weekly Muscle Volume: 14-20 weekly working sets for priority muscles, distributed across 2 weekly exposures.
  * Tempo & Contraction: 3-0-1-0 tempo with a controlled 3-second eccentric phase to induce maximal myofibrillar microtrauma without destructive connective tissue strain.
  * Proximity to Failure: RIR 1-2 on heavy multi-joint movements, RIR 0-1 on isolation movements. Rest 2-3 min for compounds, 60-90s for accessories.`,

    'Strength Progression': `
- PRIMARY GOAL DIRECTIVE (STRENGTH PROGRESSION / افزایش قدرت بیشینه و ارتقای رکوردها):
  * Physiological Driver: High-threshold motor unit recruitment, rate coding, and intermuscular coordination.
  * Loading Spectrum: Heavy compound movements (Squat, Bench Press, Deadlift, Overhead Press, Weighted Pull-Up) programmed in 3-6 rep ranges at RPE 8-9 (RIR 1-2).
  * Rest Intervals: Generous 3 to 5 minutes between heavy sets to allow complete phosphocreatine (PCr) replenishment and central nervous system recovery.
  * Periodization: Main compound primers lead each session; accessories are programmed strictly to eliminate biomechanical sticking points.`,

    'Fat Loss & Definition': `
- PRIMARY GOAL DIRECTIVE (FAT LOSS & CUTTING / کاهش چربی و حفظ حداکثری توده عضلانی):
  * Physiological Driver: Retain lean contractile muscle tissue during a caloric deficit while maximizing training density and metabolic expenditure.
  * Loading Spectrum: Maintain heavy compound loads (6-10 reps) to signal muscle retention to the nervous system; combine accessories into non-competing antagonist supersets.
  * Rest Intervals: Structured 45-75 seconds to maintain elevated metabolic rate and cardiovascular demand without compromising technical form.
  * Fatigue Management: Avoid excessive empty junk volume that compromises recovery capacity under restricted nutrition.`,

    'Endurance & Stamina': `
- PRIMARY GOAL DIRECTIVE (MUSCULAR ENDURANCE / استقامت عضلانی و ظرفیت کاردیو):
  * Physiological Driver: Mitochondrial density, capillary proliferation, and enhanced lactate clearance.
  * Loading Spectrum: 15-25+ reps per set with short rest periods (30-45 seconds).
  * Methods: Incorporate rest-pause sets, ascending rep ladders, and continuous tension techniques.`,

    'Functional Fitness & Mobility': `
- PRIMARY GOAL DIRECTIVE (FUNCTIONAL & MOBILITY / آمادگی جسمانی و تحرک مفصلی):
  * Physiological Driver: Multi-planar stability (sagittal, frontal, transverse), unilateral balance, and rotational power.
  * Movement Selection: Prioritize unilateral movements (Bulgarian split squats, single-arm DB rows), loaded carries, core anti-rotation, and multi-joint transitions.
  * Loading Spectrum: 8-15 reps with deliberate end-range control and dynamic mobility warmups.`,

    'Joint Health & Rehabilitation': `
- PRIMARY GOAL DIRECTIVE (JOINT HEALTH & LONGEVITY / سلامت مفاصل و ایمنی تاندون‌ها):
  * Physiological Driver: Joint decompression, tendon remodeling, and zero axial spinal shear.
  * Movement Selection: Substitute free-weight axial loads with supported machine or cable variations (e.g. Chest-Supported T-Bar Row instead of Bent-Over Barbell Row; Hack Squat or Leg Press instead of Back Squat).
  * Tempo: 3-1-2-0 with 1-second isometric hold in peak contraction. Reps: 10-15 reps.`
  };

  const primaryBlock = goalDescriptions[primaryGoal] || `
- PRIMARY GOAL DIRECTIVE (${primaryGoal}):
  * Apply evidence-based exercise science principles tailored specifically to maximize ${primaryGoal}.`;

  let secondaryBlock = '';
  if (secondaryGoal && secondaryGoal !== 'None') {
    let synergyRule = '';
    if (primaryGoal === 'Muscle Hypertrophy' && secondaryGoal === 'Strength Progression') {
      synergyRule = `POWERBUILDING SYNERGY (عضله‌سازی + قدرت): Start every workout with ONE heavy compound movement (Squat, Bench, Deadlift, OHP, or Barbell Row) programmed for 3-5 reps (RPE 8.5, 3 min rest) to build absolute strength. Follow immediately with 3-4 hypertrophy-specific accessory movements programmed for 8-12 reps with high volume (4-5 sets) to drive muscular hypertrophy.`;
    } else if (primaryGoal === 'Strength Progression' && secondaryGoal === 'Muscle Hypertrophy') {
      synergyRule = `STRENGTH-BASE WITH HYPERTROPHY VOLUME: Devote 65% of session volume to heavy compound strength (3-6 reps, 4-5 sets). Program remaining accessories (8-12 reps) targeting prime movers' synergists (triceps, lats, glutes) to eliminate sticking points.`;
    } else if (primaryGoal === 'Muscle Hypertrophy' && secondaryGoal === 'Fat Loss & Definition') {
      synergyRule = `HIGH-DENSITY LEAN HYPERTROPHY: Maintain high volume (4-5 sets per exercise, 8-12 reps) but pair accessory exercises into antagonist supersets with crisp 60-75s rest periods to elevate metabolic conditioning while preserving full myofibrillar tension.`;
    } else if (primaryGoal === 'Muscle Hypertrophy' && (secondaryGoal === 'Joint Health & Rehabilitation' || secondaryGoal === 'Functional Fitness & Mobility')) {
      synergyRule = `JOINT-FRIENDLY HYPERTROPHY: Train with full active range of motion and loaded stretches, but strictly eliminate high-risk spinal compression or shoulder impingement angles. Use cables, chest-supported rows, and dumbbells with 10-12 reps and controlled eccentrics.`;
    } else {
      synergyRule = `HYBRID INTEGRATION: Let ${primaryGoal} dictate 70% of volume and exercise selection, and use ${secondaryGoal} to shape the remaining 30% through targeted rep ranges, accessory choices, and rest period modulation.`;
    }

    secondaryBlock = `
### SECONDARY GOAL INTEGRATION & SYNERGY:
- Trainee Secondary Goal: ${secondaryGoal}
- GOAL SYNERGY MANDATE:
  * ${synergyRule}`;
  }

  return `${primaryBlock}${secondaryBlock}`;
}

export function generateAgnosticWorkoutPrompt(profile: UserProfile, lang: 'fa' | 'en' = 'fa'): string {
  // Format body metrics
  const basicInfo = [
    `Name: ${profile.name || 'User'}`,
    `Age: ${profile.age || 26} years old`,
    `Sex / Biological: ${profile.sex}`,
    `Height: ${profile.height || 178} ${profile.heightUnit}`,
    `Weight: ${profile.weight || 75} ${profile.weightUnit}`,
  ].join(' | ');

  // Calculate BMI & Physique Context
  const heightM = (profile.height || 178) / 100;
  const weightKg = profile.weight || 75;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  // Format measurements if provided
  const measurementsList: string[] = [];
  if (profile.measurements?.waistCm) measurementsList.push(`Waist: ${profile.measurements.waistCm}cm`);
  if (profile.measurements?.chestCm) measurementsList.push(`Chest: ${profile.measurements.chestCm}cm`);
  if (profile.measurements?.hipsCm) measurementsList.push(`Hips: ${profile.measurements.hipsCm}cm`);
  if (profile.measurements?.neckCm) measurementsList.push(`Neck: ${profile.measurements.neckCm}cm`);
  if (profile.measurements?.armCm) measurementsList.push(`Arms: ${profile.measurements.armCm}cm`);
  if (profile.measurements?.thighCm) measurementsList.push(`Thighs: ${profile.measurements.thighCm}cm`);

  // Format priority muscles
  const hasPriorityMuscles = profile.priorityMuscles && profile.priorityMuscles.length > 0;
  const rankedMuscles = hasPriorityMuscles 
    ? profile.priorityMuscles.join(' > ') 
    : 'Balanced full body distribution';

  // Format equipment
  const allEquipment = [
    ...(profile.availableEquipment || []),
    ...(profile.customEquipment || [])
  ];
  const equipmentString = allEquipment.length > 0 
    ? allEquipment.join(', ') 
    : 'Full Commercial Gym equipment';

  // PRs if known
  const prsList: string[] = [];
  if (profile.knownPRs?.benchPressKg) prsList.push(`Bench Press 1RM: ${profile.knownPRs.benchPressKg}kg`);
  if (profile.knownPRs?.squatKg) prsList.push(`Squat 1RM: ${profile.knownPRs.squatKg}kg`);
  if (profile.knownPRs?.deadliftKg) prsList.push(`Deadlift 1RM: ${profile.knownPRs.deadliftKg}kg`);
  if (profile.knownPRs?.overheadPressKg) prsList.push(`OHP 1RM: ${profile.knownPRs.overheadPressKg}kg`);

  // Preferred days mapping strictly adhering to Iranian calendar (Week starts Saturday = روز اول شنبه)
  const defaultIranianDays = profile.daysPerWeek === 6
    ? ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه']
    : profile.daysPerWeek === 5
    ? ['شنبه', 'یک‌شنبه', 'دوشنبه', 'چهارشنبه', 'پنج‌شنبه']
    : profile.daysPerWeek === 4
    ? ['شنبه', 'یک‌شنبه', 'سه‌شنبه', 'چهارشنبه']
    : ['شنبه', 'دوشنبه', 'چهارشنبه'];

  const rawPreferred = profile.preferredDays && profile.preferredDays.length > 0
    ? profile.preferredDays
    : defaultIranianDays;

  // Normalize all preferred days to Persian Iranian calendar names
  const preferredDaysList = rawPreferred.map(d => {
    const norm = normalizeDayString(d);
    const found = WEEKDAYS_PERSIAN_ORDER.find(w => w.id === norm);
    return found ? found.nameFa : d;
  });

  const scheduleDays = preferredDaysList.join('، ');

  // Nutrition context if provided
  let nutritionBlock = '';
  if (profile.nutrition) {
    const nutParts: string[] = [];
    if (profile.nutrition.approximateCalories) nutParts.push(`کالری روزانه تقریبی: ${profile.nutrition.approximateCalories} کیلوکالری`);
    if (profile.nutrition.proteinGrams) nutParts.push(`پروتئین روزانه: ${profile.nutrition.proteinGrams} گرم`);
    if (profile.nutrition.dietType) nutParts.push(`استراتژی تغذیه: ${profile.nutrition.dietType}`);
    if (profile.nutrition.dailyMealsCount) nutParts.push(`تعداد وعده‌ها: ${profile.nutrition.dailyMealsCount} وعده`);
    if (profile.nutrition.supplements && profile.nutrition.supplements.length > 0) {
      nutParts.push(`مکمل‌های مصرفی: ${profile.nutrition.supplements.join('، ')}`);
    }
    if (nutParts.length > 0) {
      nutritionBlock = `\n### اطلاعات وضعیت تغذیه و مکمل‌ها (زمینه تخصصی برای تناسب حجم تمرین):\n- ${nutParts.join('\n- ')}\n`;
    }
  }

  // Calculate Volume and Session parameters mathematically
  const isHighVolume = profile.volumePreference === 'high';
  const isLowVolume = profile.volumePreference === 'low';
  const days = profile.daysPerWeek;

  let targetSetsPerCompound = 4;
  let targetSetsPerIsolation = 3;
  let targetTotalSetsPerDay = 18;
  let splitArchitecture = '';
  let volumeRulesText = '';

  if (days <= 4) {
    // 4-Day Splits (e.g. Upper / Lower x2)
    splitArchitecture = 'تقسیم‌بندی ۴ روزه بالاتنه / پایین‌تنه (شنبه: بالاتنه A، یک‌شنبه: پایین‌تنه A، سه‌شنبه: بالاتنه B، چهارشنبه: پایین‌تنه B)';
    if (isHighVolume) {
      targetSetsPerCompound = 4;
      targetSetsPerIsolation = 4;
      targetTotalSetsPerDay = 22; // 20 - 22 total working sets per session across 5-6 exercises
      volumeRulesText = `
* پروتکل حجم بالای ۴ روزه (استاندارد مربیگری حرفه‌ای بدنسازی علمی - Brad Schoenfeld & Mike Israetel):
  - هدف: حداکثر هایپرتروفی برای ۴ روز تمرین در هفته با تأکید بر ست‌های باکیفیت.
  - تعداد حرکات در هر جلسه: دقیقاً ۵ تا ۶ حرکت (هرگز بیشتر از ۶ حرکت تجویز نشود تا خستگی سیستم عصبی مرکزی مانع کیفیت نشود).
  - مجموع ست‌های اصلی هر جلسه: ۲۰ تا ۲۲ ست کاری پرفشار.
  - سقف حجم هر عضله در هر جلسه: حداکثر ۷ تا ۹ ست کاری (رسیدن به ۱۶ تا ۱۸ ست هفتگی در دو جلسه).
  - ست‌های هر حرکت: ۴ ست کاری برای حرکات چندمفصلی پایه، ۳ تا ۴ ست برای تک‌مفصلی‌ها.`;
    } else if (isLowVolume) {
      targetSetsPerCompound = 3;
      targetSetsPerIsolation = 2;
      targetTotalSetsPerDay = 12; // 10 - 14 sets
      volumeRulesText = `
* پروتکل شدت بالا / حجم کم ۴ روزه (High Intensity / Low Volume):
  - تعداد حرکات: دقیقاً ۴ تا ۵ حرکت در هر جلسه.
  - مجموع ست‌های اصلی هر جلسه: ۱۰ تا ۱۴ ست کاری با حداکثر نزدیکی به ناتوانی (RIR 0-1).`;
    } else {
      targetSetsPerCompound = 4;
      targetSetsPerIsolation = 3;
      targetTotalSetsPerDay = 18; // 16 - 20 sets
      volumeRulesText = `
* پروتکل حجم متعادل ۴ روزه (استاندارد طلایی بالاتنه/پایین‌تنه):
  - تعداد حرکات: دقیقاً ۵ تا ۶ حرکت در هر جلسه.
  - مجموع ست‌های اصلی هر جلسه: ۱۶ تا ۲۰ ست کاری.
  - حجم هر عضله در هر جلسه: ۶ تا ۸ ست کاری (۱۲ تا ۱۶ ست هفتگی در مجموع دو جلسه).`;
    }
  } else {
    // 5-6 Day Splits (e.g. Push / Pull / Legs x2)
    splitArchitecture = days === 6 
      ? 'تقسیم‌بندی ۶ روزه Push / Pull / Legs (شنبه: پوش A، یک‌شنبه: پول A، دوشنبه: پا A، سه‌شنبه: پوش B، چهارشنبه: پول B، پنج‌شنبه: پا B، جمعه: استراحت)'
      : 'تقسیم‌بندی ۵ روزه تخصصی (شنبه: بالاتنه A، یک‌شنبه: پایین‌تنه A، دوشنبه: پوش، چهارشنبه: پول، پنج‌شنبه: پا)';
    if (isHighVolume) {
      targetSetsPerCompound = 3;
      targetSetsPerIsolation = 3;
      targetTotalSetsPerDay = 16; // 15 - 18 sets per session across 5 exercises
      volumeRulesText = `
* پروتکل ۶ روزه فرکانس و حجم بالا (Push / Pull / Legs x2):
  - تعداد روزهای تمرین: ۶ روز در هفته در تقویم رسمی ایران (شنبه تا پنج‌شنبه، جمعه استراحت).
  - تعداد حرکات در هر جلسه: دقیقاً ۵ حرکت (حداکثر ۶ حرکت). در اسپلیت ۶ روزه، حجم بالا از طریق فرکانس ۲ بار در هفته تأمین می‌شود نه بمباران بی‌رویه در یک روز.
  - مجموع ست‌های اصلی هر جلسه: ۱۵ تا ۱۸ ست کاری در هر جلسه (مجموعاً ۹۰ تا ۱۰۵ ست در کل هفته).
  - ست‌های هر حرکت: ۳ ست کاری پرفشار (حرکت اول چندمفصلی می‌تواند ۴ ست باشد).
  - سقف حجم هر عضله در هر جلسه: ۶ تا ۷ ست کاری، که با ۲ بار تکرار در هفته به ۱۲ تا ۱۴ ست بهینه می‌رسد.`;
    } else if (isLowVolume) {
      targetSetsPerCompound = 3;
      targetSetsPerIsolation = 2;
      targetTotalSetsPerDay = 11; // 10 - 12 sets
      volumeRulesText = `
* پروتکل ۶ روزه با حجم کمتر و شدت بالا:
  - تعداد حرکات: ۴ تا ۵ حرکت در هر جلسه.
  - مجموع ست‌های هر جلسه: ۱۰ تا ۱۲ ست کاری با تمرکز بر RIR 1 و کنترل منفی حرکت.`;
    } else {
      targetSetsPerCompound = 3;
      targetSetsPerIsolation = 3;
      targetTotalSetsPerDay = 15; // 14 - 16 sets
      volumeRulesText = `
* پروتکل استاندارد ۶ روزه علمی (PPL x2):
  - شنبه: پوش A (تمرکز سینه، بخش قدامی سرشانه و پشت‌بازو)
  - یک‌شنبه: پول A (تمرکز زیربغل، لت‌ها، کول و جلوبازو)
  - دوشنبه: پا A (تمرکز چهارسر ران، ساق و شکم - روز سوم هفته در ایران)
  - سه‌شنبه: پوش B (تمرکز بالای سینه، نشر جانب سرشانه و پشت‌بازو)
  - چهارشنبه: پول B (تمرکز ضخامت زیربغل، فیله، کول و جلوبازو - روز پنجم هفته)
  - پنج‌شنبه: پا B (تمرکز همسترینگ، باسن و ساق - روز ششم هفته)
  - جمعه: استراحت کامل و ریکاوری هفتگی
  - تعداد حرکات هر جلسه: ۵ حرکت با ۳ ست کاری برای هر حرکت.`;
    }
  }

  // Generate explicit day-by-day mapping schedule requirements for the prompt
  const explicitDaySchedulePlan = preferredDaysList.map((dayName, idx) => {
    let dayRole = '';
    if (days === 6) {
      const roles = [
        'پوش A (Push A: سینه، سرشانه، پشت‌بازو)',
        'پول A (Pull A: زیربغل، کول، جلوبازو)',
        'پا A (Legs A: چهارسر ران، ساق، شکم)',
        'پوش B (Push B: بالای سینه، سرشانه، پشت‌بازو)',
        'پول B (Pull B: ضخامت زیربغل، فیله، جلوبازو)',
        'پا B (Legs B: همسترینگ، باسن، ساق)'
      ];
      dayRole = roles[idx] || `جلسه ${idx + 1}`;
    }
    return `   * جلسه ${idx + 1}: day_id: "day_${idx + 1}"، ویژگی weekday حتماً و دقیقاً باید "${dayName}" باشد (محتوا: ${dayRole || `جلسه اختصاصی روز ${dayName}`})`;
  }).join('\n');

  // Working weight estimation guide based on trainee's personal stats
  const estimatedBenchWorkingKg = profile.knownPRs?.benchPressKg 
    ? Math.round(profile.knownPRs.benchPressKg * 0.78)
    : Math.round(weightKg * 0.75);
  const estimatedSquatWorkingKg = profile.knownPRs?.squatKg
    ? Math.round(profile.knownPRs.squatKg * 0.78)
    : Math.round(weightKg * 1.05);
  const estimatedDeadliftWorkingKg = profile.knownPRs?.deadliftKg
    ? Math.round(profile.knownPRs.deadliftKg * 0.8)
    : Math.round(weightKg * 1.15);
  const estimatedOhpWorkingKg = profile.knownPRs?.overheadPressKg
    ? Math.round(profile.knownPRs.overheadPressKg * 0.78)
    : Math.round(weightKg * 0.48);

  const goalDirectives = getGoalSpecificDirectives(profile.primaryGoal, profile.secondaryGoal);

  // Build the complete prompt text
  return `You are a World-Class Exercise Science Specialist, Olympic Strength & Conditioning Specialist (CSCS), and Pro Bodybuilding Coach. You operate under the strict scientific volume landmarks and evidence-based hypertrophy frameworks established by Dr. Mike Israetel (Renaissance Periodization), Dr. Brad Schoenfeld, and Eric Helms.

### MISSION OBJECTIVE:
Design a scientifically periodized, high-yield, and HYPER-PERSONALIZED workout program created with extreme precision specifically for ${profile.name || 'this trainee'}.
DO NOT output generic template workouts. Every single exercise selection, order, set count, rep range, and working weight MUST be mathematically derived from the trainee's unique biometric profile, goals, weak points, and constraints below.

prompt_version: ${PROMPT_VERSION}

### 1. TRAINEE ANTHROPOMETRICS & BIOMECHANICAL AUDIT:
- Trainee Name: ${profile.name || 'Athlete'}
- Demographics: ${basicInfo}
- Biomechanical Classification: BMI ${bmi} kg/m² (${profile.sex === 'female' ? 'Female' : 'Male'} physiology)
${measurementsList.length > 0 ? `- Circumferential Measurements: ${measurementsList.join(', ')}` : ''}
- Primary Training Goal: ${profile.primaryGoal} (Non-negotiable core objective)
${profile.secondaryGoal ? `- Secondary Training Goal: ${profile.secondaryGoal} (Synergistic layer)` : ''}
- Priority Weak-Point Muscles (Ranked): ${rankedMuscles}
- Training Experience Level: ${profile.experienceLevel.toUpperCase()} (${profile.experienceYears} years of lifting experience)
- Current Training Habit: ${profile.currentSessionsPerWeek} sessions/week, averaging ~${profile.avgSessionDurationMinutes} min/session
${profile.gymExperienceNotes ? `- Experience Background: ${profile.gymExperienceNotes}` : ''}
${profile.otherSportsExperience ? `- Other Athletic Disciplines: ${profile.otherSportsExperience}` : ''}
${prsList.length > 0 ? `- Established Personal Records (1RMs): ${prsList.join(', ')}` : ''}

### 2. CALCULATED WORKING WEIGHT PRESCRIPTION (MANDATORY NON-NULL TARGET WEIGHTS):
- SCIENTIFIC WEIGHT DERIVATION FOR THIS TRAINEE:
  * DO NOT leave "target_weight" as null! You MUST prescribe individualized numeric kilogram target weights for every exercise based on this trainee's ${weightKg}kg bodyweight, ${profile.experienceLevel} level, and reported strength landmarks.
  * Baseline Working Weight Benchmarks for ${profile.name || 'this trainee'}:
    - Heavy Barbell Bench Press working weight: ~${estimatedBenchWorkingKg} kg (6-8 reps)
    - Flat / Incline Dumbbell Press: ~${Math.round(estimatedBenchWorkingKg * 0.38)} kg per dumbbell (8-10 reps)
    - Barbell Squat / Leg Press: ~${estimatedSquatWorkingKg} kg barbell squat or ~${Math.round(estimatedSquatWorkingKg * 1.8)} kg on 45° leg press (6-8 reps)
    - Romanian Deadlift (RDL): ~${Math.round(estimatedSquatWorkingKg * 0.9)} kg (8-10 reps)
    - Conventional / Trap Bar Deadlift: ~${estimatedDeadliftWorkingKg} kg (5-6 reps)
    - Overhead Press (OHP): ~${estimatedOhpWorkingKg} kg (6-8 reps)
    - Lat Pulldowns / Cable Rows: ~${Math.round(estimatedBenchWorkingKg * 0.9)} kg (8-12 reps)
    - Dumbbell Lateral Raises: ~${Math.max(6, Math.round(weightKg * 0.12))} kg per hand (12-15 reps)
    - Bicep Curls / Tricep Pushdowns: ~${Math.max(10, Math.round(weightKg * 0.18))} kg dumbbells or ~${Math.round(weightKg * 0.32)} kg cable (10-12 reps)
    - Calves / Abs: calibrate appropriately for machines or mark null ONLY if purely bodyweight.

### 3. WEAK-POINT PRIORITY MUSCLE OVERLOAD (MANDATORY):
${hasPriorityMuscles ? `- PRIORITY SPECIALIZATION RULE:
  * The trainee designated [${profile.priorityMuscles.join(', ')}] as their top priority muscles!
  * In every workout containing these muscle groups, place them as EXERCISE #1 OR #2 when neuromuscular freshness and central motor drive are at 100%.
  * Prescribe 16 to 20 total weekly working sets for [${profile.priorityMuscles.join(', ')}], while non-priority muscles receive maintenance volume (10-12 weekly sets).
  * In the exercise "notes", explicitly document how the exercise targets the trainee's priority muscle.` : '- Trainee requested balanced full-body hypertrophy with equal volume distribution across major muscle groups.'}

### 4. GOAL-DIRECTED PERIODIZATION DIRECTIVES:
${goalDirectives}

### 5. EXACT SCHEDULE & CALENDAR WEEKDAY BINDING (MANDATORY):
- Target Sessions Per Week: ${profile.daysPerWeek} days
- Split Architecture: ${splitArchitecture}
- Trainee's Designated Training Days: ${scheduleDays}
- EXACT WEEKDAY ASSIGNMENT REQUIREMENT:
${explicitDaySchedulePlan}
* STRICT RULE: The "weekday" property for each day MUST EXACTLY match the trainee's designated days above! DO NOT output consecutive days or generic "Day 1" strings.

### 6. CRITICAL SAFETY & INJURY CONSTRAINTS:
${profile.hasInjuries 
  ? `- Active Limitations / Injuries: ${profile.injuryLocations.join(', ') || 'Reported'}. Details: ${profile.injuryDescription || 'Exercise caution'}`
  : '- Active Limitations / Injuries: None reported.'}
- FORBIDDEN EXERCISES (STRICTLY PROHIBITED - NEVER INCLUDE): ${profile.forbiddenExercises.length > 0 ? profile.forbiddenExercises.join(', ') : 'None'}
- Exercises to Avoid / Disliked: ${profile.dislikedExercises.length > 0 ? profile.dislikedExercises.join(', ') : 'None'}
- Movements Requiring Caution: ${profile.cautionExercises.length > 0 ? profile.cautionExercises.join(', ') : 'None'}
- Preferred Exercises (Prioritize when biomechanically sound): ${profile.preferredExercises.length > 0 ? profile.preferredExercises.join(', ') : 'Standard evidence-based exercises'}
* BIOMECHANICAL SHIELD: If the trainee reported joint issues (e.g. Lower Back, Shoulders, Knees), replace spinal axial compression and shoulder impingement movements with supported machines, cables, or dumbbells (e.g. Chest-Supported T-Bar Row instead of Bent-Over Barbell Row, Neutral-Grip DB Press instead of straight barbell). Document this in the exercise notes.

### 7. EQUIPMENT & LOGISTICS:
- Available Equipment: ${equipmentString} (DO NOT prescribe equipment outside this list!)
- Target Session Duration: ${profile.sessionDurationMinutes} minutes
- Advanced Techniques Permitted:
  * Supersets: ${profile.allowSupersets ? 'YES (use superset_group tags like "A" or "B")' : 'NO'}
  * Drop Sets: ${profile.allowDropSets ? 'YES (on final isolation set)' : 'NO'}
  * Rest-Pause Sets: ${profile.allowRestPause ? 'YES (where appropriate)' : 'NO'}
  * Proximity to Failure: ${profile.trainingToFailure.toUpperCase()}
${nutritionBlock}
### 8. VOLUME ALLOCATION MATHEMATICS (ELITE COACH STANDARDS):
${volumeRulesText}
- Session Exercise Count: STRICTLY 4 TO 6 EXERCISES PER SESSION.
- Per-Muscle Session Ceiling: MAXIMUM 6 TO 10 WORKING SETS per muscle per workout to avoid "junk volume".
- Rep Cadence (Tempo): Prescribe a controlled 2-3s eccentric phase (e.g. "3-0-1-0" or "2-1-1-0") on every exercise.

### 9. STRICT OUTPUT CONTRACT (NON-NEGOTIABLE):
1. The response MUST be ONLY a single valid JSON object strictly matching schema_version "1.0".
2. ABSOLUTELY NO MARKDOWN WRAPPER: DO NOT start with \`\`\`json or end with \`\`\`. Start immediately with { and end with }.
3. NO PREAMBLE, NO EXPLANATION, NO PLEASANTRIES, NO APOLOGIES.
4. "sets" MUST BE AN INTEGER (e.g. ${targetSetsPerCompound} or ${targetSetsPerIsolation}, NOT a range).
5. "reps" MUST be an object with numeric "min" and "max" (e.g. { "min": 8, "max": 12 }) or an integer number.
6. "rest_seconds" MUST be an integer number of seconds (e.g. 90, 120, 180).
7. "target_weight" MUST be a realistic calculated number in kg (e.g. ${estimatedBenchWorkingKg}, ${Math.round(estimatedBenchWorkingKg * 0.38)}, ${estimatedSquatWorkingKg}), NOT null (except for pure bodyweight movements like chin-ups).
8. The JSON MUST include the "personalization_audit" block inside "program" detailing how this program was custom-tailored specifically for ${profile.name || 'this trainee'}.
9. CRITICAL IRANIAN CALENDAR & PERSIAN LANGUAGE RULES:
   - The application is NATIVE FOR IRAN with the week starting strictly on SATURDAY (شنبه = اول هفته).
   - In Iran: Saturday (شنبه = روز ۱), Sunday (یک‌شنبه = روز ۲), Monday (دوشنبه = روز ۳), Tuesday (سه‌شنبه = روز ۴), Wednesday (چهارشنبه = روز ۵), Thursday (پنج‌شنبه = روز ۶), Friday (جمعه = استراحت).
   - The "weekday" property for each day MUST be in Persian matching Iranian weekdays: "شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه".
   - In a 6-day program: Day 1 is Push A (شنبه), Day 2 is Pull A (یک‌شنبه), Day 3 is Legs A (دوشنبه), Day 4 is Push B (سه‌شنبه), Day 5 is Pull B (چهارشنبه), Day 6 is Legs B (پنج‌شنبه).
   - "name" and "name_fa" for EVERY exercise and day MUST be in standard professional Persian bodybuilding terminology (e.g. "پرس سینه هالتر", "زیربغل دمبل تک خم", "اسکات پا هالتر", "نشر جانب دمبل", "پشت بازو سیم‌کش").
   - "notes" must contain precise anatomical and tempo coaching cues in Persian.
   - BAN GENERIC TEMPLATES: Every exercise, set count, and weight must directly reflect this athlete's bodyweight (${weightKg}kg), weak points (${rankedMuscles}), and injury limitations.

### TARGET JSON SCHEMA:
{
  "schema_version": "1.0",
  "program": {
    "id": "program-${Date.now()}",
    "name": "برنامه تخصصی هایپرتروفی ${profile.name || 'ورزشکار'}",
    "name_fa": "برنامه تخصصی هایپرتروفی ${profile.name || 'ورزشکار'}",
    "description": "برنامه کاملاً اختصاصی و طراحی‌شده بر اساس مشخصات بیومتریک و اهداف ${profile.name || 'ورزشکار'}",
    "goal": ["${profile.primaryGoal}"${profile.secondaryGoal ? `, "${profile.secondaryGoal}"` : ''}],
    "duration_weeks": 8,
    "days_per_week": ${profile.daysPerWeek},
    "personalization_audit": {
      "trainee_name": "${profile.name || 'Athlete'}",
      "primary_goal_alignment": "توضیح علمی انطباق اسپلیت با هدف ${profile.primaryGoal}",
      "priority_muscle_protocol": "نحوه اولویت‌دهی به عضلات ضعیف (${rankedMuscles}) و قرارگیری در ابتدای جلسات",
      "injury_safeguards_applied": "اقدامات پیشگیرانه بیومکانیکی برای آسیب‌های گزارش‌شده (${profile.injuryLocations.join('، ') || 'بدون آسیب'})",
      "calculated_loads_summary": "محاسبه دقیق وزنه‌های کاری بر اساس وزن بدن ${weightKg} کیلوگرم و سطح تجربه"
    }
  },
  "user_context": {
    "age": ${profile.age || 26},
    "sex": "${profile.sex}",
    "height_cm": ${profile.height || 178},
    "weight_kg": ${profile.weight || 75},
    "experience_level": "${profile.experienceLevel}",
    "training_experience_years": ${profile.experienceYears}
  },
  "days": [
    {
      "day_id": "day_1",
      "name": "روز اول: پوش A (تمرکز سینه و عضلات اولویت‌دار)",
      "name_fa": "روز اول: پوش A (تمرکز سینه و سرشانه)",
      "weekday": "${preferredDaysList[0] || 'شنبه'}",
      "focus": ["Chest", "Shoulders", "Triceps"],
      "exercises": [
        {
          "exercise_id": "ex_1_1",
          "name": "پرس سینه هالتر (Barbell Bench Press)",
          "name_fa": "پرس سینه هالتر",
          "muscle_group": "Chest",
          "secondary_muscles": ["Triceps", "Shoulders"],
          "order": 1,
          "sets": ${targetSetsPerCompound},
          "reps": { "min": 6, "max": 8 },
          "target_weight": ${estimatedBenchWorkingKg},
          "rir": 2,
          "rpe": 8,
          "rest_seconds": 150,
          "tempo": "3-0-1-0",
          "equipment": "Barbell",
          "notes": "قوس ایمن کمر و ثبات کتف‌ها. کنترل ۳ ثانیه‌ای فاز منفی برای اعمال حداکثر تنش مکانیکی.",
          "superset_group": null,
          "warmup": { "sets": 2, "reps": 8, "target_weight": ${Math.round(estimatedBenchWorkingKg * 0.5)} }
        }
      ]
    }
  ]
}`;
}
