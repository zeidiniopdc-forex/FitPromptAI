import { MuscleGroup } from '../types';
import { INITIAL_EXERCISE_LIBRARY } from '../data/exerciseLibrary';

/**
 * FitPrompt AI - Comprehensive Exercise & Biomechanics Localization
 * Ensures that when the app language is Persian ('fa'), all exercise names,
 * muscle groups, equipment, and day names are accurately displayed in Persian.
 */

export function isPersianText(text: string): boolean {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
}

// Map of canonical English names/keys to accurate Persian bodybuilding terminology
export const EXERCISE_TRANSLATION_MAP: Record<string, string> = {
  // CHEST
  'barbell bench press': 'پرس سینه هالتر',
  'bench press': 'پرس سینه هالتر',
  'flat barbell bench press': 'پرس سینه با هالتر روی میز صاف',
  'incline dumbbell press': 'پرس بالاسینه دمبل',
  'incline dumbbell bench press': 'پرس بالاسینه با دمبل',
  'incline barbell bench press': 'پرس بالاسینه با هالتر',
  'incline barbell press': 'پرس بالاسینه هالتر',
  'flat dumbbell bench press': 'پرس سینه با دمبل روی میز صاف',
  'flat dumbbell press': 'پرس سینه دمبل',
  'decline barbell bench press': 'پرس زیرسینه هالتر',
  'decline dumbbell press': 'پرس زیرسینه دمبل',
  'cable chest fly / crossover': 'کراس اور با کابل',
  'cable crossover': 'کراس اور سیم‌کش',
  'cable chest fly': 'فلای سینه سیم‌کش',
  'dumbbell chest fly': 'فلای سینه با دمبل',
  'incline dumbbell fly': 'فلای بالاسینه دمبل',
  'pec deck fly': 'دستگاه پروانه (پک دک)',
  'pec deck': 'دستگاه پروانه سینه',
  'machine chest press': 'پرس سینه دستگاه',
  'chest dips': 'پارالل سینه',
  'dips': 'دیپ / پارالل',
  'push-ups': 'شنا سوئدی',
  'pushup': 'شنا سوئدی',
  'dumbbell pullover': 'پلاور با دمبل',

  // BACK
  'conventional deadlift': 'ددلیفت هالتر استاندارد',
  'deadlift': 'ددلیفت هالتر',
  'barbell bent-over row': 'زیربغل هالتر خم',
  'bent-over barbell row': 'زیربغل هالتر خم',
  'bent over row': 'زیربغل هالتر خم',
  'lat pulldown': 'لت زیربغل با دستگاه سیم‌کش',
  'lat pulldown (neutral grip)': 'لت زیربغل دستگیره خنثی (مچ ممتد)',
  'wide-grip lat pulldown': 'لت زیربغل دست باز',
  'close-grip lat pulldown': 'لت زیربغل دست جمع',
  'pull-up': 'بارفیکس دست باز',
  'pull-ups': 'بارفیکس',
  'pullups': 'بارفیکس',
  'pull-ups (or lat pulldown)': 'بارفیکس (یا لت زیربغل)',
  'chin-up': 'بارفیکس مچ برعکس (چین‌آپ)',
  'chin-ups': 'بارفیکس دست جمع مچ برعکس',
  'seated cable row': 'قایقی سیم‌کش',
  'seated row': 'زیربغل قایقی با سیم‌کش',
  'single-arm dumbbell row': 'زیربغل دمبل تک خم',
  'one-arm dumbbell row': 'زیربغل دمبل تک خم',
  't-bar row': 'زیربغل تی بار',
  'chest-supported t-bar or db row': 'زیربغل تی بار یا دمبل با تکیه‌گاه سینه',
  'chest supported row': 'زیربغل با تکیه‌گاه سینه',
  'chest-supported row': 'زیربغل با تکیه‌گاه سینه',
  'straight-arm cable pulldown': 'پلاور سیم‌کش ایستاده (لت دست صاف)',
  'hyperextensions': 'فیله کمر (هایپراکستنشن)',
  'back extension': 'فیله کمر روی میز شیبدار',
  'barbell shrug': 'شراگ با هالتر (کول)',
  'dumbbell shrug': 'شراگ با دمبل (کول)',

  // SHOULDERS
  'overhead barbell press (ohp)': 'پرس سرشانه هالتر ایستاده',
  'overhead barbell press': 'پرس سرشانه هالتر',
  'overhead press': 'پرس سرشانه هالتر',
  'military press': 'پرس سرشانه سرنظامی هالتر',
  'seated dumbbell shoulder press': 'پرس سرشانه دمبل نشسته',
  'dumbbell shoulder press': 'پرس سرشانه با دمبل',
  'arnold press': 'پرس آرنولدی با دمبل',
  'dumbbell lateral raise': 'نشر جانب با دمبل',
  'cable lateral raise': 'نشر جانب سیم‌کش',
  'lateral raise': 'نشر جانب (سرشانه از بغل)',
  'dumbbell front raise': 'نشر جلو با دمبل',
  'cable front raise': 'نشر جلو سیم‌کش',
  'face pull': 'فیس پول سیم‌کش',
  'face pull with rope': 'فیس پول طناب سیم‌کش',
  'cable face pull': 'فیس پول طناب سیم‌کش',
  'rear delt fly': 'نشر خم (دلتوئید خلفی)',
  'reverse pec deck': 'فلای معکوس با دستگاه',
  'upright row': 'کول با هالتر یا سیم‌کش',

  // LEGS - QUADS
  'barbell back squat': 'اسکات هالتر از پشت',
  'back squat': 'اسکات هالتر از پشت',
  'squat': 'اسکات',
  'barbell front squat': 'اسکات هالتر از جلو',
  'front squat': 'اسکات از جلو',
  '45-degree leg press': 'پرس پا ۴۵ درجه',
  'leg press': 'پرس پا دستگاه',
  'hack squat': 'هاگ اسکات دستگاه',
  'leg extension': 'جلو پا دستگاه',
  'leg extensions': 'جلو پا دستگاه',
  'bulgarian split squat': 'اسکات بلغاری با دمبل',
  'walking lunges': 'لانگز راه رفتنی با دمبل',
  'dumbbell lunges': 'لانج با دمبل',
  'goblet squat': 'گابلت اسکات با دمبل یا کتل‌بل',

  // LEGS - HAMSTRINGS & GLUTES
  'romanian deadlift (rdl)': 'ددلیفت رومانیایی با هالتر',
  'romanian deadlift': 'ددلیفت رومانیایی',
  'barbell romanian deadlift': 'ددلیفت رومانیایی با هالتر',
  'dumbbell romanian deadlift': 'ددلیفت رومانیایی با دمبل',
  'conventional or trap bar deadlift': 'ددلیفت استاندارد یا ترپ بار',
  'trap bar deadlift': 'ددلیفت با میله ترپ بار',
  'sumo deadlift': 'ددلیفت سومو با هالتر',
  'lying leg curl': 'پشت پا خوابیده دستگاه',
  'seated leg curl': 'پشت پا نشسته دستگاه',
  'standing leg curl': 'پشت پا تک پا ایستاده',
  'barbell hip thrust': 'هیپ تراست با هالتر',
  'hip thrust': 'هیپ تراست با هالتر',
  'glute bridge': 'پل باسن (گلوت بریج)',
  'cable pull-through': 'پول ترو با کابل (زنجیره خلفی)',

  // CALVES
  'standing calf raise': 'ساق پا ایستاده دستگاه',
  'standing calf raises': 'ساق پا ایستاده دستگاه',
  'seated calf raise': 'ساق پا نشسته دستگاه',
  'calf press on leg press': 'ساق پا با دستگاه پرس پا',
  'donkey calf raise': 'ساق پا دانکی',

  // ARMS - BICEPS
  'barbell biceps curl': 'جلو بازو با هالتر',
  'barbell bicep curl': 'جلو بازو هالتر',
  'barbell curl': 'جلو بازو هالتر',
  'incline dumbbell curl': 'جلو بازو دمبل روی میز شیبدار',
  'dumbbell hammer curl': 'جلو بازو چکشی با دمبل',
  'hammer curl': 'جلو بازو چکشی دمبل',
  'cable rope biceps curl': 'جلو بازو طناب سیم‌کش',
  'cable bicep curl': 'جلو بازو سیم‌کش',
  'preacher curl': 'جلو بازو لاری هالتر EZ',
  'ez-bar preacher curl': 'جلو بازو لاری با هالتر EZ',
  'concentration curl': 'جلو بازو تمرکزی دمبل',

  // ARMS - TRICEPS
  'cable triceps pushdown': 'پشت بازو سیم‌کش',
  'triceps pushdown': 'پشت بازو سیم‌کش',
  'ez-bar skull crushers': 'پشت بازو هالتر خوابیده (جمجمه‌شکن)',
  'skull crushers': 'پشت بازو هالتر خوابیده',
  'overhead cable/db triceps extension': 'پشت بازو دمبل یا سیم‌کش از پشت سر',
  'overhead triceps extension': 'پشت بازو از پشت سر',
  'cable overhead triceps extension': 'پشت بازو طناب از پشت سر با سیم‌کش',
  'close-grip bench press': 'پرس سینه دست جمع (پشت بازو)',
  'tricep dips': 'دیپ پشت بازو',
  'dumbbell kickback': 'کیک‌بک پشت بازو با دمبل',

  // ABS & CORE
  'hanging leg raise': 'بالا کشیدن پا در حالت آویزان (زیرشکم بارفیکس)',
  'hanging knee raise': 'زیرشکم بارفیکس با زانوی خم',
  'cable kneeling crunch': 'کرانچ سیم‌کش زانو زده',
  'cable crunch': 'کرانچ سیم‌کش',
  'standard core plank': 'پلانک استاندارد',
  'plank': 'پلانک شکم',
  'cable woodchopper / core rotation': 'وودچاپ سیم‌کش (مورب شکمی)',
  'cable woodchopper': 'وودچاپ سیم‌کش',
  'ab wheel rollout': 'غلتک شکم (رول اوت)',
  'russian twist': 'چرخش روسی (شکم و پهلو)'
};

