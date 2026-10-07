import { Dish, MealSlot, UserProfile, MealItemRecommendation, FullMealPlan } from '../lib/types';
import { DISH_LOOKUP } from '../lib/data/messDishes';
import { MONTHLY_MESS_MENUS } from '../lib/data/monthlyMenuData';
import { DEFAULT_PROFILE } from '../lib/storage';
import { calculateDishFitScore, MEAL_SLOT_BUDGET_RATIOS } from '../lib/nutrition/fitScore';

function isGrainDish(dish: Dish): boolean {
  const name = dish.name.toLowerCase();
  const id = dish.id.toLowerCase();
  return (
    name.includes('biryani') ||
    name.includes('pulav') ||
    name.includes('pulao') ||
    name.includes('dosa') ||
    name.includes('poha') ||
    name.includes('upma') ||
    name.includes('paratha') ||
    name.includes('bath') ||
    name.includes('sevai') ||
    name.includes('khichdi') ||
    name.includes('bhature') ||
    id.includes('biryani')
  );
}

function isStapleCarb(dish: Dish): boolean {
  const name = dish.name.toLowerCase();
  const id = dish.id.toLowerCase();
  return (
    name.includes('rice') ||
    name.includes('roti') ||
    name.includes('pulka') ||
    name.includes('chapathi') ||
    name.includes('bread') ||
    id.includes('rice') ||
    id.includes('roti')
  );
}

function isTreatOrFryum(dish: Dish): boolean {
  const name = dish.name.toLowerCase();
  const id = dish.id.toLowerCase();
  return (
    name.includes('fryum') ||
    name.includes('papad') ||
    name.includes('chips') ||
    name.includes('sharbath') ||
    name.includes('kulfi') ||
    name.includes('ice cream') ||
    name.includes('jamun') ||
    name.includes('sweet') ||
    name.includes('halwa') ||
    name.includes('jilebi') ||
    id.includes('fryum') ||
    id.includes('sharbath')
  );
}

const SLOT_RATIOS: Record<MealSlot, number> = {
  breakfast: 0.22,
  lunch: 0.38,
  snacks: 0.12,
  dinner: 0.28,
};

