import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  AppSettings, 
  ExerciseLibraryItem, 
  LoggedExercise, 
  LoggedSet, 
  PersonalRecord, 
  ProgramDayJson, 
  PromptHistoryItem, 
  SubscriptionPlanId,
  SubscriptionState,
  UserProfile, 
  WorkoutProgramJson, 
  WorkoutSession 
} from '../types';
import { SAMPLE_WORKOUT_PROGRAM, SAMPLE_6DAY_PPL_PROGRAM } from '../data/sampleProgram';
import { INITIAL_EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { soundService } from '../utils/sound';
import { getExerciseName, getDayName } from '../utils/exerciseTranslation';

const STORAGE_KEY_PREFIX = 'fitprompt_ai_';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '',
  age: undefined,
  sex: 'male',
  height: undefined,
  heightUnit: 'cm',
  weight: undefined,
  weightUnit: 'kg',
  measurements: {
    waistCm: undefined,
    chestCm: undefined,
    armCm: undefined,
    thighCm: undefined
  },
  primaryGoal: 'Muscle Hypertrophy',
  secondaryGoal: 'Strength Progression',
  priorityMuscles: ['Chest', 'Back', 'Shoulders', 'Quadriceps', 'Hamstrings', 'Biceps', 'Triceps'],
  experienceYears: 1,
  experienceLevel: 'intermediate',
  currentSessionsPerWeek: 4,
  avgSessionDurationMinutes: 60,
  gymExperienceNotes: '',
  knownPRs: {},
  hasInjuries: false,
  injuryLocations: [],
  injuryDescription: '',
  forbiddenExercises: [],
  dislikedExercises: [],
  preferredExercises: [],
  cautionExercises: [],
  availableEquipment: [
    'Full Gym', 
    'Barbell', 
    'Dumbbell', 
    'Machine', 
    'Cable', 
    'Bench', 
    'Squat Rack', 
    'Pull-up Bar'
  ],
  customEquipment: [],
  daysPerWeek: 4,
  preferredDays: ['Saturday', 'Sunday', 'Tuesday', 'Wednesday'],
  sessionDurationMinutes: 60,
  preferredTimeOfDay: 'evening',
  isScheduleFlexible: false,
  volumePreference: 'moderate',
  intensityPreference: 'moderate',
  repRangePreference: 'hypertrophy_6_12',
  defaultRestSeconds: 90,
  allowSupersets: true,
  allowDropSets: false,
  allowRestPause: false,
  trainingToFailure: 'last_set_only',
  nutrition: {
    approximateCalories: undefined,
    proteinGrams: undefined,
    dietType: 'standard',
    dailyMealsCount: 3,
    supplements: []
  }
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'fa',
  exerciseNameLanguage: 'fa',
  weightUnit: 'kg',
  soundEnabled: true,
  vibrationEnabled: true,
  autoStartRestTimer: true,
  defaultRestSeconds: 90,
  notifications: {
    workoutReminder: true,
    scheduledWorkout: true,
    restTimerAlert: true,
    missedWorkout: true,
    weeklyProgress: true
  }
};

export const DEFAULT_SUBSCRIPTION: SubscriptionState = {
  isVip: false,
  planId: 'free',
  planNameFa: 'پلن پایه (رایگان)',
  expiresAt: null
};