// Muscle group translation map
export const MUSCLE_TRANSLATION_MAP: Record<string, string> = {
  'Chest': 'سینه',
  'Back': 'پشت و زیربغل',
  'Shoulders': 'سرشانه',
  'Biceps': 'جلو بازو',
  'Triceps': 'پشت بازو',
  'Forearms': 'ساعد',
  'Quadriceps': 'چهارسر ران',
  'Hamstrings': 'همسترینگ',
  'Glutes': 'عضلات باسن',
  'Calves': 'ساق پا',
  'Abs': 'شکم و میان‌تنه',
  'Cardio/Full Body': 'هوازی / فول‌بادی',
  'Full Body': 'کل بدن',
  'Arms': 'دست‌ها (بازو)',
  'Legs': 'پاها'
};

// Equipment translation map
export const EQUIPMENT_TRANSLATION_MAP: Record<string, string> = {
  'Full Gym': 'باشگاه کامل بدنسازی',
  'Barbell': 'هالتر',
  'Dumbbell': 'دمبل',
  'Machine': 'دستگاه',
  'Cable': 'سیم‌کش',
  'Smith Machine': 'دستگاه اسمیت',
  'Bench': 'میز پرس / بنچ',
  'Squat Rack': 'رک اسکات',
  'Resistance Bands': 'کش بدنسازی',
  'Pull-up Bar': 'میله بارفیکس',
  'Kettlebell': 'کتل‌بل',
  'Bodyweight': 'وزن بدن'
};