function testBudgetedPlan(availableDishes: Dish[], slot: MealSlot, user: UserProfile) {
  const slotRatio = SLOT_RATIOS[slot] || 0.25;
  const slotCalorieBudget = Math.round(user.targetCalories * slotRatio);
  const hasNonVegMain = availableDishes.some(d => d.category === 'non-veg' || d.category === 'egg');

  // Filter incompatible dishes
  const eligible = availableDishes.filter(d => {
    const fit = calculateDishFitScore(d, slot, user);
    if (!fit.isAllergenFree || !fit.isDietCompatible) return false;
    // Exclude veg substitute if non-veg main exists and user is non-veg
    if (user.dietPreference === 'non-veg' && hasNonVegMain) {
      if (d.name.toLowerCase().includes('paneer') && !d.name.toLowerCase().includes('paratha')) {
        return false;
      }
    }
    return true;
  });

  // Rank eligible dishes by fit score
  const scored = eligible.map(d => ({
    dish: d,
    fit: calculateDishFitScore(d, slot, user),
  })).sort((a, b) => b.fit.score - a.fit.score);

  // Top protein anchor
  const topAnchor = scored.find(s => s.dish.protein >= 10) || scored[0];
  const isTopGrain = topAnchor ? isGrainDish(topAnchor.dish) : false;

  let runningCalories = 0;
  let runningProtein = 0;
  const plateItems: any[] = [];

  for (const { dish, fit } of scored) {
    let indicator: 'standard' | 'increase' | 'reduce' | 'skip' = 'standard';
    let mult = 1.0;
    let reason = 'Balanced portion for your meal plate';

    if (dish.id === topAnchor?.dish.id) {
      mult = user.goal === 'fitness' || user.goal === 'gain' ? 1.0 : 0.85;
      indicator = mult > 1 ? 'increase' : 'standard';
      reason = `Primary high-protein anchor (${dish.protein}g protein) — powers your meal`;
    } else if (isStapleCarb(dish)) {
      if (isTopGrain) {
        // Redundant with Biryani / Pulao
        indicator = 'skip';
        mult = 0;
        reason = `${topAnchor.dish.name} already supplies complex carbohydrates — skip extra rice/roti to stay within ${slotCalorieBudget} kcal budget`;
      } else {
        // Wet curry: pick 1 staple
        const alreadyHasStaple = plateItems.some(i => i.indicator !== 'skip' && isStapleCarb(i.dish));
        if (alreadyHasStaple || runningCalories + dish.calories > slotCalorieBudget) {
          indicator = 'skip';
          mult = 0;
          reason = 'Choose between Rice or Roti (not both) to stay in calorie budget';
        } else {
          mult = 1.0;
          reason = 'Energy-giving carbohydrate staple to pair with your curry';
        }
      }
    } else if (isTreatOrFryum(dish)) {
      if (runningCalories + dish.calories > slotCalorieBudget + 50) {
        indicator = 'skip';
        mult = 0;
        reason = `Skip extra treat to stay within your ${slotCalorieBudget} kcal meal budget`;
      } else {
        mult = 0.5;
        indicator = 'reduce';
        reason = 'Light portion of treat to fit your daily energy target';
      }
    } else if (dish.name.toLowerCase().includes('salad')) {
      mult = 1.0;
      indicator = 'standard';
      reason = 'Fresh dietary fiber and essential micronutrients';
    } else {
      // Side curry, dal, raita
      if (runningCalories + dish.calories > slotCalorieBudget + 100) {
        indicator = 'skip';
        mult = 0;
        reason = 'Skip secondary heavy curry to prevent calorie surplus';
      } else {
        mult = 1.0;
        reason = 'Nutrient-rich accompaniment';
      }
    }

    const cals = Math.round(dish.calories * mult);
    const prot = Math.round(dish.protein * mult * 10) / 10;
    if (indicator !== 'skip') {
      runningCalories += cals;
      runningProtein += prot;
    }

    plateItems.push({
      dish,
      indicator,
      mult,
      calories: cals,
      protein: prot,
      reason
    });
  }

  return {
    budget: slotCalorieBudget,
    totalCalories: runningCalories,
    totalProtein: Math.round(runningProtein * 10) / 10,
    plateItems
  };
}

const nonVegProfile = {
  ...DEFAULT_PROFILE,
  dietPreference: 'non-veg' as const,
  messType: 'non-veg' as const,
  targetCalories: 1900,
  targetProteinG: 70,
};

const day27 = MONTHLY_MESS_MENUS['non-veg'].find(d => d.dayNumber === 27)!;
const lunchDishes27 = day27.slots.lunch.map(id => DISH_LOOKUP.get(id)!).filter(Boolean);
const res27 = testBudgetedPlan(lunchDishes27, 'lunch', nonVegProfile);

console.log('=== Non-Veg Day 27 (Biryani Sunday Lunch) ===');
console.log('Target Budget:', res27.budget, 'kcal | Plate Total:', res27.totalCalories, 'kcal | Plate Protein:', res27.totalProtein, 'g');
for (const item of res27.plateItems) {
  console.log(`  [${item.indicator}] ${item.dish.name}: ${item.calories} kcal -> ${item.reason}`);
}

const vegProfile = {
  ...DEFAULT_PROFILE,
  dietPreference: 'veg' as const,
  messType: 'veg' as const,
  targetCalories: 1900,
  targetProteinG: 70,
};

const day27Veg = MONTHLY_MESS_MENUS['veg'].find(d => d.dayNumber === 27)!;
const lunchDishes27Veg = day27Veg.slots.lunch.map(id => DISH_LOOKUP.get(id)!).filter(Boolean);
const res27Veg = testBudgetedPlan(lunchDishes27Veg, 'lunch', vegProfile);

console.log('\n=== Veg Day 27 (Biryani Sunday Lunch) ===');
console.log('Target Budget:', res27Veg.budget, 'kcal | Plate Total:', res27Veg.totalCalories, 'kcal | Plate Protein:', res27Veg.totalProtein, 'g');
for (const item of res27Veg.plateItems) {
  console.log(`  [${item.indicator}] ${item.dish.name}: ${item.calories} kcal -> ${item.reason}`);
}
