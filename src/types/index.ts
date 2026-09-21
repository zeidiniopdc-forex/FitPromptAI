/**
 * FitPrompt AI - Core TypeScript Types & JSON Schema Interfaces
 * Aligned with Android Data Models & Room Entities
 */

export type Language = 'fa' | 'en';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'in';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Sex = 'male' | 'female' | 'other';

export type MuscleGroup = 
  | 'Chest' 
  | 'Back' 
  | 'Shoulders' 
  | 'Biceps' 
  | 'Triceps' 
  | 'Forearms' 
  | 'Quadriceps' 
  | 'Hamstrings' 
  | 'Glutes' 
  | 'Calves' 
  | 'Abs' 
  | 'Cardio/Full Body';

export type EquipmentType = 
  | 'Full Gym' 
  | 'Barbell' 
  | 'Dumbbell' 
  | 'Machine' 
  | 'Cable' 
  | 'Smith Machine' 
  | 'Bench' 
  | 'Squat Rack' 
  | 'Resistance Bands' 
  | 'Pull-up Bar' 
  | 'Kettlebell'
  | 'Bodyweight';

export interface BodyMeasurements {
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  neckCm?: number;
  armCm?: number;
  thighCm?: number;
}

export interface UserProfile {
  name: string;
  age?: number;
  sex: Sex;
  height?: number;
  heightUnit: HeightUnit;
  weight?: number;
  weightUnit: WeightUnit;
  measurements: BodyMeasurements;
  
  // Goals
  primaryGoal: string;
  secondaryGoal?: string;
  priorityMuscles: MuscleGroup[];
  
  // Experience
  experienceYears: number;
  experienceLevel: ExperienceLevel;
  currentSessionsPerWeek: number;
  avgSessionDurationMinutes: number;
  gymExperienceNotes?: string;
  otherSportsExperience?: string;
  knownPRs?: {
    benchPressKg?: number;
    squatKg?: number;
    deadliftKg?: number;
    overheadPressKg?: number;
  };
  
  // Limitations & Injuries
  hasInjuries: boolean;
  injuryLocations: string[];
  injuryDescription?: string;
  forbiddenExercises: string[];
  dislikedExercises: string[];
  preferredExercises: string[];
  cautionExercises: string[];
  
  // Equipment
  availableEquipment: string[];
  customEquipment: string[];
  
  // Schedule
  daysPerWeek: number;
  preferredDays: string[];
  sessionDurationMinutes: number;
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  isScheduleFlexible: boolean;
  
  // Training Preferences
  volumePreference: 'low' | 'moderate' | 'high';
  intensityPreference: 'moderate' | 'high' | 'very_high';
  repRangePreference: 'strength_1_5' | 'hypertrophy_6_12' | 'endurance_12_20' | 'mixed';
  defaultRestSeconds: number;
  allowSupersets: boolean;
  allowDropSets: boolean;
  allowRestPause: boolean;
  trainingToFailure: 'never' | 'last_set_only' | 'frequently';
  
  // Nutrition context (optional)
  nutrition?: {
    approximateCalories?: number;
    proteinGrams?: number;
    dietType?: 'standard' | 'high_protein' | 'keto' | 'vegan' | 'vegetarian' | 'mediterranean';
    dailyMealsCount?: number;
    supplements?: string[];
  };
}

// ---------------- JSON Schema Contract Types ----------------

export interface RepsRange {
  min: number;
  max: number;
}

export interface WarmupConfig {
  sets: number;
  reps: number;
  target_weight?: number | null;
  notes?: string;
}

export interface ProgramExerciseJson {
  exercise_id: string;
  name: string;
  name_fa?: string;
  muscle_group: MuscleGroup | string;
  secondary_muscles?: string[];
  order: number;
  sets: number;
  reps: RepsRange | number;
  target_weight?: number | null;
  rir?: number | null; // Reps In Reserve (e.g. 1-3)
  rpe?: number | null; // Rate of Perceived Exertion (e.g. 7-10)
  rest_seconds: number;
  tempo?: string | null; // e.g. "3-0-1-0"
  equipment: string;
  notes?: string;
  superset_group?: string | null; // e.g. "A", "B"
  warmup?: boolean | WarmupConfig;
  drop_set?: boolean;
}