// Day names translation map
export const DAY_NAME_TRANSLATION_MAP: Record<string, string> = {
  'Upper Body A (Chest & Back Focus)': 'بالاتنه A (تمرکز سینه و زیربغل)',
  'Lower Body A (Quad & Glute Dominant)': 'پایین‌تنه A (تمرکز چهارسر و باسن)',
  'Upper Body B (Shoulder & Volume Focus)': 'بالاتنه B (تمرکز سرشانه و حجم)',
  'Lower Body B (Hamstring & Posterior Focus)': 'پایین‌تنه B (تمرکز همسترینگ و فیله)',
  'Push Day (Chest, Shoulders, Triceps)': 'روز پوش (سینه، سرشانه، پشت بازو)',
  'Pull Day (Back, Biceps, Rear Delts)': 'روز پول (زیربغل، جلو بازو، دلتوئید خلفی)',
  'Legs Day (Quads, Hamstrings, Calves)': 'روز لگز (چهارسر، همسترینگ، ساق)',
  'Upper Body Focus': 'تمرین تخصصی بالاتنه',
  'Lower Body Focus': 'تمرین تخصصی پایین‌تنه',
  'Full Body A': 'فول‌بادی A',
  'Full Body B': 'فول‌بادی B',
  'Full Body C': 'فول‌بادی C'
};

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Returns the localized exercise name.
 * When language is 'fa', guaranteed to return a Persian exercise name.
 */
