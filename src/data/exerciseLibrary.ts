import { ExerciseLibraryItem } from '../types';

export const INITIAL_EXERCISE_LIBRARY: ExerciseLibraryItem[] = [
  // CHEST
  {
    id: 'ex_bench_press',
    nameEn: 'Barbell Bench Press',
    nameFa: 'پرس سینه هالتر',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    movementPattern: 'Push',
    instructionsEn: 'Lie flat on bench, grip bar slightly wider than shoulder width. Retract scapulae, lower bar to mid-chest with control, press up explosively.',
    instructionsFa: 'روی میز صاف دراز بکشید، هالتر را کمی پهن‌تر از عرض شانه بگیرید. کتف‌ها را منقبض کرده، میله را کنترل‌شده تا وسط سینه پایین آورده و با قدرت بالا ببرید.'
  },
  {
    id: 'ex_incline_db_press',
    nameEn: 'Incline Dumbbell Press',
    nameFa: 'پرس بالاسینه دمبل',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    movementPattern: 'Push',
    instructionsEn: 'Set incline bench to 30 degrees. Press dumbbells upward with elbows at 45-60 degrees to torso. Lower until chest stretches.',
    instructionsFa: 'میز را در زاویه ۳۰ درجه تنظیم کنید. دمبل‌ها را با زاویه آرنج ۴۵ تا ۶۰ درجه نسبت به بالاتنه پرس کنید و تا کشش کامل سینه پایین بیاورید.'
  },
  {
    id: 'ex_cable_crossover',
    nameEn: 'Cable Chest Fly / Crossover',
    nameFa: 'کراس اور با کابل',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Set pulleys at chest or high level. Bring hands together in hugging arc, squeezing pectorals at peak contraction.',
    instructionsFa: 'قرقره‌ها را در ارتفاع مناسب قرار دهید. با حرکتی قوسی دست‌ها را به هم نزدیک کرده و در انتهای حرکت سینه را به شدت منقبض کنید.'
  },
  {
    id: 'ex_dips_chest',
    nameEn: 'Chest Dips',
    nameFa: 'پارالل سینه',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    movementPattern: 'Push',
    instructionsEn: 'Lean torso forward about 30 degrees, flare elbows slightly, descend until shoulders are stretched, push back up.',
    instructionsFa: 'بالاتنه را حدود ۳۰ درجه به جلو متمایل کنید، آرنج‌ها را به آرامی خم کرده و پس از رسیدن به کشش مناسب، خود را بالا بکشید.'
  },

  // BACK
  {
    id: 'ex_deadlift_conv',
    nameEn: 'Conventional Deadlift',
    nameFa: 'ددلیفت هالتر استاندارد',
    muscleGroup: 'Back',
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Forearms'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    movementPattern: 'Hinge',
    instructionsEn: 'Stand with bar over mid-foot. Hinge at hips, grip bar firmly, engage lats, push floor away through mid-foot to stand erect.',
    instructionsFa: 'میله هالتر روی نیمه پا قرار گیرد. از مفصل لگن خم شوید، هالتر را محکم گرفته، زیربغل را سفت کنید و با فشار پاها به زمین راست بایستید.'
  },
  {
    id: 'ex_barbell_bent_row',
    nameEn: 'Bent-Over Barbell Row',
    nameFa: 'زیربغل هالتر خم',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    movementPattern: 'Pull',
    instructionsEn: 'Hinge forward 45 degrees with flat back. Pull bar towards lower ribcage/navel, driving elbows up and back.',
    instructionsFa: 'با کمری صاف در زاویه ۴۵ درجه خم شوید. هالتر را به سمت زیر شکم هدایت کرده و آرنج‌ها را به عقب بکشید.'
  },
  {
    id: 'ex_lat_pulldown_wide',
    nameEn: 'Lat Pulldown',
    nameFa: 'لت زیربغل با دستگاه سیم‌کش',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    movementPattern: 'Pull',
    instructionsEn: 'Sit securely under thigh pads. Pull bar down toward upper chest while driving elbows toward your hips.',
    instructionsFa: 'پشت دستگاه بنشینید، میله را با فاصله‌ای مناسب گرفته و با هدایت آرنج‌ها به سمت پایین و عقب تا بالای سینه بکشید.'
  },
  {
    id: 'ex_pullup',
    nameEn: 'Pull-up',
    nameFa: 'بارفیکس دست باز',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms'],
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    movementPattern: 'Pull',
    instructionsEn: 'Hang from bar with overhand grip. Pull chest toward bar, pulling shoulder blades down and back.',
    instructionsFa: 'با گرفتن میله بارفیکس آویزان شوید. با پایین کشیدن کتف‌ها، سینه را به سمت میله هدایت کنید.'
  },
  {
    id: 'ex_seated_cable_row',
    nameEn: 'Seated Cable Row',
    nameFa: 'قایقی سیم‌کش',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    movementPattern: 'Pull',
    instructionsEn: 'Sit upright, pull attachment to lower abdomen, squeezing rhomboids and lats firmly at peak.',
    instructionsFa: 'صاف بنشینید، دستگیره را به سمت ناف بکشید و در انتهای دامنه عضلات پشت را منقبض کنید.'
  },

  // SHOULDERS
  {
    id: 'ex_overhead_press_bb',
    nameEn: 'Overhead Barbell Press (OHP)',
    nameFa: 'پرس سرشانه هالتر ایستاده',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Triceps', 'Chest'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    movementPattern: 'Push',
    instructionsEn: 'Hold bar at collarbone level. Brace core and glutes, press bar straight up locking arms overhead.',
    instructionsFa: 'هالتر را جلوی ترقوه نگه دارید. عضلات شکم و باسن را سفت کرده و میله را مستقیم به بالای سر هدایت کنید.'
  },
  {
    id: 'ex_dumbbell_lateral_raise',
    nameEn: 'Dumbbell Lateral Raise',
    nameFa: 'نشر جانب با دمبل',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Triceps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Raise dumbbells laterally to parallel with slight forward angle (scaption plane), leading with elbows.',
    instructionsFa: 'دمبل‌ها را به آرامی از طرفین بالا ببرید تا با زمین موازی شوند؛ تمرکز روی سر میانی دلتوئید باشد.'
  },
  {
    id: 'ex_face_pull_cable',
    nameEn: 'Face Pull with Rope',
    nameFa: 'فیس پول طناب سیم‌کش',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Back'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    movementPattern: 'Pull',
    instructionsEn: 'Attach rope at eye level. Pull towards face while externally rotating shoulders, pulling rope ends apart.',
    instructionsFa: 'طناب را در ارتفاع چشم تنظیم کنید. به سمت صورت بکشید و دست‌ها را به طرفین باز کنید تا دلتوئید خلفی فعال شود.'
  },

  // LEGS - QUADS
  {
    id: 'ex_barbell_back_squat',
    nameEn: 'Barbell Back Squat',
    nameFa: 'اسکات هالتر از پشت',
    muscleGroup: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Abs'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    movementPattern: 'Squat',
    instructionsEn: 'Rest bar on upper traps. Descend by bending hips and knees until thighs are parallel or below, drive up through mid-foot.',
    instructionsFa: 'هالتر را روی عضلات کول قرار دهید. با خم کردن همزمان زانو و باسن پایین بیایید تا ران‌ها موازی زمین شوند و با قدرت بالا بیایید.'
  },
  {
    id: 'ex_leg_press_45',
    nameEn: '45-Degree Leg Press',
    nameFa: 'پرس پا ۴۵ درجه',
    muscleGroup: 'Quadriceps',
    secondaryMuscles: ['Glutes'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    movementPattern: 'Squat',
    instructionsEn: 'Place feet shoulder-width on platform. Release safety handles, lower weight smoothly to 90 degrees knee bend, press back up.',
    instructionsFa: 'پاها را به اندازه عرض شانه روی صفحه بگذارید. وزنه را به آرامی تا زاویه ۹۰ درجه زانو پایین بیاورید و بازگردانید.'
  },
  {
    id: 'ex_leg_extension_mach',
    nameEn: 'Leg Extension',
    nameFa: 'جلو پا دستگاه',
    muscleGroup: 'Quadriceps',
    secondaryMuscles: [],
    equipment: 'Machine',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Sit firmly against back pad. Extend legs until straight, holding peak contraction for 1 second before lowering slowly.',
    instructionsFa: 'تکیه‌گاه دستگاه را تنظیم کنید. ساق‌ها را بالا بیاورید تا پاها صاف شوند، ۱ ثانیه مکث کنید و کنترل‌شده برگردانید.'
  },
  {
    id: 'ex_bulgarian_split_squat',
    nameEn: 'Bulgarian Split Squat',
    nameFa: 'اسکات بلغاری با دمبل',
    muscleGroup: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    movementPattern: 'Lunge',
    instructionsEn: 'Place rear foot on bench behind you. Lower hips until front thigh is parallel to ground, push through front foot.',
    instructionsFa: 'یک پا را روی میز پشت سر بگذارید. با پای جلو پایین بیایید تا ران موازی زمین شود و با فشار کف پای جلو بلند شوید.'
  },

  // LEGS - HAMSTRINGS & GLUTES
  {
    id: 'ex_romanian_deadlift_bb',
    nameEn: 'Romanian Deadlift (RDL)',
    nameFa: 'ددلیفت رومانیایی با هالتر',
    muscleGroup: 'Hamstrings',
    secondaryMuscles: ['Glutes', 'Back'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    movementPattern: 'Hinge',
    instructionsEn: 'Hold bar at hips with slight knee bend. Push hips back as far as possible feeling deep hamstring stretch, squeeze glutes to return.',
    instructionsFa: 'هالتر را با اندکی خمیدگی زانو نگه دارید. باسن را تا جای ممکن به عقب هل دهید تا کشش همسترینگ حس شود و بازگردید.'
  },
  {
    id: 'ex_lying_leg_curl',
    nameEn: 'Lying Leg Curl',
    nameFa: 'پشت پا خوابیده دستگاه',
    muscleGroup: 'Hamstrings',
    secondaryMuscles: ['Calves'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Lie prone with pad against Achilles tendon. Curl heels up toward glutes smoothly, squeeze, and resist on descent.',
    instructionsFa: 'روی شکم دراز بکشید، بالشتک پشت تاندون آشیل باشد. پاشنه‌ها را به طرف باسن بالا بکشید و به آرامی پایین ببرید.'
  },
  {
    id: 'ex_hip_thrust_bb',
    nameEn: 'Barbell Hip Thrust',
    nameFa: 'هیپ تراست با هالتر',
    muscleGroup: 'Glutes',
    secondaryMuscles: ['Hamstrings'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    movementPattern: 'Hinge',
    instructionsEn: 'Upper back resting on bench, bar padded across hip crease. Drive hips upward until thighs and torso align, lock glutes at top.',
    instructionsFa: 'کتف‌ها را روی نیمکت قرار داده و هالتر پددار را روی مفصل لگن بگذارید. لگن را با انقباض باسن بالا بیاورید تا خط صاف تشکیل شود.'
  },

  // ARMS - BICEPS
  {
    id: 'ex_bicep_curl_bb',
    nameEn: 'Barbell Biceps Curl',
    nameFa: 'جلو بازو با هالتر',
    muscleGroup: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Stand tall with bar at shoulder width. Keep elbows pinned to sides, curl bar up toward shoulders, lower with control.',
    instructionsFa: 'بایستید و هالتر را به اندازه عرض شانه بگیرید. آرنج‌ها را کنار بدن ثابت نگه دارید و هالتر را بالا بکشید.'
  },
  {
    id: 'ex_incline_db_curl',
    nameEn: 'Incline Dumbbell Curl',
    nameFa: 'جلو بازو دمبل روی میز شیبدار',
    muscleGroup: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    movementPattern: 'Isolation',
    instructionsEn: 'Set bench to 45-60 degrees. Allow arms to hang for full stretch of long head, curl dumbbells smoothly without swinging.',
    instructionsFa: 'روی میز شیبدار بنشینید تا سر بلند عضله دوسر کشیده شود؛ دمبل‌ها را بدون تاب دادن تا شانه بالا بیاورید.'
  },
  {
    id: 'ex_hammer_curl_db',
    nameEn: 'Dumbbell Hammer Curl',
    nameFa: 'جلو بازو چکشی با دمبل',
    muscleGroup: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Palms facing each other throughout movement. Curl up targeting brachialis and brachioradialis.',
    instructionsFa: 'کف دست‌ها را رو به هم نگه دارید و دمبل‌ها را بالا بیاورید تا براکیالیس و ساعد درگیر شوند.'
  },

  // ARMS - TRICEPS
  {
    id: 'ex_tricep_pushdown_cable',
    nameEn: 'Cable Triceps Pushdown',
    nameFa: 'پشت بازو سیم‌کش',
    muscleGroup: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Cable',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Hold bar or rope with elbows bent at 90 degrees at sides. Push down fully locking arms, squeeze triceps.',
    instructionsFa: 'طناب یا میله را گرفته، آرنج‌ها را به بدن بچسبانید و با صاف کردن کامل دست‌ها پشت بازو را منقبض کنید.'
  },
  {
    id: 'ex_skull_crushers',
    nameEn: 'EZ-Bar Skull Crushers',
    nameFa: 'پشت بازو هالتر خوابیده (جمجمه‌شکن)',
    muscleGroup: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    movementPattern: 'Isolation',
    instructionsEn: 'Lie on flat bench with EZ-bar above shoulders. Bend elbows to lower bar toward forehead/crown, extend back up.',
    instructionsFa: 'روی میز صاف دراز بکشید، هالتر را با خم کردن آرنج‌ها به سمت پیشانی پایین بیاورید و سپس دست‌ها را صاف کنید.'
  },
  {
    id: 'ex_overhead_tricep_ext',
    nameEn: 'Overhead Cable/DB Triceps Extension',
    nameFa: 'پشت بازو دمبل یا سیم‌کش از پشت سر',
    muscleGroup: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Cable',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Raise weight overhead, hinge at elbows to lower behind head for deep long-head stretch, press back up.',
    instructionsFa: 'وزنه را بالای سر ببرید، با خم کردن آرنج آن را پشت سر پایین آورده تا کشش عمیقی در سر بلند ایجاد شود و برگردانید.'
  },

  // CALVES & ABS
  {
    id: 'ex_standing_calf_raise_mach',
    nameEn: 'Standing Calf Raise',
    nameFa: 'ساق پا ایستاده دستگاه',
    muscleGroup: 'Calves',
    secondaryMuscles: [],
    equipment: 'Machine',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Balls of feet on step edge. Lower heels for full stretch, push through big toes to highest possible tip-toe peak.',
    instructionsFa: 'سینه پا روی لبه پله، پاشنه‌ها را برای کشش کامل پایین ببرید و سپس روی نوک پنجه تا بالاترین حد ممکن بلند شوید.'
  },
  {
    id: 'ex_cable_woodchopper',
    nameEn: 'Cable Woodchopper / Core Rotation',
    nameFa: 'وودچاپ سیم‌کش (مورب شکمی)',
    muscleGroup: 'Abs',
    secondaryMuscles: [],
    equipment: 'Cable',
    difficulty: 'Intermediate',
    movementPattern: 'Isolation',
    instructionsEn: 'Set pulley high, rotate torso diagonally down across body keeping arms relatively straight, bracing core.',
    instructionsFa: 'کابل را در بالا قرار دهید و تنه را به صورت قطری به پایین بچرخانید تا عضلات مایل شکمی فعال شوند.'
  },
  {
    id: 'ex_plank',
    nameEn: 'Standard Core Plank',
    nameFa: 'پلانک استاندارد',
    muscleGroup: 'Abs',
    secondaryMuscles: ['Shoulders', 'Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    movementPattern: 'Isolation',
    instructionsEn: 'Hold forearm plank position with body in straight line from head to heels. Contract abs, glutes and quads.',
    instructionsFa: 'روی ساعدها قرار گرفته و بدن را در یک خط مستقیم نگه دارید. عضلات شکم و باسن را منقبض نگه دارید.'
  }
];