interface AppContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateProfile: (updated: Partial<UserProfile>) => void;
  
  subscription: SubscriptionState;
  isVip: boolean;
  upgradeToVip: (planId: SubscriptionPlanId, orderDetails?: Partial<SubscriptionState>) => void;
  cancelVipSubscription: () => void;
  redeemActivationCode: (code: string) => { success: boolean; message: string };
  restoreVipPurchases: () => boolean;
  isProgramFree: (programId: string) => boolean;

  programs: WorkoutProgramJson[];
  activeProgramId: string | null;
  activeProgram: WorkoutProgramJson | null;
  importProgram: (program: WorkoutProgramJson, activate?: boolean) => void;
  activateProgram: (programId: string) => void;
  duplicateProgram: (programId: string) => void;
  deleteProgram: (programId: string) => void;
  exportProgramJson: (programId: string) => string;
  
  activeSession: WorkoutSession | null;
  startWorkoutSession: (dayId: string) => void;
  updateLoggedSet: (exerciseIndex: number, setIndex: number, updatedSet: Partial<LoggedSet>) => void;
  completeSet: (exerciseIndex: number, setIndex: number) => void;
  finishWorkoutSession: (notes?: string, rating?: number) => WorkoutSession | null;
  discardWorkoutSession: () => void;
  
  workoutHistory: WorkoutSession[];
  personalRecords: PersonalRecord[];
  
  exerciseLibrary: ExerciseLibraryItem[];
  addCustomExercise: (item: Omit<ExerciseLibraryItem, 'id' | 'isCustom'>) => void;
  
  promptHistory: PromptHistoryItem[];
  savePromptToHistory: (promptText: string, userSummary: string) => void;
  
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  
  onboardingCompleted: boolean;
  setOnboardingCompleted: (val: boolean) => void;

  resetAllData: () => void;

  restTimerSecondsRemaining: number | null;
  restTimerTotal: number;
  isRestTimerActive: boolean;
  startRestTimer: (seconds?: number) => void;
  pauseRestTimer: () => void;
  resumeRestTimer: () => void;
  adjustRestTimer: (delta: number) => void;
  skipRestTimer: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`);
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // 2. Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // 3. Onboarding State
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}onboarding`) === 'true';
  });

  const setOnboardingCompleted = (val: boolean) => {
    setOnboardingCompletedState(val);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}onboarding`, String(val));
  };

  // 4. Programs List State
  const [programs, setPrograms] = useState<WorkoutProgramJson[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}programs`);
      if (saved) {
        const parsed: WorkoutProgramJson[] = JSON.parse(saved);
        // Ensure both 4-day and 6-day sample programs are available if they haven't been loaded
        const has6Day = parsed.some(p => p.program.id === SAMPLE_6DAY_PPL_PROGRAM.program.id || p.program.days_per_week === 6);
        if (!has6Day) {
          return [...parsed, SAMPLE_6DAY_PPL_PROGRAM];
        }
        return parsed;
      }
      return [SAMPLE_WORKOUT_PROGRAM, SAMPLE_6DAY_PPL_PROGRAM];
    } catch {
      return [SAMPLE_WORKOUT_PROGRAM, SAMPLE_6DAY_PPL_PROGRAM];
    }
  });

  // 5. Active Program ID
  const [activeProgramId, setActiveProgramId] = useState<string | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}active_program_id`);
    return saved || SAMPLE_WORKOUT_PROGRAM.program.id;
  });

  // 6. Active Workout Session
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}active_session`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 7. Workout History (clean state - no mock/sample data)
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}history`);
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  // 8. Personal Records (clean state - no mock/sample data)
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}prs`);
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  // 9. Custom Exercises & Library
  const [customExercises, setCustomExercises] = useState<ExerciseLibraryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}custom_exercises`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 10. Prompt History
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}prompt_history`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 11. Cafe Bazaar Subscription & In-App Purchase State
  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}subscription`);
      if (saved) {
        const parsed: SubscriptionState = JSON.parse(saved);
        if (parsed.expiresAt) {
          const isExpired = new Date(parsed.expiresAt).getTime() < Date.now();
          if (isExpired) {
            return { ...DEFAULT_SUBSCRIPTION, planNameFa: 'پلن پایه (اشتراک منقضی شده)' };
          }
        }
        return parsed;
      }
      return DEFAULT_SUBSCRIPTION;
    } catch {
      return DEFAULT_SUBSCRIPTION;
    }
  });

  // 11. Rest Timer State
  const [restTimerSecondsRemaining, setRestTimerSecondsRemaining] = useState<number | null>(null);
  const [restTimerTotal, setRestTimerTotal] = useState<number>(90);
  const [isRestTimerActive, setIsRestTimerActive] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
    // Apply HTML direction, lang, and theme
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === 'fa' ? 'rtl' : 'ltr';
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}programs`, JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    if (activeProgramId) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}active_program_id`, activeProgramId);
    }
  }, [activeProgramId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}history`, JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}prs`, JSON.stringify(personalRecords));
  }, [personalRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}custom_exercises`, JSON.stringify(customExercises));
  }, [customExercises]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}prompt_history`, JSON.stringify(promptHistory));
  }, [promptHistory]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}active_session`, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}active_session`);
    }
  }, [activeSession]);

  // Rest Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRestTimerActive && restTimerSecondsRemaining !== null && restTimerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setRestTimerSecondsRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setIsRestTimerActive(false);
            if (settings.soundEnabled) soundService.playRestFinished();
            if (settings.vibrationEnabled && 'vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          if (prev <= 4 && prev > 1 && settings.soundEnabled) {
            soundService.playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRestTimerActive, restTimerSecondsRemaining, settings.soundEnabled, settings.vibrationEnabled]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const activeProgram = programs.find((p) => p.program.id === activeProgramId) || programs[0] || null;

  const importProgram = (program: WorkoutProgramJson, activate = true) => {
    setPrograms((prev) => {
      // If already exists with same id, replace it; else append
      const filtered = prev.filter((p) => p.program.id !== program.program.id);
      return [program, ...filtered];
    });
    if (activate) {
      setActiveProgramId(program.program.id);
    }
  };

  const activateProgram = (programId: string) => {
    setActiveProgramId(programId);
  };

  const duplicateProgram = (programId: string) => {
    const target = programs.find((p) => p.program.id === programId);
    if (!target) return;
    const newId = `prog_${Date.now()}`;
    const duplicated: WorkoutProgramJson = {
      ...target,
      program: {
        ...target.program,
        id: newId,
        name: `${target.program.name} (کپی)`,
        created_at: new Date().toISOString().split('T')[0]
      }
    };
    setPrograms((prev) => [duplicated, ...prev]);
  };

  const deleteProgram = (programId: string) => {
    setPrograms((prev) => {
      const remaining = prev.filter((p) => p.program.id !== programId);
      if (activeProgramId === programId && remaining.length > 0) {
        setActiveProgramId(remaining[0].program.id);
      }
      return remaining;
    });
  };

  const exportProgramJson = (programId: string): string => {
    const p = programs.find((item) => item.program.id === programId);
    return p ? JSON.stringify(p, null, 2) : '';
  };

  // Workout Tracker Operations
  const startWorkoutSession = (dayId: string) => {
    if (!activeProgram) return;
    const day = activeProgram.days.find((d) => d.day_id === dayId) || activeProgram.days[0];
    if (!day) return;

    const loggedExercises: LoggedExercise[] = day.exercises.map((ex) => {
      const targetRepsStr = typeof ex.reps === 'number' 
        ? String(ex.reps) 
        : `${ex.reps.min}-${ex.reps.max}`;
      
      const sets: LoggedSet[] = Array.from({ length: ex.sets }).map((_, idx) => ({
        setNumber: idx + 1,
        targetReps: targetRepsStr,
        targetWeightKg: ex.target_weight || null,
        targetRir: ex.rir || null,
        actualWeightKg: ex.target_weight || 0,
        actualReps: typeof ex.reps === 'number' ? ex.reps : ex.reps.min,
        actualRir: ex.rir ?? 2,
        actualRpe: ex.rpe ?? 8,
        isCompleted: false,
        isWarmup: idx === 0 && Boolean(ex.warmup),
        isDropSet: ex.drop_set && idx === ex.sets - 1,
        notes: ''
      }));

      const nameFa = ex.name_fa || getExerciseName(ex.name, 'fa', { exerciseId: ex.exercise_id });
      return {
        exerciseId: ex.exercise_id,
        name: ex.name,
        nameFa,
        muscleGroup: typeof ex.muscle_group === 'string' ? ex.muscle_group : 'Full Body',
        sets,
        notes: ex.notes || '',
        isCompleted: false
      };
    });

    const newSession: WorkoutSession = {
      id: `sess_${Date.now()}`,
      programId: activeProgram.program.id,
      programName: activeProgram.program.name,
      dayId: day.day_id,
      dayName: day.name,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises: loggedExercises,
      totalVolumeKg: 0,
      totalSets: 0,
      totalReps: 0,
      newPRsCount: 0
    };

    setActiveSession(newSession);
  };

  const updateLoggedSet = (exerciseIndex: number, setIndex: number, updatedSet: Partial<LoggedSet>) => {
    if (!activeSession) return;
    setActiveSession((prev) => {
      if (!prev) return null;
      const exercises = [...prev.exercises];
      const ex = { ...exercises[exerciseIndex] };
      const sets = [...ex.sets];
      sets[setIndex] = { ...sets[setIndex], ...updatedSet };
      ex.sets = sets;
      exercises[exerciseIndex] = ex;
      return { ...prev, exercises };
    });
  };

  const startRestTimer = (seconds?: number) => {
    const dur = seconds || settings.defaultRestSeconds;
    setRestTimerTotal(dur);
    setRestTimerSecondsRemaining(dur);
    setIsRestTimerActive(true);
  };

  const pauseRestTimer = () => setIsRestTimerActive(false);
  const resumeRestTimer = () => {
    if (restTimerSecondsRemaining && restTimerSecondsRemaining > 0) {
      setIsRestTimerActive(true);
    }
  };
  const adjustRestTimer = (delta: number) => {
    setRestTimerSecondsRemaining((prev) => {
      const current = prev ?? 0;
      const next = Math.max(0, current + delta);
      return next;
    });
  };
  const skipRestTimer = () => {
    setIsRestTimerActive(false);
    setRestTimerSecondsRemaining(null);
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    if (!activeSession) return;
    const currentSet = activeSession.exercises[exerciseIndex]?.sets[setIndex];
    if (!currentSet) return;

    const willBeCompleted = !currentSet.isCompleted;
    updateLoggedSet(exerciseIndex, setIndex, { isCompleted: willBeCompleted });

    if (willBeCompleted) {
      if (settings.soundEnabled) soundService.playSetComplete();
      if (settings.autoStartRestTimer) {
        // Look up exercise rest seconds or use default
        startRestTimer(settings.defaultRestSeconds);
      }
    }
  };

  const finishWorkoutSession = (notes?: string, rating?: number): WorkoutSession | null => {
    if (!activeSession) return null;

    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    const detectedPRs: PersonalRecord[] = [];

    activeSession.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.isCompleted) {
          totalSets += 1;
          totalReps += set.actualReps;
          const weight = set.actualWeightKg || 0;
          totalVolume += weight * set.actualReps;

          // PR check: weight PR
          const existingMaxWeight = personalRecords.find(
            (pr) => pr.exerciseName.toLowerCase() === ex.name.toLowerCase() && pr.metric === 'max_weight'
          );

          if (weight > 0 && (!existingMaxWeight || weight > existingMaxWeight.value)) {
            const exerciseFa = ex.nameFa || getExerciseName(ex.name, 'fa', { exerciseId: ex.exerciseId });
            detectedPRs.push({
              exerciseName: ex.name,
              exerciseNameFa: exerciseFa,
              metric: 'max_weight',
              value: weight,
              unit: 'kg',
              date: new Date().toISOString().split('T')[0],
              previousValue: existingMaxWeight?.value,
              workoutSessionId: activeSession.id
            });
          }
        }
      });
    });

    const endTime = new Date().toISOString();
    const durationSec = Math.max(
      60,
      Math.round((new Date(endTime).getTime() - new Date(activeSession.startTime).getTime()) / 1000)
    );

    const completedSession: WorkoutSession = {
      ...activeSession,
      endTime,
      durationSeconds: durationSec,
      totalVolumeKg: Math.round(totalVolume),
      totalSets,
      totalReps,
      newPRsCount: detectedPRs.length,
      personalRecords: detectedPRs,
      notes: notes || activeSession.notes || '',
      rating: rating || 5
    };

    if (detectedPRs.length > 0) {
      if (settings.soundEnabled) soundService.playPRFanfare();
      setPersonalRecords((prev) => [...detectedPRs, ...prev]);
    }

    setWorkoutHistory((prev) => [completedSession, ...prev]);
    setActiveSession(null);
    skipRestTimer();

    return completedSession;
  };

  const discardWorkoutSession = () => {
    setActiveSession(null);
    skipRestTimer();
  };

  const addCustomExercise = (item: Omit<ExerciseLibraryItem, 'id' | 'isCustom'>) => {
    const newItem: ExerciseLibraryItem = {
      ...item,
      id: `custom_ex_${Date.now()}`,
      isCustom: true
    };
    setCustomExercises((prev) => [newItem, ...prev]);
  };

  const savePromptToHistory = (promptText: string, userSummary: string) => {
    const newItem: PromptHistoryItem = {
      id: `prompt_${Date.now()}`,
      createdAt: new Date().toLocaleString(),
      promptText,
      version: '1.0',
      userSummary
    };
    setPromptHistory((prev) => [newItem, ...prev]);
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  // Subscription methods & validation
  const isVip = Boolean(subscription.isVip);

  const upgradeToVip = (planId: SubscriptionPlanId, orderDetails?: Partial<SubscriptionState>) => {
    let days = 30;
    let planName = 'اشتراک ۱ ماهه بازار';
    if (planId === 'vip_quarterly') {
      days = 90;
      planName = 'اشتراک ۳ ماهه بازار';
    } else if (planId === 'vip_yearly') {
      days = 365;
      planName = 'اشتراک ۱ ساله بازار';
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const updated: SubscriptionState = {
      isVip: true,
      planId,
      planNameFa: planName,
      purchaseDate: new Date().toISOString(),
      expiresAt: expiryDate.toISOString(),
      orderId: `bz_${Math.floor(100000 + Math.random() * 900000)}`,
      isAutoRenew: true,
      ...orderDetails
    };

    setSubscription(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}subscription`, JSON.stringify(updated));
    } catch {}
  };

  const cancelVipSubscription = () => {
    setSubscription(DEFAULT_SUBSCRIPTION);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}subscription`, JSON.stringify(DEFAULT_SUBSCRIPTION));
    } catch {}
  };

  const redeemActivationCode = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const validCodes = ['BAZAAR', 'BAZAAR2026', 'VIP', 'VIP2026', 'FITPRO', 'IRAN', 'PRO', 'BAZAR'];
    if (validCodes.includes(cleanCode)) {
      upgradeToVip('vip_yearly', {
        planNameFa: 'اشتراک طلایی نامحدود (کد بازار)',
        orderId: `bz_gift_${cleanCode}`
      });
      return { 
        success: true, 
        message: 'کد هدیه بازار با موفقیت تایید شد! دسترسی ویژه بازار برای شما فعال گردید.' 
      };
    }
    return { success: false, message: 'کد وارد شده نامعتبر است یا منقضی شده است.' };
  };

  const restoreVipPurchases = (): boolean => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}subscription`);
      if (saved) {
        const parsed: SubscriptionState = JSON.parse(saved);
        if (parsed.isVip) {
          setSubscription(parsed);
          return true;
        }
      }
    } catch {}
    return false;
  };

  const isProgramFree = (programId: string): boolean => {
    return (
      programId === SAMPLE_WORKOUT_PROGRAM.program.id ||
      programId === SAMPLE_6DAY_PPL_PROGRAM.program.id ||
      programId.startsWith('default_') ||
      programId.startsWith('sample_')
    );
  };

  const resetAllData = () => {
    setProfile(DEFAULT_USER_PROFILE);
    setWorkoutHistory([]);
    setPersonalRecords([]);
    setActiveSession(null);
    setPromptHistory([]);
    setCustomExercises([]);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}history`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}prs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}active_session`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}prompt_history`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}custom_exercises`);
  };

  const exerciseLibrary = [...INITIAL_EXERCISE_LIBRARY, ...customExercises];

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        subscription,
        isVip,
        upgradeToVip,
        cancelVipSubscription,
        redeemActivationCode,
        restoreVipPurchases,
        isProgramFree,
        programs,
        activeProgramId,
        activeProgram,
        importProgram,
        activateProgram,
        duplicateProgram,
        deleteProgram,
        exportProgramJson,
        activeSession,
        startWorkoutSession,
        updateLoggedSet,
        completeSet,
        finishWorkoutSession,
        discardWorkoutSession,
        workoutHistory,
        personalRecords,
        exerciseLibrary,
        addCustomExercise,
        promptHistory,
        savePromptToHistory,
        settings,
        updateSettings,
        onboardingCompleted,
        setOnboardingCompleted,
        resetAllData,
        restTimerSecondsRemaining,
        restTimerTotal,
        isRestTimerActive,
        startRestTimer,
        pauseRestTimer,
        resumeRestTimer,
        adjustRestTimer,
        skipRestTimer
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
