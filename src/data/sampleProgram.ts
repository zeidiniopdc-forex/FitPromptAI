import { WorkoutProgramJson } from '../types';

export const SAMPLE_WORKOUT_PROGRAM: WorkoutProgramJson = {
  schema_version: "1.0",
  program: {
    id: "prog_hyp_4day_001",
    name: "Hypertrophy & Strength 4-Day Split",
    name_fa: "برنامه تخصصی هایپرتروفی و قدرت ۴ روزه",
    description: "علمی و ساختاریافته بر پایه حجم بهینه و هایپرتروفی پیشرفته (Upper/Lower Split) همراه با مدیریت خستگی و پیشرفت بار",
    goal: ["Muscle Hypertrophy", "Strength Progression", "Improve Weak Points"],
    duration_weeks: 8,
    days_per_week: 4,
    created_at: "2026-09-19"
  },
  user_context: {
    age: 27,
    sex: "male",
    height_cm: 180,
    weight_kg: 78,
    experience_level: "intermediate",
    training_experience_years: 2.5
  },
  days: [
    {
      day_id: "day_upper_a",
      name: "Upper Body A (Chest & Back Focus)",
      name_fa: "بالاتنه A (تمرکز سینه و زیربغل)",
      weekday: "Saturday",
      focus: ["Chest", "Back", "Shoulders", "Arms"],
      exercises: [
        {
          exercise_id: "ex_bench_press",
          name: "Barbell Bench Press",
          name_fa: "پرس سینه هالتر",
          muscle_group: "Chest",
          secondary_muscles: ["Triceps", "Shoulders"],
          order: 1,
          sets: 4,
          reps: { min: 6, max: 8 },
          target_weight: 75,
          rir: 2,
          rpe: 8,
          rest_seconds: 150,
          tempo: "3-0-1-0",
          equipment: "Barbell",
          notes: "گرم‌کردن اختصاصی با ۲ ست سبک قبل از ست‌های اصلی. قوس ایمن کمر و حفظ سفتی کتف‌ها.",
          warmup: {
            sets: 2,
            reps: 10,
            target_weight: 40,
            notes: "افزایش جریان خون مفصل شانه"
          }
        },
        {
          exercise_id: "ex_barbell_row",
          name: "Barbell Bent-Over Row",
          name_fa: "زیربغل هالتر خم",
          muscle_group: "Back",
          secondary_muscles: ["Biceps", "Forearms"],
          order: 2,
          sets: 4,
          reps: { min: 8, max: 10 },
          target_weight: 65,
          rir: 2,
          rpe: 8,
          rest_seconds: 120,
          tempo: "2-1-1-1",
          equipment: "Barbell",
          notes: "تنه با زاویه ۴۵ درجه، تمرکز روی انقباض کامل لاتیسیموس و رترکشن کتف."
        },
        {
          exercise_id: "ex_incline_db_press",
          name: "Incline Dumbbell Press",
          name_fa: "پرس بالاسینه دمبل",
          muscle_group: "Chest",
          secondary_muscles: ["Shoulders", "Triceps"],
          order: 3,
          sets: 3,
          reps: { min: 8, max: 12 },
          target_weight: 24,
          rir: 1,
          rpe: 8.5,
          rest_seconds: 90,
          tempo: "2-0-1-0",
          equipment: "Dumbbell",
          notes: "شیب نیمکت حدود ۳۰ درجه، کنترل فاز منفی."
        },
        {
          exercise_id: "ex_lat_pulldown",
          name: "Lat Pulldown (Neutral Grip)",
          name_fa: "لت زیربغل دستگیره خنثی (مچ ممتد)",
          muscle_group: "Back",
          secondary_muscles: ["Biceps"],
          order: 4,
          sets: 3,
          reps: { min: 10, max: 12 },
          target_weight: 60,
          rir: 1,
          rpe: 8.5,
          rest_seconds: 90,
          tempo: "2-1-1-0",
          equipment: "Cable",
          notes: "کشش عمیق در بالا، انقباض قوی در پایین."
        },
        {
          exercise_id: "ex_cable_lateral_raise",
          name: "Cable Lateral Raise",
          name_fa: "نشر جانب سیم‌کش",
          muscle_group: "Shoulders",
          secondary_muscles: [],
          order: 5,
          sets: 3,
          reps: { min: 12, max: 15 },
          target_weight: 10,
          rir: 1,
          rpe: 9,
          rest_seconds: 60,
          tempo: "2-1-1-0",
          equipment: "Cable",
          notes: "سوپرست با جلو بازو طناب",
          superset_group: "A"
        },
        {
          exercise_id: "ex_cable_bicep_curl",
          name: "Cable Rope Biceps Curl",
          name_fa: "جلو بازو طناب سیم‌کش",
          muscle_group: "Biceps",
          secondary_muscles: ["Forearms"],
          order: 6,
          sets: 3,
          reps: { min: 10, max: 12 },
          target_weight: 20,
          rir: 1,
          rpe: 9,
          rest_seconds: 75,
          tempo: "2-0-1-1",
          equipment: "Cable",
          notes: "انتهای حرکت مچ‌ها به بیرون چرخانده شود.",
          superset_group: "A"
        }
      ]
    },
    {
      day_id: "day_lower_a",
      name: "Lower Body A (Quad & Glute Dominant)",
      name_fa: "پایین‌تنه A (تمرکز چهارسر و باسن)",
      weekday: "Sunday",
      focus: ["Quadriceps", "Glutes", "Hamstrings", "Calves", "Abs"],
      exercises: [
        {
          exercise_id: "ex_barbell_squat",
          name: "Barbell Back Squat",
          name_fa: "اسکات هالتر از پشت",
          muscle_group: "Quadriceps",
          secondary_muscles: ["Glutes", "Hamstrings"],
          order: 1,
          sets: 4,
          reps: { min: 6, max: 8 },
          target_weight: 90,
          rir: 2,
          rpe: 8,
          rest_seconds: 180,
          tempo: "3-1-1-0",
          equipment: "Barbell",
          notes: "عمق استاندارد با شکستن خط موازی ران. مهار نفس و فشار داخل شکمی (Bracing).",
          warmup: {
            sets: 2,
            reps: 8,
            target_weight: 50,
            notes: "گرم کردن سیستم عصبی و مفاصل زانو و لگن"
          }
        },
        {
          exercise_id: "ex_romanian_deadlift",
          name: "Romanian Deadlift (RDL)",
          name_fa: "ددلیفت رومانیایی با هالتر",
          muscle_group: "Hamstrings",
          secondary_muscles: ["Glutes", "Back"],
          order: 2,
          sets: 3,
          reps: { min: 8, max: 10 },
          target_weight: 80,
          rir: 2,
          rpe: 8,
          rest_seconds: 120,
          tempo: "3-0-1-0",
          equipment: "Barbell",
          notes: "کشش عمیق همسترینگ بدون خم شدن ستون فقرات کمری."
        },
        {
          exercise_id: "ex_leg_press",
          name: "45-Degree Leg Press",
          name_fa: "پرس پا ۴۵ درجه",
          muscle_group: "Quadriceps",
          secondary_muscles: ["Glutes"],
          order: 3,
          sets: 3,
          reps: { min: 10, max: 12 },
          target_weight: 140,
          rir: 1,
          rpe: 8.5,
          rest_seconds: 90,
          tempo: "2-0-1-0",
          equipment: "Machine",
          notes: "قفل نکردن کامل زانو در بالاترین نقطه."
        },
        {
          exercise_id: "ex_seated_leg_curl",
          name: "Seated Leg Curl",
          name_fa: "پشت پا نشسته دستگاه",
          muscle_group: "Hamstrings",
          secondary_muscles: [],
          order: 4,
          sets: 3,
          reps: { min: 12, max: 15 },
          target_weight: 45,
          rir: 1,
          rpe: 9,
          rest_seconds: 75,
          tempo: "2-1-1-0",
          equipment: "Machine",
          notes: "ست آخر دراپ ست با ۲۰٪ کاهش وزن.",
          drop_set: true
        },
        {
          exercise_id: "ex_standing_calf_raise",
          name: "Standing Calf Raise",
          name_fa: "ساق پا ایستاده دستگاه",
          muscle_group: "Calves",
          secondary_muscles: [],
          order: 5,
          sets: 4,
          reps: { min: 12, max: 15 },
          target_weight: 50,
          rir: 0,
          rpe: 9.5,
          rest_seconds: 60,
          tempo: "2-2-1-0",
          equipment: "Machine",
          notes: "توقف ۲ ثانیه در نقطه کشش پایینی."
        },
        {
          exercise_id: "ex_hanging_leg_raise",
          name: "Hanging Leg Raise",
          name_fa: "بالا کشیدن پا در حالت آویزان (زیرشکم بارفیکس)",
          muscle_group: "Abs",
          secondary_muscles: [],
          order: 6,
          sets: 3,
          reps: { min: 12, max: 15 },
          target_weight: null,
          rir: 1,
          rpe: 8.5,
          rest_seconds: 60,
          tempo: "2-0-1-0",
          equipment: "Pull-up Bar",
          notes: "چرخش لگن به بالا و جلوگیری از تاب خوردن."
        }
      ]
    },
    {
      day_id: "day_upper_b",
      name: "Upper Body B (Shoulder & Volume Focus)",
      name_fa: "بالاتنه B (تمرکز سرشانه و حجم)",
      weekday: "Tuesday",
      focus: ["Shoulders", "Back", "Chest", "Triceps"],
      exercises: [
        {
          exercise_id: "ex_overhead_press",
          name: "Overhead Barbell Press (OHP)",
          name_fa: "پرس سرشانه هالتر ایستاده",
          muscle_group: "Shoulders",
          secondary_muscles: ["Triceps", "Chest"],
          order: 1,
          sets: 4,
          reps: { min: 6, max: 8 },
          target_weight: 47.5,
          rir: 2,
          rpe: 8,
          rest_seconds: 150,
          tempo: "2-0-1-0",
          equipment: "Barbell",
          notes: "سفت نگه داشتن عضلات باسن و شکم حین پرس."
        },
        {
          exercise_id: "ex_weighted_pullup",
          name: "Pull-ups (or Lat Pulldown)",
          name_fa: "بارفیکس (یا لت زیربغل)",
          muscle_group: "Back",
          secondary_muscles: ["Biceps"],
          order: 2,
          sets: 4,
          reps: { min: 6, max: 10 },
          target_weight: null,
          rir: 1,
          rpe: 8.5,
          rest_seconds: 120,
          tempo: "2-1-1-0",
          equipment: "Pull-up Bar",
          notes: "دامنه حرکتی کامل، بدون جهش یا کیپینگ."
        },
        {
          exercise_id: "ex_flat_db_press",
          name: "Flat Dumbbell Bench Press",
          name_fa: "پرس سینه با دمبل روی میز صاف",
          muscle_group: "Chest",
          secondary_muscles: ["Triceps", "Shoulders"],
          order: 3,
          sets: 3,
          reps: { min: 8, max: 12 },
          target_weight: 26,
          rir: 1,
          rpe: 8.5,
          rest_seconds: 90,
          tempo: "3-0-1-0",
          equipment: "Dumbbell",
          notes: "تمرکز بر کشش عضلات سینه در انتهای مسیر."
        },
        {
          exercise_id: "ex_chest_supported_row",
          name: "Chest-Supported T-Bar or DB Row",
          name_fa: "زیربغل تی بار یا دمبل با تکیه‌گاه سینه",
          muscle_group: "Back",
          secondary_muscles: ["Shoulders", "Biceps"],
          order: 4,
          sets: 3,
          reps: { min: 10, max: 12 },
          target_weight: 35,
          rir: 1,
          rpe: 8.5,
          rest_seconds: 90,
          tempo: "2-1-1-0",
          equipment: "Machine",
          notes: "ایمن‌ترین شیوه برای ضخامت عضلات میانی پشت بدون فشار کمری."
        },
        {
          exercise_id: "ex_tricep_pushdown",
          name: "Cable Triceps Pushdown",
          name_fa: "پشت بازو سیم‌کش",
          muscle_group: "Triceps",
          secondary_muscles: [],
          order: 5,
          sets: 3,
          reps: { min: 10, max: 12 },
          target_weight: 25,
          rir: 1,
          rpe: 9,
          rest_seconds: 60,
          tempo: "2-0-1-1",
          equipment: "Cable",
          notes: "سوپرست با فیس‌پول شانه",
          superset_group: "B"
        },
        {
          exercise_id: "ex_cable_facepull",
          name: "Cable Face Pull",
          name_fa: "فیس پول طناب سیم‌کش",
          muscle_group: "Shoulders",
          secondary_muscles: ["Back"],
          order: 6,
          sets: 3,
          reps: { min: 12, max: 15 },
          target_weight: 20,
          rir: 1,
          rpe: 8.5,
          rest_seconds: 75,
          tempo: "2-1-1-1",
          equipment: "Cable",
          notes: "چرخش خارجی مفصل شانه برای سلامت روتاتور کاف و سر خلفی دلتوئید.",
          superset_group: "B"
        }
      ]
    },
    {
      day_id: "day_lower_b",
      name: "Lower Body B (Hamstring & Posterior Focus)",
      name_fa: "پایین‌تنه B (تمرکز همسترینگ و فیله)",
      weekday: "Wednesday",
      focus: ["Hamstrings", "Glutes", "Quadriceps", "Abs"],
      exercises: [
        {
          exercise_id: "ex_deadlift",
          name: "Conventional or Trap Bar Deadlift",
          name_fa: "ددلیفت استاندارد یا ترپ بار",
          muscle_group: "Back",
          secondary_muscles: ["Hamstrings", "Glutes"],
          order: 1,
          sets: 3,
          reps: { min: 5, max: 6 },
          target_weight: 110,
          rir: 2,
          rpe: 8,
          rest_seconds: 180,
          tempo: "2-1-1-0",
          equipment: "Barbell",
          notes: "انفجار حرکتی کنترل‌شده از زمین، ستون فقرات کاملاً خنثی.",
          warmup: {
            sets: 3,
            reps: 5,
            target_weight: 60,
            notes: "گرم کردن الگوی هیپ هینج"
          }
        },
        {
          exercise_id: "ex_bulgarian_split_squat",
          name: "Bulgarian Split Squat",
          name_fa: "اسکات بلغاری با دمبل",
          muscle_group: "Quadriceps",
          secondary_muscles: ["Glutes"],
          order: 2,
          sets: 3,
          reps: { min: 8, max: 10 },
          target_weight: 16,
          rir: 1,
          rpe: 9,
          rest_seconds: 90,
          tempo: "2-0-1-0",
          equipment: "Dumbbell",
          notes: "هر پا جداگانه، پای تکیه‌گاه محکم روی زمین."
        },
        {
          exercise_id: "ex_leg_extension",
          name: "Leg Extension",
          name_fa: "جلو پا دستگاه",
          muscle_group: "Quadriceps",
          secondary_muscles: [],
          order: 3,
          sets: 3,
          reps: { min: 12, max: 15 },
          target_weight: 50,
          rir: 0,
          rpe: 9.5,
          rest_seconds: 75,
          tempo: "2-1-1-0",
          equipment: "Machine",
          notes: "مکث ۱ ثانیه در بالاترین نقطه انقباض."
        },
        {
          exercise_id: "ex_cable_cable_crunch",
          name: "Cable Kneeling Crunch",
          name_fa: "کرانچ سیم‌کش زانو زده",
          muscle_group: "Abs",
          secondary_muscles: [],
          order: 4,
          sets: 3,
          reps: { min: 12, max: 15 },
          target_weight: 35,
          rir: 1,
          rpe: 9,
          rest_seconds: 60,
          tempo: "2-1-1-0",
          equipment: "Cable",
          notes: "خم کردن ستون فقرات با عضلات شکم و نه با مفاصل لگن."
        }
      ]
    }
  ]
};

