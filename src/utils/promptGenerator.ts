import { UserProfile } from '../types';

export const PROMPT_VERSION = "1.0";

// Formulate deep scientific guidance based on Primary & Secondary Goals
function getGoalSpecificDirectives(primaryGoal: string, secondaryGoal?: string): string {
  const goalDescriptions: Record<string, string> = {
    'Muscle Hypertrophy': `
- PRIMARY GOAL DIRECTIVE (HYPERTROPHY / عضله‌سازی):
  * Physiological Driver: Maximize mechanical tension through full active range of motion, coupled with targeted metabolic accumulation.
  * Loading Spectrum: 6-12 rep core window (8-10 reps for compound prime movers, 10-15 reps for stable machine/cable isolations).
  * Weekly Muscle Volume: 14-22 weekly working sets for priority muscles, distributed across 2 weekly exposures.
  * Tempo & Contraction: 3-0-1-0 tempo with a controlled 3-second eccentric phase to induce microtrauma without joint breakdown.
  * Proximity to Failure: RIR 1-2 on compounds, RIR 0-1 on isolation movements. Rest 2-3 min for compounds, 60-90s for accessories.`,

    'Strength Progression': `
- PRIMARY GOAL DIRECTIVE (STRENGTH PROGRESSION / افزایش قدرت و رکورد):
  * Physiological Driver: Neural adaptation, high-threshold motor unit recruitment, and intermuscular coordination.
  * Loading Spectrum: Heavy compound movements (Squat, Bench Press, Deadlift, Overhead Press, Weighted Pull-Up) programmed in 3-6 rep ranges at RPE 8-9 (RIR 2-3).
  * Rest Intervals: Generous 3 to 5 minutes between heavy sets to allow complete phosphocreatine (PCr) replenishment and central nervous system recovery.
  * Periodization: Linear or undulating progression on main lifts; accessories programmed strictly to eliminate biomechanical sticking points.`,

    'Fat Loss & Definition': `
- PRIMARY GOAL DIRECTIVE (FAT LOSS & CUTTING / کاهش چربی و کات):
  * Physiological Driver: Retain lean contractile muscle tissue during a caloric deficit while maximizing training density and metabolic expenditure.
  * Loading Spectrum: Maintain heavy compound loads (6-10 reps) to signal muscle retention to the nervous system; combine accessories into non-competing antagonist supersets.
  * Rest Intervals: Structured 45-75 seconds to maintain elevated metabolic rate and cardiovascular demand without compromising technical form.
  * Fatigue Management: Avoid excessive empty junk volume that compromises recovery capacity under restricted nutrition.`,

    'Endurance & Stamina': `
- PRIMARY GOAL DIRECTIVE (MUSCULAR ENDURANCE / استقامت عضلانی):
  * Physiological Driver: Mitochondrial density, capillary proliferation, and enhanced lactate clearance.
  * Loading Spectrum: 15-25+ reps per set with short rest periods (30-45 seconds).
  * Methods: Incorporate rest-pause sets, ascending rep ladders, and continuous tension techniques.`,

    'Functional Fitness & Mobility': `
- PRIMARY GOAL DIRECTIVE (FUNCTIONAL & MOBILITY / آمادگی جسمانی و تحرک):
  * Physiological Driver: Multi-planar stability (sagittal, frontal, transverse), unilateral balance, and rotational power.
  * Movement Selection: Prioritize unilateral movements (Bulgarian split squats, single-arm DB rows), loaded carries, core anti-rotation, and multi-joint transitions.
  * Loading Spectrum: 8-15 reps with deliberate end-range control and dynamic mobility warmups.`,

    'Joint Health & Rehabilitation': `
- PRIMARY GOAL DIRECTIVE (JOINT HEALTH & LONGEVITY / سلامت مفاصل):
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
    `Age: ${profile.age} years old`,
    `Sex / Biological: ${profile.sex}`,
    `Height: ${profile.height} ${profile.heightUnit}`,
    `Weight: ${profile.weight} ${profile.weightUnit}`,
  ].join(' | ');

  // Format measurements if provided
  const measurementsList: string[] = [];
  if (profile.measurements.waistCm) measurementsList.push(`Waist: ${profile.measurements.waistCm}cm`);
  if (profile.measurements.chestCm) measurementsList.push(`Chest: ${profile.measurements.chestCm}cm`);
  if (profile.measurements.hipsCm) measurementsList.push(`Hips: ${profile.measurements.hipsCm}cm`);
  if (profile.measurements.neckCm) measurementsList.push(`Neck: ${profile.measurements.neckCm}cm`);
  if (profile.measurements.armCm) measurementsList.push(`Arms: ${profile.measurements.armCm}cm`);
  if (profile.measurements.thighCm) measurementsList.push(`Thighs: ${profile.measurements.thighCm}cm`);

  // Format priority muscles
  const rankedMuscles = profile.priorityMuscles.length > 0 
    ? profile.priorityMuscles.join(' > ') 
    : 'Balanced full body distribution';

  // Format equipment
  const allEquipment = [
    ...profile.availableEquipment,
    ...(profile.customEquipment || [])
  ];
  const equipmentString = allEquipment.length > 0 
    ? allEquipment.join(', ') 
    : 'Full Commercial Gym equipment';

  // PRs if known
  const prsList: string[] = [];
  if (profile.knownPRs?.benchPressKg) prsList.push(`Bench Press: ${profile.knownPRs.benchPressKg}kg`);
  if (profile.knownPRs?.squatKg) prsList.push(`Squat: ${profile.knownPRs.squatKg}kg`);
  if (profile.knownPRs?.deadliftKg) prsList.push(`Deadlift: ${profile.knownPRs.deadliftKg}kg`);
  if (profile.knownPRs?.overheadPressKg) prsList.push(`OHP: ${profile.knownPRs.overheadPressKg}kg`);

  // Preferred days
  const scheduleDays = profile.preferredDays.length > 0 
    ? profile.preferredDays.join(', ') 
    : `${profile.daysPerWeek} flexible sessions per week`;

  // Nutrition context if provided
  let nutritionBlock = '';
  if (profile.nutrition) {
    const nutParts: string[] = [];
    if (profile.nutrition.approximateCalories) nutParts.push(`Approx Calories: ${profile.nutrition.approximateCalories} kcal`);
    if (profile.nutrition.proteinGrams) nutParts.push(`Daily Protein: ${profile.nutrition.proteinGrams}g`);
    if (profile.nutrition.dietType) nutParts.push(`Diet Strategy: ${profile.nutrition.dietType}`);
    if (profile.nutrition.dailyMealsCount) nutParts.push(`Meals/Day: ${profile.nutrition.dailyMealsCount}`);
    if (profile.nutrition.supplements && profile.nutrition.supplements.length > 0) {
      nutParts.push(`Supplements: ${profile.nutrition.supplements.join(', ')}`);
    }
    if (nutParts.length > 0) {
      nutritionBlock = `\n### NUTRITIONAL CONTEXT (Context only - no medical advice required):\n- ${nutParts.join('\n- ')}\n`;
    }
  }

  // Calculate Volume and Session parameters mathematically
  const isHighVolume = profile.volumePreference === 'high';
  const isLowVolume = profile.volumePreference === 'low';
  const days = profile.daysPerWeek;

  let targetSetsPerCompound = 4;
  let targetSetsPerIsolation = 3;
  let targetTotalSetsPerDay = 18;
  let targetWeeklySetsPerPriorityMuscle = 16;
  let splitArchitecture = '';
  let volumeRulesText = '';

  if (days <= 4) {
    // 4-Day Splits (e.g. Upper / Lower x2 or Torso / Limbs)
    splitArchitecture = '4-Day Split (Upper A, Lower A, Rest, Upper B, Lower B, Rest, Rest)';
    if (isHighVolume) {
      targetSetsPerCompound = 4;
      targetSetsPerIsolation = 4;
      targetTotalSetsPerDay = 22; // 20 - 24 total working sets per session across 5-6 exercises
      targetWeeklySetsPerPriorityMuscle = 18; // 16 - 20 sets/week
      volumeRulesText = `
* 4-DAY HIGH VOLUME PROTOCOL (SCIENTIFIC PRO BODYBUILDING COACH STANDARD):
  - Trainee Selection: 4 DAYS PER WEEK with HIGH VOLUME ("تعداد ست‌های بیشتر").
  - COACH SCIENTIFIC FOUNDATION (DR. MIKE ISRAETEL / BRAD SCHOENFELD MAV PRINCIPLES):
    • Number of Exercises Per Session: EXACTLY 5 TO 6 EXERCISES (NEVER more than 6 exercises; pro coaches never prescribe 7+ exercises as CNS fatigue and motor unit recruitment degrade rapidly).
    • Total Working Sets Per Session: 20 TO 22 TOTAL WORKING SETS PER WORKOUT.
    • Per-Muscle Single-Session Ceiling: MAXIMUM 7 TO 9 WORKING SETS per muscle group per session (e.g., 2 chest exercises totaling 8 sets). Hitting each muscle twice weekly (Upper A + Upper B) yields 16 to 18 weekly sets (the scientifically proven Maximum Adaptive Volume / MAV sweet spot).
    • Sets Per Exercise: 4 working sets on primary compound lifts, 3 to 4 working sets on secondary compound and isolation movements.
    • STRICT AVOIDANCE OF JUNK VOLUME: No exercise should have fewer than 3 sets or more than 4-5 sets. Every set must be executed with high mechanical tension and RIR 1-2.`;
    } else if (isLowVolume) {
      targetSetsPerCompound = 3;
      targetSetsPerIsolation = 2;
      targetTotalSetsPerDay = 12; // 10 - 14 sets
      targetWeeklySetsPerPriorityMuscle = 10;
      volumeRulesText = `
* 4-DAY LOW VOLUME / HIGH INTENSITY PROTOCOL (DORIAN YATES / HEAVY DUTY INFLUENCED):
  - Number of Exercises: EXACTLY 4 TO 5 EXERCISES PER SESSION.
  - TARGET TOTAL SETS PER SESSION: 10 to 14 total working sets.
  - SETS PER EXERCISE: 2 to 3 sets taken to extreme proximity to failure (RIR 0-1) with maximal eccentric control.`;
    } else {
      targetSetsPerCompound = 4;
      targetSetsPerIsolation = 3;
      targetTotalSetsPerDay = 18; // 16 - 20 sets
      targetWeeklySetsPerPriorityMuscle = 14;
      volumeRulesText = `
* 4-DAY BALANCED VOLUME PROTOCOL (GOLD STANDARD UPPER/LOWER SPLIT):
  - Number of Exercises: EXACTLY 5 TO 6 EXERCISES PER SESSION.
  - TARGET TOTAL SETS PER SESSION: 16 to 20 total working sets (e.g. 5-6 exercises x 3-4 sets).
  - Per-Muscle Session Volume: 6 to 8 working sets per muscle group per workout (12-16 weekly sets over the 2 weekly exposures).`;
    }
  } else {
    // 5-6 Day Splits (e.g. Push / Pull / Legs x2 or Arnold Split)
    splitArchitecture = days === 6 
      ? '6-Day Push / Pull / Legs Split (Push A, Pull A, Legs A, Push B, Pull B, Legs B, Rest)'
      : '5-Day Split (Upper / Lower / Push / Pull / Legs)';
    if (isHighVolume) {
      targetSetsPerCompound = 3;
      targetSetsPerIsolation = 3;
      targetTotalSetsPerDay = 16; // 15 - 18 sets per session across 5 exercises
      targetWeeklySetsPerPriorityMuscle = 18;
      volumeRulesText = `
* 6-DAY HIGH VOLUME & HIGH FREQUENCY PROTOCOL (ELITE PUSH/PULL/LEGS x2):
  - Trainee Selection: ${days} DAYS PER WEEK with HIGH VOLUME ("تعداد ست‌های بیشتر").
  - COACH SCIENTIFIC FOUNDATION (RP VOLUME LANDMARKS & HIGH-FREQUENCY DISTRIBUTION):
    • Number of Exercises Per Session: STRICTLY 5 EXERCISES (maximum 6). Pro coaches know that in a 6-day split, high volume is accumulated through FREQUENCY, not by exhausting a muscle with 10 exercises in one day.
    • Total Working Sets Per Session: 15 TO 18 TOTAL WORKING SETS PER WORKOUT (yielding 90 to 108 total sets per week across the 6 days!).
    • Sets Per Exercise: EXACTLY 3 WORKING SETS per exercise (with the primary compound primer optionally receiving 4 sets).
    • Per-Muscle Session Ceiling: MAXIMUM 6 TO 7 WORKING SETS per muscle per workout (e.g. 2 chest exercises x 3 sets = 6 sets on Push A, and 6 sets on Push B = 12-14 sets weekly). This respects the "Junk Volume" threshold and allows complete muscle protein synthesis recovery in 72 hours.`;
    } else if (isLowVolume) {
      targetSetsPerCompound = 3;
      targetSetsPerIsolation = 2;
      targetTotalSetsPerDay = 11; // 10 - 12 sets
      targetWeeklySetsPerPriorityMuscle = 10;
      volumeRulesText = `
* 6-DAY LOW VOLUME / HIGH FREQUENCY PROTOCOL:
  - Number of Exercises: EXACTLY 4 TO 5 EXERCISES.
  - TARGET TOTAL SETS PER SESSION: 10 to 12 total working sets.
  - SETS PER EXERCISE: 2 to 3 sets per exercise with RIR 1.`;
    } else {
      targetSetsPerCompound = 3;
      targetSetsPerIsolation = 3;
      targetTotalSetsPerDay = 15; // 14 - 16 sets
      targetWeeklySetsPerPriorityMuscle = 14;
      volumeRulesText = `
* 6-DAY STANDARD FREQUENCY PROTOCOL (PPL x2):
  - Number of Exercises: EXACTLY 5 EXERCISES PER SESSION.
  - TARGET TOTAL SETS PER SESSION: 14 to 16 total working sets.
  - SETS PER EXERCISE: 3 working sets per exercise (3 sets on compounds, 3 sets on accessories).`;
    }
  }

  const goalDirectives = getGoalSpecificDirectives(profile.primaryGoal, profile.secondaryGoal);

  // Build the complete prompt text
  return `You are a World-Class Exercise Science Specialist, Olympic Strength & Conditioning Specialist (CSCS), and Pro Bodybuilding Coach. You operate under the strict scientific volume landmarks and evidence-based hypertrophy frameworks established by Dr. Mike Israetel (Renaissance Periodization), Dr. Brad Schoenfeld, and Eric Helms.

### TASK:
Design a scientifically periodized, high-yield, hyper-personalized workout program adhering STRICTLY to the trainee's profile, constraints, biomechanics, and elite exercise science principles.

prompt_version: ${PROMPT_VERSION}

### TRAINEE PROFILE & BIOMECHANICAL ASSESSMENT:
- Basic Demographics: ${basicInfo}
${measurementsList.length > 0 ? `- Body Measurements: ${measurementsList.join(', ')}` : ''}
- Primary Training Goal: ${profile.primaryGoal}
${profile.secondaryGoal ? `- Secondary Training Goal: ${profile.secondaryGoal}` : ''}
- Target Muscle Hierarchy (Ranked by Priority): ${rankedMuscles}
- Training Experience Level: ${profile.experienceLevel.toUpperCase()} (${profile.experienceYears} years of lifting experience)
- Current Training Habit: ${profile.currentSessionsPerWeek} sessions/week, averaging ~${profile.avgSessionDurationMinutes} min/session
${profile.gymExperienceNotes ? `- Experience Background: ${profile.gymExperienceNotes}` : ''}
${profile.otherSportsExperience ? `- Other Athletic Disciplines: ${profile.otherSportsExperience}` : ''}
${prsList.length > 0 ? `- Established Personal Records (PRs): ${prsList.join(', ')}` : ''}

### CRITICAL GOAL-DIRECTED PERIODIZATION (MANDATORY):
${goalDirectives}

### SCHEDULE & VOLUME ALLOCATION MATHEMATICS (STRICT REQUIREMENT):
- Target Sessions Per Week: ${profile.daysPerWeek} days (${splitArchitecture})
- Scheduled / Preferred Days: ${scheduleDays}
- Target Session Duration: ${profile.sessionDurationMinutes} minutes
- Trainee Volume Preference: ${profile.volumePreference.toUpperCase()} (${isHighVolume ? 'تعداد ست‌های بیشتر / High Volume' : isLowVolume ? 'ست‌های کمتر / Low Volume' : 'متوسط / Moderate'})
- Target Intensity: ${profile.intensityPreference.toUpperCase()}
- Rep Range Preference: ${profile.repRangePreference}
- Default Rest Interval: ${profile.defaultRestSeconds} seconds
${volumeRulesText}

### CRITICAL SAFETY & INJURY CONSTRAINTS:
${profile.hasInjuries 
  ? `- Active Limitations / Injuries: ${profile.injuryLocations.join(', ') || 'Reported'}. Details: ${profile.injuryDescription || 'Exercise caution'}`
  : '- Active Limitations / Injuries: None reported.'}
- FORBIDDEN EXERCISES (NEVER include these): ${profile.forbiddenExercises.length > 0 ? profile.forbiddenExercises.join(', ') : 'None'}
- Exercises to Avoid / Disliked: ${profile.dislikedExercises.length > 0 ? profile.dislikedExercises.join(', ') : 'None'}
- Movements Requiring Caution: ${profile.cautionExercises.length > 0 ? profile.cautionExercises.join(', ') : 'None'}
- Preferred Exercises (Prioritize when biomechanically sound): ${profile.preferredExercises.length > 0 ? profile.preferredExercises.join(', ') : 'Standard evidence-based exercises'}
* IMPORTANT SAFETY PRINCIPLE: Do not diagnose medical conditions. Strictly adhere to the stated movement exclusions and provide safe joint-friendly alternatives.

### LOGISTICS & EQUIPMENT:
- Available Equipment: ${equipmentString}
- Schedule Flexibility: ${profile.isScheduleFlexible ? 'Flexible days permitted' : 'Strict fixed schedule'}
- Advanced Techniques Permitted:
  * Supersets: ${profile.allowSupersets ? 'YES (use superset_group tags like "A" or "B")' : 'NO'}
  * Drop Sets: ${profile.allowDropSets ? 'YES (for final isolation sets)' : 'NO'}
  * Rest-Pause Sets: ${profile.allowRestPause ? 'YES (where appropriate)' : 'NO'}
  * Proximity to Failure: ${profile.trainingToFailure.toUpperCase()}
${nutritionBlock}
### SCIENTIFIC EXERCISE SELECTION & VOLUME GUIDELINES (ELITE COACH MANDATE):
1. STRICT SESSION EXERCISE COUNT (4 TO 6 EXERCISES MAX):
   - Every workout session MUST contain EXACTLY 4 TO 6 EXERCISES (never fewer than 4, never more than 6).
   - Scientific reason: Neuromuscular efficiency, central drive, and motor unit recruitment decline steeply after 5-6 exercises. Professional bodybuilders train with maximum mechanical tension on 5-6 movements rather than accumulating fatigue over 8-10 diluted exercises.
2. PER-MUSCLE SESSION VOLUME CEILING (THE "JUNK VOLUME" RULE):
   - NEVER exceed 6 to 10 working sets for any single muscle group within a single session.
   - Any volume beyond 8-10 sets for the same muscle in one workout is physiologically confirmed to be "junk volume" (flatlined hypertrophic stimulus accompanied by disproportionate muscle damage and prolonged recovery).
   - Hypertrophy is maximized by distributing weekly volume (12-20 sets) across 2 exposures per week (e.g. 7 sets Chest on Upper A + 7 sets Chest on Upper B = 14 weekly sets - optimal MAV!).
3. MOVEMENT TIER HIERARCHY & EXERCISE SEQUENCING:
   - Tier 1 (Exercise 1): Heavy multi-joint compound primer (Squat, Bench Press, Barbell Row, Deadlift/RDL, OHP) - 3-4 working sets, 6-8 reps, RIR 2, 2-3 min rest, 3-0-1-0 tempo.
   - Tier 2 (Exercise 2): Complementary compound or high-stability machine/dumbbell movement - 3-4 working sets, 8-10 reps, RIR 1-2, 90-120s rest.
   - Tier 3 (Exercise 3): Stretch-mediated isolation targeting the lengthened position (e.g. Incline DB Curl, Romanian Deadlift, Cable Fly, Overhead Cable Triceps) - 3 working sets, 10-12 reps, RIR 1, 75-90s rest, 1s loaded stretch.
   - Tier 4 (Exercises 4-6): Metabolic stress & weak-point synergists (lateral delts, arms, calves, core) - 3-4 working sets, 12-15 reps (15-20 for calves), RIR 0-1, 60s rest, 1s peak contraction squeeze.
4. PROXIMITY TO FAILURE (RIR PRECISION):
   - Heavy axial spinal compound movements: RIR 1-2 (RPE 8-8.5). NEVER train heavy spinal loads to true failure (RIR 0) to eliminate injury risk.
   - Stable machine and cable isolations: RIR 0-1 (RPE 9-9.5) to recruit all high-threshold motor units safely.
5. TEMPO SPECIFICATION:
   - Every exercise must prescribe a controlled eccentric (negative) tempo of 2 to 3 seconds (e.g. "3-0-1-0" or "2-0-1-1") to maximize mechanical tension.
6. VOLUME ALLOCATION:
   - Each workout must contain approximately ${targetTotalSetsPerDay} total working sets, respecting the trainee's ${profile.volumePreference.toUpperCase()} volume preference!

### STRICT OUTPUT CONTRACT (NON-NEGOTIABLE):
1. The response MUST be ONLY a single valid JSON object strictly matching schema_version "1.0".
2. ABSOLUTELY NO MARKDOWN WRAPPER: DO NOT start with \`\`\`json or end with \`\`\`. Start immediately with { and end with }.
3. NO PREAMBLE, NO EXPLANATION, NO PLEASANTRIES, NO APOLOGIES.
4. "sets" MUST BE AN INTEGER (e.g. ${targetSetsPerCompound} or ${targetSetsPerIsolation}, NOT a range).
5. "reps" MUST be an object with numeric "min" and "max" (e.g. { "min": 8, "max": 12 }) or an integer number.
6. "rest_seconds" MUST be an integer number of seconds (e.g. 90, 120, 180).
7. Each day MUST have a unique "day_id" (e.g. "day_1", "day_2") and each exercise a unique "exercise_id" (e.g. "ex_1_1").
${lang === 'fa' ? `8. CRITICAL LANGUAGE REQUIREMENT FOR EXERCISE NAMES:
   - The user trains in PERSIAN (فارسی).
   - The "name" property for EVERY exercise MUST be in Persian (e.g. "پرس سینه هالتر", "اسکات از پشت با هالتر", "زیربغل دمبل تک خم", "نشر جانب دمبل", "پشت بازو سیم‌کش"). You may also include the English name in parentheses, e.g. "پرس سینه هالتر (Bench Press)".
   - Day names ("name") should be in Persian (e.g. "بالاتنه A (تمرکز سینه و زیربغل)").
   - "notes" and "description" should be provided in natural Persian so the trainee can read cues easily during the workout.` : ''}

### TARGET JSON SCHEMA:
{
  "schema_version": "1.0",
  "program": {
    "id": "program-unique-id",
    "name": "Descriptive Program Name",
    "description": "Scientific overview and rationale for this program",
    "goal": ["${profile.primaryGoal}"${profile.secondaryGoal ? `, "${profile.secondaryGoal}"` : ''}],
    "duration_weeks": 8,
    "days_per_week": ${profile.daysPerWeek}
  },
  "user_context": {
    "age": ${profile.age},
    "sex": "${profile.sex}",
    "height_cm": ${profile.height},
    "weight_kg": ${profile.weight},
    "experience_level": "${profile.experienceLevel}",
    "training_experience_years": ${profile.experienceYears}
  },
  "days": [
    {
      "day_id": "day_1",
      "name": "e.g. Upper Body Focus",
      "weekday": "e.g. Saturday",
      "focus": ["Chest", "Back", "Shoulders"],
      "exercises": [
        {
          "exercise_id": "ex_1_1",
          "name": "Exercise Name",
          "muscle_group": "Target Muscle",
          "secondary_muscles": ["Synergist 1"],
          "order": 1,
          "sets": ${targetSetsPerCompound},
          "reps": { "min": 8, "max": 12 },
          "target_weight": null,
          "rir": 2,
          "rpe": 8,
          "rest_seconds": 120,
          "tempo": "3-0-1-0",
          "equipment": "Barbell",
          "notes": "Coaching cue for safe and effective execution",
          "superset_group": null,
          "warmup": { "sets": 2, "reps": 8, "target_weight": null }
        }
      ]
    }
  ]
}`;
}