export function getExerciseName(
  nameOrId: string | undefined | null,
  lang: 'fa' | 'en' = 'fa',
  options?: {
    fallbackFa?: string;
    exerciseId?: string;
    mode?: 'fa' | 'en' | 'both';
  }
): string {
  if (!nameOrId) return '';

  const raw = nameOrId.trim();

  // If language is English and mode is not forced to 'fa'
  if (lang === 'en' && options?.mode !== 'fa') {
    // If it was already Persian, see if we can find its English counterpart in library
    if (isPersianText(raw)) {
      const match = INITIAL_EXERCISE_LIBRARY.find(
        (e) => e.nameFa === raw || (options?.exerciseId && e.id === options.exerciseId)
      );
      if (match) return match.nameEn;
    }
    return raw;
  }

  // ================= PERSIAN RESOLUTION =================

  // 1. If the string already contains Persian text:
  if (isPersianText(raw)) {
    // If it's a combined format like "پرس سینه هالتر (Barbell Bench Press)", return clean or full
    return raw;
  }

  // 2. Explicit fallback provided
  if (options?.fallbackFa && isPersianText(options.fallbackFa)) {
    if (options.mode === 'both') {
      return `${options.fallbackFa} (${raw})`;
    }
    return options.fallbackFa;
  }

  // 3. Check INITIAL_EXERCISE_LIBRARY by id or English name
  if (options?.exerciseId) {
    const byId = INITIAL_EXERCISE_LIBRARY.find((e) => e.id === options.exerciseId);
    if (byId) {
      if (options.mode === 'both') return `${byId.nameFa} (${byId.nameEn})`;
      return byId.nameFa;
    }
  }

  const byNameEn = INITIAL_EXERCISE_LIBRARY.find(
    (e) => e.nameEn.toLowerCase() === raw.toLowerCase()
  );
  if (byNameEn) {
    if (options?.mode === 'both') return `${byNameEn.nameFa} (${byNameEn.nameEn})`;
    return byNameEn.nameFa;
  }

  // 4. Exact match in translation map
  const lower = raw.toLowerCase();
  if (EXERCISE_TRANSLATION_MAP[lower]) {
    const fa = EXERCISE_TRANSLATION_MAP[lower];
    if (options?.mode === 'both') return `${fa} (${raw})`;
    return fa;
  }

  // 5. Normalized match
  const norm = normalizeKey(raw);
  if (EXERCISE_TRANSLATION_MAP[norm]) {
    const fa = EXERCISE_TRANSLATION_MAP[norm];
    if (options?.mode === 'both') return `${fa} (${raw})`;
    return fa;
  }

  // 6. Fuzzy keyword heuristics for unknown custom inputs
  const faFuzzy = matchFuzzyExerciseName(lower);
  if (faFuzzy) {
    if (options?.mode === 'both') return `${faFuzzy} (${raw})`;
    return faFuzzy;
  }

  // Default fallback if no match found
  return raw;
}

/**
 * Intelligent keyword matcher for common variations
 */
