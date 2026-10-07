import { ActivityLevel, GoalType, UserProfile, MessType, MealSlot, MealSlotTargets } from '../types';

export interface CalculationInput {
  name: string;
  hostelBlock: string;
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  dietPreference: UserProfile['dietPreference'];
  messType?: MessType;
  allergies: string[];
  dislikedDishIds?: string[];
  hasMedicalCondition: boolean;
  medicalNotes?: string;
}

// 2. Activity Multipliers
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Sedentary (little/no exercise)
  lightly_active: 1.375, // Lightly active (light exercise 1-3 days/week)
  moderately_active: 1.55, // Moderately active (moderate exercise 3-5 days/week)
  very_active: 1.725, // Very active (hard exercise 6-7 days/week)
  extra_active: 1.9, // Extra active (very hard training, physical job)
};

// 3. Goal Adjustments (applied on top of TDEE)
export const GOAL_CALORIE_ADJUSTMENTS: Record<GoalType, number> = {
  lose: -450, // Weight Loss: TDEE - 450
  gain: 400, // Muscle Gain: TDEE + 400
  fitness: -150, // Fitness/Recomp: TDEE - 150
  maintain: 0, // Maintenance: TDEE
};

// 5. Protein factors (g/kg of current body weight)
export const PROTEIN_FACTORS: Record<GoalType, number> = {
  lose: 1.8, // Weight Loss: 1.8 g/kg
  gain: 1.9, // Muscle Gain: 1.9 g/kg
  fitness: 2.0, // Fitness/Recomp: 2.0 g/kg
  maintain: 1.4, // Maintenance: 1.4 g/kg
};

// 8. Meal-level split ratios
export const MEAL_SLOT_BUDGET_RATIOS: Record<MealSlot, number> = {
  breakfast: 0.25, // Breakfast: 25%
  lunch: 0.35, // Lunch: 35%
  dinner: 0.30, // Dinner: 30%
  snacks: 0.10, // Snacks: 10%
};

/**
 * Calculates BMR, TDEE, Calorie targets, and Macronutrients according to clinical formulas:
 * 1. BMR (Mifflin-St Jeor):
 *    Men:   (10 × weight_kg) + (6.25 × height_cm) − (5 × age_years) + 5
 *    Women: (10 × weight_kg) + (6.25 × height_cm) − (5 × age_years) − 161
 * 2. TDEE = BMR × activity_multiplier
 * 3. Goal adjustment:
 *    Weight Loss:     target_kcal = TDEE − 450
 *    Muscle Gain:     target_kcal = TDEE + 400
 *    Fitness/Recomp:  target_kcal = TDEE − 150
 *    Maintenance:     target_kcal = TDEE
 * 4. Safety floor: target_kcal = max(target_kcal, 1200)
 * 5. Protein target: protein_g = weight_kg × protein_factor (1.8, 1.9, 2.0, 1.4)
 * 6. Fat target: fat_kcal = target_kcal × 0.25, fat_g = fat_kcal / 9
 * 7. Carbs target: carb_kcal = target_kcal − protein_kcal − fat_kcal, carb_g = carb_kcal / 4
 */
export function calculateNutritionProfile(input: CalculationInput): UserProfile {
  const { age, gender, heightCm, weightKg, activityLevel, goal, hasMedicalCondition } = input;

  // BMI Calculation & clinical guardrail check
  const heightInMeters = heightCm / 100;
  const bmi = Math.round((weightKg / (heightInMeters * heightInMeters)) * 10) / 10;
  const isExtremeBmi = bmi < 16.5 || bmi > 35.0;
  const isLiabilityGuardrailActive = hasMedicalCondition || isExtremeBmi;

  // 1. BMR — Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  bmr = Math.round(bmr);

  // 2. TDEE — apply activity multiplier
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.375;
  const tdee = Math.round(bmr * multiplier);

  // 3. Goal adjustment — applied on top of TDEE, never as a flat number
  const effectiveGoal = isLiabilityGuardrailActive ? 'maintain' : goal;
  const goalAdjustment = GOAL_CALORIE_ADJUSTMENTS[effectiveGoal] ?? 0;
  let targetCalories = Math.round(tdee + goalAdjustment);

  // 4. Safety floor — apply after the above, always
  // target_kcal = max(target_kcal, 1200)
  // This must override the deficit if a lower-TDEE student's calculated target would drop below 1200 kcal.
  let calorieFloorTriggered = false;
  if (targetCalories < 1200) {
    targetCalories = 1200;
    calorieFloorTriggered = true;
  }

  // 5. Protein target — g/kg of current body weight
  // Weight Loss: 1.8, Muscle Gain: 1.9, Fitness/Recomp: 2.0, Maintenance: 1.4
  const proteinFactor = isLiabilityGuardrailActive ? 1.4 : (PROTEIN_FACTORS[goal] ?? 1.4);
  const targetProteinG = Math.round(weightKg * proteinFactor);

  // 6. Fat target — standard is 20-30% of total calories; use 25% as a clean default
  // fat_kcal = target_kcal × 0.25
  // fat_g = fat_kcal / 9
  const fatKcal = targetCalories * 0.25;
  const targetFatG = Math.round(fatKcal / 9);

  // 7. Carbs — fill the remainder
  // protein_kcal = protein_g × 4
  // carb_kcal = target_kcal − protein_kcal − fat_kcal
  // carb_g = carb_kcal / 4
  // (Standard conversion constants: protein = 4 kcal/g, carbs = 4 kcal/g, fat = 9 kcal/g)
  const proteinKcal = targetProteinG * 4;
  const carbKcal = targetCalories - proteinKcal - fatKcal;
  const targetCarbsG = Math.max(0, Math.round(carbKcal / 4));

  return {
    ...input,
    messType: input.messType || 'non-veg',
    dislikedDishIds: input.dislikedDishIds || [],
    bmr,
    tdee,
    targetCalories,
    targetProteinG,
    targetCarbsG,
    targetFatG,
    bmi,
    isExtremeBmi,
    calorieFloorTriggered,
    isLiabilityGuardrailActive,
  };
}

/**
 * 8. Meal-level split — sub-targets calculation
 * Breakfast: 25%
 * Lunch:     35%
 * Dinner:    30%
 * Snacks:    10%
 *
 * Applies percentage to target_kcal, protein_g, fat_g, and carb_g independently
 * to get each meal's sub-targets.
 */
export function getMealSlotTargets(
  slot: MealSlot,
  userProfile: Pick<UserProfile, 'targetCalories' | 'targetProteinG' | 'targetFatG' | 'targetCarbsG'>
): MealSlotTargets {
  const ratio = MEAL_SLOT_BUDGET_RATIOS[slot] ?? 0.25;
  return {
    calories: Math.round(userProfile.targetCalories * ratio),
    proteinG: Math.round(userProfile.targetProteinG * ratio),
    fatG: Math.round(userProfile.targetFatG * ratio),
    carbsG: Math.round(userProfile.targetCarbsG * ratio),
  };
}

export function getAllMealSlotTargets(
  userProfile: Pick<UserProfile, 'targetCalories' | 'targetProteinG' | 'targetFatG' | 'targetCarbsG'>
): Record<MealSlot, MealSlotTargets> {
  return {
    breakfast: getMealSlotTargets('breakfast', userProfile),
    lunch: getMealSlotTargets('lunch', userProfile),
    dinner: getMealSlotTargets('dinner', userProfile),
    snacks: getMealSlotTargets('snacks', userProfile),
  };
}
