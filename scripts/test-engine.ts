/**
 * Automated Verification Script for Mess Mate Core Clinical Engine & Fit Score
 */
import { calculateNutritionProfile } from '../lib/nutrition/calculator';
import { calculateDishFitScore, getMealRecommendations } from '../lib/nutrition/fitScore';
import { DISH_LOOKUP, MESS_DISHES } from '../lib/data/messDishes';
import { IFCT_INGREDIENTS } from '../lib/data/ifctIngredients';
import { MONTHLY_MESS_MENUS, getMessMonthlyMenu } from '../lib/data/monthlyMenuData';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

console.log('--- 1. Testing IFCT Database & Dish Composition ---');
assert(IFCT_INGREDIENTS.length >= 20, 'IFCT ingredients database loaded (>20 items)');
assert(MESS_DISHES.length >= 20, 'Composed mess dishes loaded (>20 items)');

const soyaCurry = DISH_LOOKUP.get('dish_soya_chunks_curry');
assert(Boolean(soyaCurry), 'Soya chunks curry exists in dishes');
assert(Boolean(soyaCurry && soyaCurry.protein >= 20), 'Soya chunks curry provides >= 20g protein per serving', `Actual: ${soyaCurry?.protein}g`);
assert(Boolean(soyaCurry && soyaCurry.portionStatus === 'measured'), 'Soya chunks curry portion is flagged as measured');

console.log('\n--- 2. Testing Mifflin-St Jeor & Clinical Guardrails ---');
// Standard male profile: 20yo, 175cm, 68kg, moderately active
const studentMale = calculateNutritionProfile({
  name: 'Test Student',
  hostelBlock: 'Hostel 4',
  age: 20,
  gender: 'male',
  heightCm: 175,
  weightKg: 68,
  activityLevel: 'moderately_active',
  goal: 'fitness',
  dietPreference: 'veg',
  allergies: [],
  hasMedicalCondition: false,
});

assert(studentMale.bmr > 1600 && studentMale.bmr < 1750, 'Male BMR calculated correctly within Mifflin-St Jeor range', `BMR: ${studentMale.bmr}`);
assert(studentMale.tdee > 2400 && studentMale.tdee < 2700, 'TDEE calculated with activity multiplier', `TDEE: ${studentMale.tdee}`);
assert(studentMale.targetProteinG >= 130, 'Protein target is high (>130g) for fitness recomposition', `Protein: ${studentMale.targetProteinG}g`);

// Calorie floor test: Small female with aggressive loss goal
const femaleSmall = calculateNutritionProfile({
  name: 'Small Student',
  hostelBlock: 'Hostel 1',
  age: 19,
  gender: 'female',
  heightCm: 150,
  weightKg: 42,
  activityLevel: 'sedentary',
  goal: 'lose',
  dietPreference: 'veg',
  allergies: [],
  hasMedicalCondition: false,
});
assert(femaleSmall.targetCalories >= 1200, 'Non-negotiable calorie floor prevents recommendations <1200 kcal/day', `Target: ${femaleSmall.targetCalories}`);
assert(femaleSmall.calorieFloorTriggered === true, 'Calorie floor trigger flag is correctly recorded');

// Medical condition guardrail test
const medicalStudent = calculateNutritionProfile({
  name: 'Med Flagged',
  hostelBlock: 'Hostel 3',
  age: 21,
  gender: 'male',
  heightCm: 175,
  weightKg: 70,
  activityLevel: 'lightly_active',
  goal: 'lose',
  dietPreference: 'veg',
  allergies: [],
  hasMedicalCondition: true, // Flagged!
});
assert(medicalStudent.isLiabilityGuardrailActive === true, 'Medical flag activates liability guardrail');
assert(medicalStudent.targetCalories === medicalStudent.tdee, 'Switches from aggressive deficit to balanced maintenance guidance');

console.log('\n--- 3. Testing Fit Score & Allergy Filtering ---');
// Allergy check
const peanutAllergicStudent = {
  ...studentMale,
  allergies: ['nuts'],
};
const indoriPoha = DISH_LOOKUP.get('dish_poha')!;
const pohaScore = calculateDishFitScore(indoriPoha, 'breakfast', peanutAllergicStudent);
assert(pohaScore.score === 0, 'Dish containing peanuts receives 0 score for nut-allergic student', `Score: ${pohaScore.score}`);
assert(pohaScore.verdict === 'Avoid', 'Verdict is strictly marked Avoid for allergen risk');
assert(pohaScore.isAllergenFree === false, 'isAllergenFree is false');

// Veg diet preference check
const chickenCurry = DISH_LOOKUP.get('dish_chicken_curry')!;
const chickenScore = calculateDishFitScore(chickenCurry, 'lunch', studentMale);
assert(chickenScore.score === 0, 'Non-veg chicken curry receives 0 score for vegetarian student');
assert(chickenScore.isDietCompatible === false, 'isDietCompatible is false');