export interface ProgramDayJson {
  day_id: string;
  name: string;
  name_fa?: string;
  weekday?: string;
  focus: string[];
  exercises: ProgramExerciseJson[];
}

export interface ProgramMetadataJson {
  id: string;
  name: string;
  name_fa?: string;
  description?: string;
  goal: string[];
  duration_weeks: number;
  days_per_week: number;
  created_at?: string;
}

export interface ProgramUserContextJson {
  age?: number;
  sex?: string;
  height_cm?: number;
  weight_kg?: number;
  experience_level?: string;
  training_experience_years?: number;
}

export interface WorkoutProgramJson {
  schema_version: string; // e.g. "1.0"
  program: ProgramMetadataJson;
  user_context?: ProgramUserContextJson;
  days: ProgramDayJson[];
}

// ---------------- Validation Error Result ----------------

export interface ValidationErrorItem {
  field: string;
  error: string;
  location: string;
  suggestedFix: string;
}

export interface ValidationResult {
  isValid: boolean;
  schemaVersion?: string;
  errors: ValidationErrorItem[];
  warnings: string[];
}

// ---------------- Workout Tracking & Logging ----------------

export interface LoggedSet {
  setNumber: number;
  targetReps: string;
  targetWeightKg?: number | null;
  targetRir?: number | null;
  actualWeightKg: number;
  actualReps: number;
  actualRir?: number | null;
  actualRpe?: number | null;
  isCompleted: boolean;
  isWarmup?: boolean;
  isDropSet?: boolean;
  notes?: string;
  timestamp?: string;
}

export interface LoggedExercise {
  exerciseId: string;
  name: string;
  nameFa?: string;
  muscleGroup: string;
  sets: LoggedSet[];
  notes?: string;
  isCompleted: boolean;
}

export interface WorkoutSession {
  id: string;
  programId: string;
  programName: string;
  dayId: string;
  dayName: string;
  startTime: string; // ISO
  endTime?: string; // ISO
  durationSeconds: number;
  exercises: LoggedExercise[];
  totalVolumeKg: number;
  totalSets: number;
  totalReps: number;
  newPRsCount: number;
  personalRecords?: PersonalRecord[];
  notes?: string;
  rating?: number; // 1-5
}

export interface PersonalRecord {
  exerciseId?: string;
  exerciseName: string;
  exerciseNameFa?: string;
  metric: 'max_weight' | 'max_reps' | 'max_estimated_1rm' | 'max_volume';
  value: number;
  unit: string;
  date: string;
  previousValue?: number;
  workoutSessionId: string;
}

export interface ExerciseLibraryItem {
  id: string;
  nameEn: string;
  nameFa: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  movementPattern: 'Push' | 'Pull' | 'Squat' | 'Hinge' | 'Lunge' | 'Carry' | 'Isolation';
  instructionsEn: string;
  instructionsFa: string;
  isCustom?: boolean;
}

export interface PromptHistoryItem {
  id: string;
  createdAt: string;
  promptText: string;
  version: string;
  userSummary: string;
}

export type ThemeMode = 'dark' | 'light';

export type SubscriptionPlanId = 'free' | 'vip_monthly' | 'vip_quarterly' | 'vip_yearly';

export interface SubscriptionState {
  isVip: boolean;
  planId: SubscriptionPlanId;
  planNameFa: string;
  purchaseDate?: string;
  expiresAt?: string | null;
  orderId?: string;
  isAutoRenew?: boolean;
}

export interface AppSettings {
  theme: ThemeMode;
  language: Language;
  exerciseNameLanguage: 'en' | 'fa' | 'both';
  weightUnit: WeightUnit;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoStartRestTimer: boolean;
  defaultRestSeconds: number;
  notifications: {
    workoutReminder: boolean;
    scheduledWorkout: boolean;
    restTimerAlert: boolean;
    missedWorkout: boolean;
    weeklyProgress: boolean;
  };
}
