import { ValidationErrorItem, ValidationResult, WorkoutProgramJson } from '../types';

export function validateWorkoutProgramJson(rawInput: string | unknown): ValidationResult {
  const errors: ValidationErrorItem[] = [];
  const warnings: string[] = [];

  let parsed: any;

  // 1. JSON Syntax Check
  if (typeof rawInput === 'string') {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return {
        isValid: false,
        errors: [{
          field: 'json_root',
          error: 'Empty JSON input string',
          location: 'root',
          suggestedFix: 'Paste a valid JSON object string starting with { and ending with }'
        }],
        warnings: []
      };
    }

    // Strip markdown code fences if user accidentally included them
    let cleanString = trimmed;
    if (cleanString.startsWith('```')) {
      cleanString = cleanString.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    try {
      parsed = JSON.parse(cleanString);
    } catch (e: any) {
      return {
        isValid: false,
        errors: [{
          field: 'syntax',
          error: `JSON Syntax error: ${e.message}`,
          location: 'character offset',
          suggestedFix: 'Ensure all keys are double-quoted and remove any trailing commas or markdown fences.'
        }],
        warnings: []
      };
    }
  } else {
    parsed = rawInput;
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      isValid: false,
      errors: [{
        field: 'root',
        error: 'Expected root to be a JSON object, received ' + typeof parsed,
        location: 'root',
        suggestedFix: 'Provide a top-level JSON object: { "schema_version": "1.0", ... }'
      }],
      warnings: []
    };
  }

  // 2. Schema Version Check
  if (!parsed.schema_version) {
    errors.push({
      field: 'schema_version',
      error: 'Missing required field: schema_version',
      location: 'root.schema_version',
      suggestedFix: 'Add "schema_version": "1.0"'
    });
  } else if (typeof parsed.schema_version !== 'string') {
    errors.push({
      field: 'schema_version',
      error: `Expected schema_version to be a string, received ${typeof parsed.schema_version}`,
      location: 'root.schema_version',
      suggestedFix: 'Use string format like "1.0"'
    });
  } else if (!['1.0', '1.1'].includes(parsed.schema_version)) {
    warnings.push(`Schema version "${parsed.schema_version}" may have unsupported future features; fallback parser active.`);
  }

  // 3. Program Metadata Check
  if (!parsed.program || typeof parsed.program !== 'object') {
    errors.push({
      field: 'program',
      error: 'Missing or invalid "program" object',
      location: 'root.program',
      suggestedFix: 'Add a "program" object with id, name, goal, duration_weeks, and days_per_week'
    });
  } else {
    const p = parsed.program;
    if (!p.id || typeof p.id !== 'string') {
      errors.push({
        field: 'program.id',
        error: 'Missing or non-string program id',
        location: 'program.id',
        suggestedFix: 'Add a unique string identifier, e.g. "my-custom-program"'
      });
    }
    if (!p.name || typeof p.name !== 'string') {
      errors.push({
        field: 'program.name',
        error: 'Missing or non-string program name',
        location: 'program.name',
        suggestedFix: 'Provide a descriptive title for the program, e.g. "Hypertrophy 4-Day"'
      });
    }
    if (p.duration_weeks !== undefined && (typeof p.duration_weeks !== 'number' || p.duration_weeks < 1)) {
      errors.push({
        field: 'program.duration_weeks',
        error: `Invalid duration_weeks: ${p.duration_weeks}. Expected positive integer.`,
        location: 'program.duration_weeks',
        suggestedFix: 'Set duration_weeks to a number between 1 and 52'
      });
    }
    if (p.days_per_week !== undefined && (typeof p.days_per_week !== 'number' || p.days_per_week < 1 || p.days_per_week > 7)) {
      errors.push({
        field: 'program.days_per_week',
        error: `Invalid days_per_week: ${p.days_per_week}. Must be between 1 and 7.`,
        location: 'program.days_per_week',
        suggestedFix: 'Set days_per_week to a number between 1 and 7'
      });
    }
  }

  // 4. Days Structure & Hierarchy Check
  if (!parsed.days || !Array.isArray(parsed.days)) {
    errors.push({
      field: 'days',
      error: 'Missing or invalid "days" array',
      location: 'root.days',
      suggestedFix: 'Provide an array of training days under the "days" key'
    });
  } else if (parsed.days.length === 0) {
    errors.push({
      field: 'days',
      error: '"days" array is empty. At least 1 workout day is required.',
      location: 'root.days',
      suggestedFix: 'Include at least one workout day in the program'
    });
  } else {
    const seenDayIds = new Set<string>();
    const seenExerciseIds = new Set<string>();

    parsed.days.forEach((day: any, dayIdx: number) => {
      const dayPath = `days[${dayIdx}]`;

      if (!day || typeof day !== 'object') {
        errors.push({
          field: `${dayPath}`,
          error: `Day at index ${dayIdx} is not an object`,
          location: dayPath,
          suggestedFix: 'Provide an object with day_id, name, and exercises'
        });
        return;
      }

      // day_id check
      if (!day.day_id || typeof day.day_id !== 'string') {
        errors.push({
          field: `${dayPath}.day_id`,
          error: 'Missing or invalid day_id',
          location: `${dayPath}.day_id`,
          suggestedFix: `Set day_id to a unique string like "day_${dayIdx + 1}"`
        });
      } else {
        if (seenDayIds.has(day.day_id)) {
          errors.push({
            field: `${dayPath}.day_id`,
            error: `Duplicate day_id: "${day.day_id}" was already defined.`,
            location: `${dayPath}.day_id`,
            suggestedFix: `Make each day_id unique, e.g. "${day.day_id}_${dayIdx + 1}"`
          });
        }
        seenDayIds.add(day.day_id);
      }

      // day name check
      if (!day.name || typeof day.name !== 'string') {
        errors.push({
          field: `${dayPath}.name`,
          error: 'Missing or non-string day name',
          location: `${dayPath}.name`,
          suggestedFix: 'Add a name for this day, e.g. "Upper Body A"'
        });
      }

      // exercises array check
      if (!day.exercises || !Array.isArray(day.exercises)) {
        errors.push({
          field: `${dayPath}.exercises`,
          error: 'Missing or invalid exercises array in day',
          location: `${dayPath}.exercises`,
          suggestedFix: 'Include an "exercises" array containing at least 1 exercise'
        });
      } else if (day.exercises.length === 0) {
        errors.push({
          field: `${dayPath}.exercises`,
          error: `Day "${day.name || dayIdx}" has 0 exercises`,
          location: `${dayPath}.exercises`,
          suggestedFix: 'Add at least one exercise to this workout day'
        });
      } else {
        day.exercises.forEach((ex: any, exIdx: number) => {
          const exPath = `${dayPath}.exercises[${exIdx}]`;

          if (!ex || typeof ex !== 'object') {
            errors.push({
              field: exPath,
              error: `Exercise at index ${exIdx} is not an object`,
              location: exPath,
              suggestedFix: 'Ensure exercise is an object with id, name, sets, and reps'
            });
            return;
          }

          // exercise_id check
          if (!ex.exercise_id || typeof ex.exercise_id !== 'string') {
            errors.push({
              field: `${exPath}.exercise_id`,
              error: 'Missing or non-string exercise_id',
              location: `${exPath}.exercise_id`,
              suggestedFix: `Set exercise_id, e.g. "ex_${dayIdx + 1}_${exIdx + 1}"`
            });
          } else {
            if (seenExerciseIds.has(ex.exercise_id)) {
              // Duplicate IDs across the program
              warnings.push(`Notice: exercise_id "${ex.exercise_id}" appears multiple times across program. Ensure it is intentional for tracking.`);
            }
            seenExerciseIds.add(ex.exercise_id);
          }

          // exercise name check
          if (!ex.name || typeof ex.name !== 'string') {
            errors.push({
              field: `${exPath}.name`,
              error: 'Missing or non-string exercise name',
              location: `${exPath}.name`,
              suggestedFix: 'Specify exercise name, e.g. "Barbell Bench Press"'
            });
          }

          // muscle_group check
          if (!ex.muscle_group || typeof ex.muscle_group !== 'string') {
            errors.push({
              field: `${exPath}.muscle_group`,
              error: 'Missing or non-string muscle_group',
              location: `${exPath}.muscle_group`,
              suggestedFix: 'Specify muscle group, e.g. "Chest", "Back", "Quadriceps"'
            });
          }

          // sets check (CRITICAL: MUST BE INTEGER)
          if (ex.sets === undefined || ex.sets === null) {
            errors.push({
              field: `${exPath}.sets`,
              error: 'Missing required field: sets',
              location: `${exPath}.sets`,
              suggestedFix: 'Add sets as an integer, e.g. "sets": 3'
            });
          } else if (typeof ex.sets !== 'number' || !Number.isInteger(ex.sets)) {
            errors.push({
              field: `${exPath}.sets`,
              error: `Invalid sets: Expected integer, received ${typeof ex.sets} (${ex.sets})`,
              location: `${exPath}.sets`,
              suggestedFix: `Convert "${ex.sets}" to an integer number like 3 or 4`
            });
          } else if (ex.sets < 1 || ex.sets > 15) {
            errors.push({
              field: `${exPath}.sets`,
              error: `Invalid sets count: ${ex.sets}. Expected between 1 and 15 sets.`,
              location: `${exPath}.sets`,
              suggestedFix: 'Keep sets between 1 and 15 for safety and periodization'
            });
          }

          // reps check (object with min/max or integer)
          if (ex.reps === undefined || ex.reps === null) {
            errors.push({
              field: `${exPath}.reps`,
              error: 'Missing required field: reps',
              location: `${exPath}.reps`,
              suggestedFix: 'Provide reps as integer e.g. 10 or range { "min": 8, "max": 12 }'
            });
          } else if (typeof ex.reps === 'number') {
            if (ex.reps < 1 || ex.reps > 100) {
              errors.push({
                field: `${exPath}.reps`,
                error: `Invalid reps value: ${ex.reps}. Must be between 1 and 100.`,
                location: `${exPath}.reps`,
                suggestedFix: 'Set reps to a realistic range (e.g. 8 to 15)'
              });
            }
          } else if (typeof ex.reps === 'object') {
            if (typeof ex.reps.min !== 'number' || typeof ex.reps.max !== 'number') {
              errors.push({
                field: `${exPath}.reps`,
                error: 'Reps range object must have numeric "min" and "max" properties',
                location: `${exPath}.reps`,
                suggestedFix: 'Use format: { "min": 8, "max": 12 }'
              });
            } else if (ex.reps.min < 1 || ex.reps.max < ex.reps.min) {
              errors.push({
                field: `${exPath}.reps`,
                error: `Invalid reps range: min (${ex.reps.min}) must be >= 1 and <= max (${ex.reps.max})`,
                location: `${exPath}.reps`,
                suggestedFix: 'Ensure min is positive and max is greater than or equal to min'
              });
            }
          } else {
            errors.push({
              field: `${exPath}.reps`,
              error: `Invalid reps type: Expected number or range object, received ${typeof ex.reps}`,
              location: `${exPath}.reps`,
              suggestedFix: 'Use an integer like 10 or range { "min": 8, "max": 12 }'
            });
          }

          // rest_seconds check
          if (ex.rest_seconds !== undefined && ex.rest_seconds !== null) {
            if (typeof ex.rest_seconds !== 'number' || ex.rest_seconds < 10 || ex.rest_seconds > 600) {
              errors.push({
                field: `${exPath}.rest_seconds`,
                error: `Invalid rest_seconds: ${ex.rest_seconds}. Expected number between 10 and 600 seconds.`,
                location: `${exPath}.rest_seconds`,
                suggestedFix: 'Set rest_seconds to a standard duration like 60, 90, 120, or 180'
              });
            }
          }

          // RIR / RPE sanity check
          if (ex.rir !== undefined && ex.rir !== null) {
            if (typeof ex.rir !== 'number' || ex.rir < 0 || ex.rir > 6) {
              warnings.push(`Exercise ${ex.name}: RIR value of ${ex.rir} is unusual (standard is 0 to 4).`);
            }
          }
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    schemaVersion: parsed.schema_version,
    errors,
    warnings
  };
}