export const SAMPLE_GENERATED_PROMPT: string = `You are a World-Class Exercise Science Specialist, Olympic Strength & Conditioning Coach, and Precision Workout Program Designer.

### TASK:
Generate a fully customized, evidence-based, scientifically periodized workout program based STRICTLY on the user assessment provided below. 

### USER PROFILE & ASSESSMENT:
- Name: علی
- Age: 27 | Sex: Male | Height: 180 cm | Weight: 78 kg
- Primary Goal: Muscle Hypertrophy
- Secondary Goal: Strength Progression
- Priority Target Muscles (Ranked): Chest, Back, Shoulders, Arms, Legs, Abs
- Experience Level: Intermediate (2.5 years of consistent weight training)
- Current Routine: 3-4 days/week, ~65 minutes/session
- Key Known PRs: Bench Press 85kg, Squat 100kg, Deadlift 125kg
- Injuries & Constraints: Has minor left shoulder impingement with overhead pressing at wide angles; no extreme barbell behind-the-neck work.
- Forbidden Exercises: Behind the neck press, Upright rows with barbell.
- Preferred Exercises: Dumbbell Bench Press, Barbell Squats, Cable lateral raises, Lat Pulldowns.
- Available Equipment: Full Gym (Barbells, Dumbbells, Cables, Benches, Squat Racks, Plate-loaded Machines, Pull-up bar).

### CRITICAL LANGUAGE REQUIREMENT:
- When language is Persian, all exercise names ("name") MUST be provided in Persian (e.g. "پرس سینه هالتر", "اسکات با هالتر", "زیربغل هالتر خم").
`;
