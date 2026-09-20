import { UserProfile } from '../types';

export const PROMPT_VERSION = "1.0";

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

  // Build the complete prompt text
  return `You are an elite Exercise Science Specialist, Certified Strength and Conditioning Specialist (CSCS), and Biomechanics Expert.

### TASK:
Design a scientifically periodized, high-yield, hyper-personalized workout program adhering STRICTLY to the trainee's profile, constraints, and biomechanics.

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
- Target Sessions Per Week: ${profile.daysPerWeek} days
- Scheduled / Preferred Days: ${scheduleDays}
- Target Session Duration: ${profile.sessionDurationMinutes} minutes (The program volume must be realistic to complete within this timeframe)
- Schedule Flexibility: ${profile.isScheduleFlexible ? 'Flexible days permitted' : 'Strict fixed schedule'}

### PERIODIZATION & TRAINING PREFERENCES:
- Target Volume: ${profile.volumePreference.toUpperCase()}
- Target Intensity: ${profile.intensityPreference.toUpperCase()}
- Rep Range Preference: ${profile.repRangePreference}
- Default Rest Interval: ${profile.defaultRestSeconds} seconds
- Advanced Techniques Permitted:
  * Supersets: ${profile.allowSupersets ? 'YES (use superset_group tags like "A" or "B")' : 'NO'}
  * Drop Sets: ${profile.allowDropSets ? 'YES (for final isolation sets)' : 'NO'}
  * Rest-Pause Sets: ${profile.allowRestPause ? 'YES (where appropriate)' : 'NO'}
  * Proximity to Failure: ${profile.trainingToFailure.toUpperCase()}
${nutritionBlock}
### SCIENTIFIC EXERCISE SELECTION GUIDELINES:
1. Exercise Sequencing: Prioritize complex multi-joint compound movements first when central nervous system fatigue is low, followed by stable machines and isolated muscular contraction.
2. Volume Allocation: Ensure adequate weekly sets for priority muscles (${rankedMuscles}) without exceeding systemic recovery capacity (typically 10-20 weekly sets per muscle group).
3. Equipment Compliance: ONLY prescribe movements that can be performed with the stated available equipment (${equipmentString}).
4. Reps & RIR: Specify actionable Reps and Reps-In-Reserve (RIR usually 1-3 for compounds, 0-2 for isolations).

### STRICT OUTPUT CONTRACT (NON-NEGOTIABLE):
1. The response MUST be ONLY a single valid JSON object strictly matching schema_version "1.0".
2. ABSOLUTELY NO MARKDOWN WRAPPER: DO NOT start with \`\`\`json or end with \`\`\`. Start immediately with { and end with }.
3. NO PREAMBLE, NO EXPLANATION, NO PLEASANTRIES, NO APOLOGIES.
4. "sets" MUST BE AN INTEGER (e.g. 3 or 4, NOT "3-4" or "3").
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
    "goal": ["Primary Goal", "Secondary Goal"],
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
          "sets": 3,
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