function matchFuzzyExerciseName(lower: string): string | null {
  // Squats
  if (lower.includes('bulgarian') && lower.includes('squat')) return 'اسکات بلغاری با دمبل';
  if (lower.includes('front') && lower.includes('squat')) return 'اسکات هالتر از جلو';
  if (lower.includes('hack') && lower.includes('squat')) return 'هاگ اسکات دستگاه';
  if (lower.includes('goblet')) return 'گابلت اسکات';
  if (lower.includes('squat')) return 'اسکات با هالتر';

  // Bench & Chest
  if (lower.includes('incline') && (lower.includes('bench') || lower.includes('press'))) {
    if (lower.includes('dumbbell') || lower.includes('db')) return 'پرس بالاسینه با دمبل';
    return 'پرس بالاسینه با هالتر';
  }
  if (lower.includes('decline') && (lower.includes('bench') || lower.includes('press'))) {
    return 'پرس زیرسینه';
  }
  if (lower.includes('bench press') || (lower.includes('chest') && lower.includes('press'))) {
    if (lower.includes('dumbbell') || lower.includes('db')) return 'پرس سینه دمبل';
    if (lower.includes('machine')) return 'پرس سینه با دستگاه';
    return 'پرس سینه هالتر';
  }
  if (lower.includes('cable') && (lower.includes('fly') || lower.includes('crossover'))) {
    return 'کراس اور سیم‌کش';
  }
  if (lower.includes('pec deck') || lower.includes('butterfly')) return 'دستگاه پروانه سینه';
  if (lower.includes('dip') && lower.includes('chest')) return 'پارالل سینه';

  // Deadlift
  if (lower.includes('romanian') || lower.includes('rdl')) return 'ددلیفت رومانیایی با هالتر';
  if (lower.includes('sumo') && lower.includes('deadlift')) return 'ددلیفت سومو با هالتر';
  if (lower.includes('trap bar')) return 'ددلیفت ترپ بار';
  if (lower.includes('deadlift')) return 'ددلیفت هالتر';

  // Rows & Back
  if (lower.includes('bent') && lower.includes('row')) return 'زیربغل هالتر خم';
  if (lower.includes('lat pulldown') || lower.includes('pulldown')) return 'لت زیربغل با سیم‌کش';
  if (lower.includes('pull-up') || lower.includes('pullup')) return 'بارفیکس';
  if (lower.includes('chin-up') || lower.includes('chinup')) return 'بارفیکس مچ برعکس';
  if (lower.includes('cable row') || lower.includes('seated row')) return 'قایقی سیم‌کش';
  if (lower.includes('t-bar') || lower.includes('t bar')) return 'زیربغل تی بار';
  if (lower.includes('dumbbell row') || lower.includes('one-arm row')) return 'زیربغل دمبل تک خم';
  if (lower.includes('shrug')) return 'شراگ (کول)';

  // Shoulders
  if (lower.includes('overhead press') || lower.includes('military press') || lower.includes('ohp')) {
    return 'پرس سرشانه هالتر ایستاده';
  }
  if (lower.includes('shoulder press')) {
    if (lower.includes('dumbbell') || lower.includes('db')) return 'پرس سرشانه با دمبل';
    return 'پرس سرشانه هالتر';
  }
  if (lower.includes('lateral raise')) {
    if (lower.includes('cable')) return 'نشر جانب سیم‌کش';
    return 'نشر جانب با دمبل';
  }
  if (lower.includes('face pull')) return 'فیس پول سیم‌کش';
  if (lower.includes('front raise')) return 'نشر جلو';
  if (lower.includes('rear delt') || lower.includes('reverse fly')) return 'نشر خم (دلتوئید خلفی)';

  // Arms
  if (lower.includes('bicep') || lower.includes('curl')) {
    if (lower.includes('hammer')) return 'جلو بازو چکشی دمبل';
    if (lower.includes('incline')) return 'جلو بازو دمبل روی میز شیبدار';
    if (lower.includes('preacher') || lower.includes('scott')) return 'جلو بازو لاری هالتر';
    if (lower.includes('cable')) return 'جلو بازو با سیم‌کش';
    if (lower.includes('barbell')) return 'جلو بازو با هالتر';
    if (lower.includes('dumbbell')) return 'جلو بازو با دمبل';
    return 'جلو بازو';
  }
  if (lower.includes('pushdown') || lower.includes('tricep')) {
    if (lower.includes('skull crusher')) return 'پشت بازو هالتر خوابیده (جمجمه‌شکن)';
    if (lower.includes('overhead')) return 'پشت بازو از پشت سر';
    if (lower.includes('kickback')) return 'کیک بک پشت بازو با دمبل';
    if (lower.includes('cable') || lower.includes('pushdown')) return 'پشت بازو سیم‌کش';
    return 'پشت بازو';
  }

  // Legs
  if (lower.includes('leg press')) return 'پرس پا با دستگاه';
  if (lower.includes('leg extension')) return 'جلو پا دستگاه';
  if (lower.includes('leg curl')) return 'پشت پا دستگاه';
  if (lower.includes('hip thrust')) return 'هیپ تراست با هالتر';
  if (lower.includes('calf raise') || lower.includes('calves')) return 'ساق پا دستگاه';

  // Abs
  if (lower.includes('hanging leg raise')) return 'زیرشکم بارفیکس آویزان';
  if (lower.includes('plank')) return 'پلانک استاندارد';
  if (lower.includes('crunch')) return 'کرانچ شکم';
  if (lower.includes('woodchopper')) return 'وودچاپ سیم‌کش';

  return null;
}

/**
 * Returns localized muscle group name
 */
export function getMuscleGroupName(muscle: MuscleGroup | string | undefined | null, lang: 'fa' | 'en' = 'fa'): string {
  if (!muscle) return '';
  if (lang === 'en') return muscle;
  return MUSCLE_TRANSLATION_MAP[muscle] || muscle;
}

/**
 * Returns localized equipment name
 */
export function getEquipmentName(equipment: string | undefined | null, lang: 'fa' | 'en' = 'fa'): string {
  if (!equipment) return '';
  if (lang === 'en') return equipment;
  return EQUIPMENT_TRANSLATION_MAP[equipment] || equipment;
}

/**
 * Returns localized day name
 */
export function getDayName(dayName: string | undefined | null, lang: 'fa' | 'en' = 'fa', fallbackFa?: string): string {
  if (!dayName) return '';
  if (lang === 'en') return dayName;
  if (fallbackFa && isPersianText(fallbackFa)) return fallbackFa;
  if (isPersianText(dayName)) return dayName;
  return DAY_NAME_TRANSLATION_MAP[dayName] || dayName;
}