// Smart recommendations & alternatives test
const lunchDishes = [
  DISH_LOOKUP.get('dish_soya_chunks_curry')!,
  DISH_LOOKUP.get('dish_toor_dal_tadka')!,
  DISH_LOOKUP.get('dish_aloo_gobi')!,
  DISH_LOOKUP.get('dish_steamed_rice')!,
];

const recs = getMealRecommendations(lunchDishes, 'lunch', studentMale);
assert(Boolean(recs.topPick), 'Top pick is successfully selected');
assert(recs.topPick?.dish.id === 'dish_soya_chunks_curry', 'Soya chunks curry ranks #1 Top Pick for fitness goal due to protein density');
assert(recs.alternatives.length > 0, 'Smart alternatives are provided if student dislikes top pick');

console.log('\n--- 4. Testing Full-Meal Composition Plan ---');
const mealPlan = recs.fullMealPlan;
assert(mealPlan.items.length === lunchDishes.length, 'Full-meal plan retains ALL items in the meal counter', `Expected ${lunchDishes.length}, got ${mealPlan.items.length}`);
assert(mealPlan.topPickItem?.dishId === 'dish_soya_chunks_curry', 'Top Pick is visually promoted within the full meal list');
assert(mealPlan.overallFitScore >= 70, 'Overall meal fit score is calculated across all dishes', `Score: ${mealPlan.overallFitScore}%`);

const soyaRec = mealPlan.items.find((i) => i.dishId === 'dish_soya_chunks_curry')!;
assert(soyaRec.quantityIndicator === 'increase', 'High-protein soya chunks receives ↑ Increase quantity badge for fitness goal');
assert(soyaRec.recommendedServing.length > 0, 'Recommended serving text is generated for each item');
assert(soyaRec.quickReason.length > 0, 'One-line quick reason is generated for each item');

const riceRec = mealPlan.items.find((i) => i.dishId === 'dish_steamed_rice')!;
assert(riceRec.quantityIndicator === 'reduce', 'Carb-dense steamed rice receives ↓ Reduce quantity badge for fitness recomposition');
assert(mealPlan.totalCalories > 0, 'Total meal plate calories are calculated');
assert(mealPlan.totalProtein > 0, 'Total meal plate protein is calculated');

console.log('\n--- 5. Testing Multi-Mess Architecture (Non-Veg, Veg & Special) ---');

assert(MONTHLY_MESS_MENUS['non-veg']?.length === 30, 'Non-Veg Mess contains full 30 days');
assert(MONTHLY_MESS_MENUS['veg']?.length === 30, 'Veg Mess contains full 30 days');
assert(MONTHLY_MESS_MENUS['special']?.length === 30, 'Special Mess contains full 30 days');

// Verify all dish IDs in all 3 messes exist in DISH_LOOKUP
let allMessDishesValid = true;
let invalidId = '';
for (const mType of ['non-veg', 'veg', 'special'] as const) {
  for (const day of MONTHLY_MESS_MENUS[mType]) {
    for (const slot of ['breakfast', 'lunch', 'snacks', 'dinner'] as const) {
      for (const id of day.slots[slot]) {
        if (!DISH_LOOKUP.has(id)) {
          allMessDishesValid = false;
          invalidId = id;
          break;
        }
      }
    }
  }
}
assert(allMessDishesValid, 'All dish IDs across all 3 messes exist in DISH_LOOKUP', `Invalid: ${invalidId}`);

// Verify Veg Mess has strictly vegetarian dishes
let vegMessStrictlyVeg = true;
let nonVegFoundInVeg = '';
for (const day of MONTHLY_MESS_MENUS['veg']) {
  for (const slot of ['breakfast', 'lunch', 'snacks', 'dinner'] as const) {
    for (const id of day.slots[slot]) {
      const dish = DISH_LOOKUP.get(id);
      if (dish && dish.category !== 'veg') {
        vegMessStrictlyVeg = false;
        nonVegFoundInVeg = `${id} (${dish.category})`;
        break;
      }
    }
  }
}
assert(vegMessStrictlyVeg, 'Veg Mess schedule contains strictly vegetarian dishes', `Found: ${nonVegFoundInVeg}`);

// Verify Special Mess contains juices and soups
const day1Special = MONTHLY_MESS_MENUS['special'][0];
assert(day1Special.slots.breakfast.includes('dish_pomegranate_juice'), 'Special Mess breakfast includes fresh fruit juice (Pomegranate)');
assert(day1Special.slots.dinner.includes('dish_broccoli_soup'), 'Special Mess dinner includes evening chef soup (Broccoli)');

console.log(`\n========================================`);
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

