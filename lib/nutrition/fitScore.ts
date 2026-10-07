import {
  Dish,
  FitScoreBreakdown,
  FullMealPlan,
  MealItemRecommendation,
  MealSlot,
  QuantityIndicator,
  UserProfile,
} from '../types';
import { MEAL_SLOT_BUDGET_RATIOS, getMealSlotTargets } from './calculator';

const SCALABLE_MIN = 0.5;
const SCALABLE_MAX = 1.5;

type AdjustmentVars = {
  indicator: QuantityIndicator;
  multiplier: number;
  proteinDensity: number;
  isHighProtein: boolean;
  isHighStarchOrFat: boolean;
  redistributedFrom?: string;
  redistributedProtein?: number;
};

function proteinDensity(dish: Dish): number {
  return dish.calories > 0 ? (dish.protein / dish.calories) * 100 : 0;
}

function clampScalable(multiplier: number): number {
  return Math.min(SCALABLE_MAX, Math.max(SCALABLE_MIN, multiplier));
}

function shortName(dish: Dish): string {
  return dish.name.split('(')[0].trim().split(',')[0];
}

function formatServing(dish: Dish, multiplier: number): string {
  if (dish.portionKind === 'discrete') {
    const units = Math.round(multiplier * dish.standardUnits);
    const grams = Math.round(dish.portionSizeGrams * (units / Math.max(1, dish.standardUnits)));
    return `${units} ${unitWord(dish, units)} (~${grams}g)`;
  }
  const grams = Math.round(dish.portionSizeGrams * multiplier);
  const ladles = Number(multiplier.toFixed(1));
  return `${ladles}× standard (${dish.portionDescription.split('(')[0].trim()} · ~${grams}g)`;
}

function unitWord(dish: Dish, units: number): string {
  const text = dish.name.toLowerCase();
  if (/(roti|chapati|phulka)/.test(text)) return units === 1 ? 'roti' : 'rotis';
  if (/egg/.test(text) && !/curry|bhurji/.test(text)) return units === 1 ? 'egg' : 'eggs';
  if (/paratha/.test(text)) return units === 1 ? 'paratha' : 'parathas';
  if (/samosa/.test(text)) return units === 1 ? 'samosa' : 'samosas';
  if (/slice|bread/.test(text)) return units === 1 ? 'slice' : 'slices';
  return units === 1 ? 'piece' : 'pieces';
}

function indicatorFromMultiplier(multiplier: number, kind: Dish['portionKind'], standardUnits: number): {
  indicator: QuantityIndicator;
  label: string;
} {
  if (multiplier <= 0) return { indicator: 'skip', label: '✕ Skip' };
  if (kind === 'discrete') {
    const units = Math.round(multiplier * standardUnits);
    if (units > standardUnits) return { indicator: 'increase', label: '↑ Extra' };
    if (units < standardUnits) return { indicator: 'reduce', label: '↓ Less' };
    return { indicator: 'standard', label: '✓ Keep' };
  }
  if (multiplier >= 1.15) return { indicator: 'increase', label: '↑ Extra' };
  if (multiplier <= 0.85) return { indicator: 'reduce', label: '↓ Less' };
  return { indicator: 'standard', label: '✓ Keep' };
}

function applyPortionRules(dish: Dish, intended: number): number {
  if (intended <= 0) return 0;
  if (dish.portionKind === 'discrete') {
    const intendedUnits = intended * dish.standardUnits;
    const units = Math.min(dish.maxUnits, Math.max(0, Math.round(intendedUnits)));
    return units / Math.max(1, dish.standardUnits);
  }
  return Number(clampScalable(intended).toFixed(2));
}

function reasonsFromVars(dish: Dish, user: UserProfile, vars: AdjustmentVars): { quick: string; full: string } {
  const name = shortName(dish);
  if (vars.indicator === 'skip' && vars.redistributedFrom) {
    const quick = `On your dislike list — plate macros moved to the next-best item`;
    return { quick, full: quick };
  }

  if (vars.redistributedFrom) {
    const extra = vars.redistributedProtein ? `${vars.redistributedProtein}g protein` : 'macros';
    const quick = `Extra ${name.toLowerCase()} — ${extra} after skipping ${vars.redistributedFrom}`;
    return {
      quick,
      full: `${quick}. Quantity is ${vars.multiplier}× standard, clamped to mess serving rules.`,
    };
  }

  if (user.isLiabilityGuardrailActive) {
    const quick = `Standard ${name.toLowerCase()} — balanced guidance, not a goal push`;
    return { quick, full: quick };
  }

  const goalWord =
    user.goal === 'lose' ? 'deficit' : user.goal === 'gain' ? 'surplus' : user.goal === 'fitness' ? 'recomp' : 'maintenance';

  if (vars.indicator === 'increase') {
    const quick = `Extra ${name.toLowerCase()} — added protein (${dish.protein}g/serving) for your ${goalWord}`;
    return {
      quick,
      full: `${quick}. Density ${vars.proteinDensity.toFixed(1)}g protein / 100 kcal · scaled to ${vars.multiplier}×.`,
    };
  }
  if (vars.indicator === 'reduce') {
    const quick = `Less ${name.toLowerCase()} — trimmed starch/fat to hold your ${goalWord}`;
    return {
      quick,
      full: `${quick}. Density ${vars.proteinDensity.toFixed(1)}g protein / 100 kcal · scaled to ${vars.multiplier}×.`,
    };
  }
  const quick = `Keep ${name.toLowerCase()} — fits the ${goalWord} plate without a quantity change`;
  return {
    quick,
    full: `${quick}. Density ${vars.proteinDensity.toFixed(1)}g protein / 100 kcal · ${vars.multiplier}× standard.`,
  };
}

function intendedMultiplier(dish: Dish, user: UserProfile, density: number, isHighProtein: boolean, isHighStarchOrFat: boolean): number {
  if (user.isLiabilityGuardrailActive) return 1;

  switch (user.goal) {
    case 'lose':
      if (isHighProtein) return 1.3;
      if (isHighStarchOrFat) return 0.6;
      return 1;
    case 'gain':
      return isHighProtein ? 1.5 : 1.25;
    case 'fitness':
      if (isHighProtein) return 1.25;
      if (isHighStarchOrFat) return 0.75;
      return 1;
    case 'maintain':
    default:
      return 1;
  }
}

export function calculateDishFitScore(
  dish: Dish,
  slot: MealSlot,
  user: UserProfile
): FitScoreBreakdown {
  const allergenMatches = dish.allergens.filter((a) =>
    user.allergies.map((u) => u.toLowerCase()).includes(a.toLowerCase())
  );
  if (allergenMatches.length > 0) {
    return {
      dishId: dish.id,
      dish,
      score: 0,
      verdict: 'Avoid',
      calorieFit: 0,
      proteinFit: 0,
      macroMatchPercentage: 0,
      isAllergenFree: false,
      isDietCompatible: true,
      reason: `Contains allergen (${allergenMatches.join(', ')})`,
      recommendedPortionSuggestion: 'Skip this dish due to food allergy',
    };
  }

  let isDietCompatible = true;
  if (user.dietPreference === 'veg') {
    if (dish.category === 'non-veg' || dish.category === 'egg') isDietCompatible = false;
  } else if (user.dietPreference === 'egg') {
    if (dish.category === 'non-veg') isDietCompatible = false;
  }

  if (!isDietCompatible) {
    return {
      dishId: dish.id,
      dish,
      score: 0,
      verdict: 'Avoid',
      calorieFit: 0,
      proteinFit: 0,
      macroMatchPercentage: 0,
      isAllergenFree: true,
      isDietCompatible: false,
      reason: `Doesn't match your ${user.dietPreference} diet preference`,
      recommendedPortionSuggestion: 'Select a vegetarian/compliant alternative',
    };
  }

  const slotRatio = MEAL_SLOT_BUDGET_RATIOS[slot] || 0.25;
  const slotCalorieBudget = user.targetCalories * slotRatio;
  const slotProteinBudget = user.targetProteinG * slotRatio;

  let score = 70;
  const proteinPer100Kcal = proteinDensity(dish);
  let reason = '';
  let portionSuggestion = `1 standard serving (${dish.portionDescription})`;

  if (user.isLiabilityGuardrailActive) {
    const calDiffRatio = Math.abs(dish.calories - slotCalorieBudget) / slotCalorieBudget;
    score = Math.max(50, Math.min(95, Math.round(90 - calDiffRatio * 35)));
    reason = 'Nutritionally balanced choice that aligns with daily energy requirements';
  } else {
    switch (user.goal) {
      case 'lose': {
        if (proteinPer100Kcal >= 6.0) {
          score += 20;
          reason = `High protein density (${dish.protein}g) preserves lean mass and keeps you full in a deficit`;
        } else if (proteinPer100Kcal >= 4.0) {
          score += 10;
          reason = 'Good balance of protein and complex nutrients';
        }
        if (dish.fat > 12) {
          score -= 15;
          reason = 'Higher fat content — consider taking a lighter portion or pairing with salad';
        }
        if (dish.calories > slotCalorieBudget * 1.3) {
          score -= 15;
          portionSuggestion = `Take a half-portion or pair with plain rotis`;
        }
        break;
      }
      case 'gain': {
        if (dish.protein >= 10) {
          score += 18;
          reason = `Excellent protein payload (${dish.protein}g) to support muscle recovery`;
        }
        if (dish.calories >= 250) {
          score += 12;
          reason = 'Wholesome calorie density supports steady mass gain';
        }
        portionSuggestion = `Generous serving (${dish.portionDescription}) to hit surplus`;
        break;
      }
      case 'fitness': {
        if (proteinPer100Kcal >= 5.0) {
          score += 22;
          reason = `Optimal protein-to-calorie ratio (${proteinPer100Kcal.toFixed(1)}g / 100 kcal) for muscle recomp`;
        } else {
          score += 5;
          reason = 'Nutrient dense wholesome mess staple';
        }
        break;
      }
      case 'maintain':
      default: {
        const calDiffRatio = Math.abs(dish.calories - slotCalorieBudget) / slotCalorieBudget;
        score = Math.max(60, Math.min(96, Math.round(92 - calDiffRatio * 30)));
        reason = `Fits cleanly into your ${slot} energy allocation`;
        break;
      }
    }
  }

  const finalScore = Math.max(25, Math.min(99, Math.round(score)));
  let verdict: FitScoreBreakdown['verdict'] = 'Good Match';
  if (finalScore >= 85) verdict = 'Top Pick';
  else if (finalScore >= 70) verdict = 'Good Match';
  else if (finalScore >= 50) verdict = 'Alternative';
  else verdict = 'Consume in Moderation';

  return {
    dishId: dish.id,
    dish,
    score: finalScore,
    verdict,
    calorieFit: Math.min(100, Math.round((dish.calories / slotCalorieBudget) * 100)),
    proteinFit: Math.min(100, Math.round((dish.protein / Math.max(1, slotProteinBudget)) * 100)),
    macroMatchPercentage: finalScore,
    isAllergenFree: true,
    isDietCompatible: true,
    reason,
    recommendedPortionSuggestion: portionSuggestion,
  };
}

function toRecommendation(
  dish: Dish,
  baseFit: FitScoreBreakdown,
  vars: AdjustmentVars,
  user: UserProfile
): MealItemRecommendation {
  const { indicator, label } = indicatorFromMultiplier(vars.multiplier, dish.portionKind, dish.standardUnits);
  const merged: AdjustmentVars = { ...vars, indicator, multiplier: vars.multiplier };
  const copy = reasonsFromVars(dish, user, merged);

  return {
    dishId: dish.id,
    dish,
    score: baseFit.score,
    isTopPick: false,
    quantityIndicator: indicator,
    indicatorLabel: label,
    recommendedServing: formatServing(dish, vars.multiplier),
    portionMultiplier: vars.multiplier,
    calories: Math.round(dish.calories * vars.multiplier),
    protein: Math.round(dish.protein * vars.multiplier * 10) / 10,
    carbs: Math.round(dish.carbs * vars.multiplier * 10) / 10,
    fat: Math.round(dish.fat * vars.multiplier * 10) / 10,
    fiber: Math.round(dish.fiber * vars.multiplier * 10) / 10,
    quickReason: copy.quick,
    fullReason: copy.full,
    isAllergenFree: baseFit.isAllergenFree,
    isDietCompatible: baseFit.isDietCompatible,
  };
}

function isGrainStaple(dish: Dish): boolean {
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
    name.includes('noodles') ||
    id.includes('biryani')
  );
}

function isPlainStaple(dish: Dish): boolean {
  const name = dish.name.toLowerCase();
  const id = dish.id.toLowerCase();
  return (
    name.includes('steamed rice') ||
    name.includes('white rice') ||
    name.includes('tawa roti') ||
    name.includes('pulka') ||
    name.includes('chapathi') ||
    name.includes('brown bread') ||
    name.includes('white bread') ||
    id.includes('steamed_rice') ||
    id.includes('tawa_roti')
  );
}

function isHighCalorieExtra(dish: Dish): boolean {
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
    name.includes('halwa') ||
    name.includes('jilebi') ||
    name.includes('badusha') ||
    name.includes('payasam') ||
    name.includes('rasamalai') ||
    id.includes('fryum') ||
    id.includes('sharbath')
  );
}

export function calculateFullMealPlan(
  availableDishes: Dish[],
  slot: MealSlot,
  user: UserProfile
): FullMealPlan {
  if (availableDishes.length === 0) {
    return {
      mealSlot: slot,
      overallFitScore: 0,
      topPickItem: null,
      items: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      slotTargets: getMealSlotTargets(slot, user),
    };
  }

  const slotRatio = MEAL_SLOT_BUDGET_RATIOS[slot] || 0.25;
  const slotCalorieBudget = Math.round(user.targetCalories * slotRatio);
  const disliked = new Set(user.dislikedDishIds || []);

  const hasNonVegMain = availableDishes.some(
    (d) => d.category === 'non-veg' || d.category === 'egg'
  );

  // 1. Initial Filtering: Strict diet, allergen & veg-replacement separation
  const eligibleDishes: Dish[] = [];
  for (const dish of availableDishes) {
    const baseFit = calculateDishFitScore(dish, slot, user);
    if (!baseFit.isAllergenFree || !baseFit.isDietCompatible) {
      continue;
    }

    // If student is non-veg and a non-veg protein main is served, exclude vegetarian substitute paneer dishes
    if (user.dietPreference === 'non-veg' && hasNonVegMain) {
      const name = dish.name.toLowerCase();
      if (
        name.includes('paneer') &&
        !name.includes('paratha') // Paneer paratha on breakfast is standard for everyone
      ) {
        continue;
      }
    }

    eligibleDishes.push(dish);
  }

  // 2. Score eligible dishes
  const scoredEligible = eligibleDishes.map((dish) => ({
    dish,
    fit: calculateDishFitScore(dish, slot, user),
  })).sort((a, b) => b.fit.score - a.fit.score);

  // 3. Identify Top Protein Anchor
  // Prioritize high-protein mains (protein >= 12g or biryani)
  const proteinMains = scoredEligible.filter(
    (s) => s.dish.protein >= 12 || isGrainStaple(s.dish)
  );
  const topAnchor = proteinMains.sort((a, b) => b.dish.protein - a.dish.protein)[0] || scoredEligible[0];
  const isTopGrain = topAnchor ? isGrainStaple(topAnchor.dish) : false;

  let currentPlateCalories = 0;
  let hasSelectedStaple = false;
  const scoredItems: MealItemRecommendation[] = [];

  for (const { dish, fit } of scoredEligible) {
    if (disliked.has(dish.id)) {
      scoredItems.push(
        toRecommendation(
          dish,
          { ...fit, score: 0 },
          {
            indicator: 'skip',
            multiplier: 0,
            proteinDensity: proteinDensity(dish),
            isHighProtein: false,
            isHighStarchOrFat: false,
            redistributedFrom: shortName(dish),
          },
          user
        )
      );
      const rec = scoredItems[scoredItems.length - 1];
      rec.quantityIndicator = 'skip';
      rec.indicatorLabel = '✕ Dislike';
      rec.recommendedServing = 'Left off plate';
      rec.quickReason = 'On your dislike list';
      rec.fullReason = rec.quickReason;
      rec.calories = 0;
      rec.protein = 0;
      rec.carbs = 0;
      rec.fat = 0;
      rec.portionMultiplier = 0;
      continue;
    }

    let indicator: 'standard' | 'increase' | 'reduce' | 'skip' = 'standard';
    let multiplier = 1.0;
    let customReason = '';

    const isAnchor = topAnchor && dish.id === topAnchor.dish.id;
    const isStaple = isPlainStaple(dish);
    const isExtra = isHighCalorieExtra(dish);
    const isSalad = dish.name.toLowerCase().includes('salad');

    if (isAnchor) {
      multiplier = user.goal === 'fitness' || user.goal === 'gain' ? 1.25 : 0.9;
      indicator = multiplier > 1 ? 'increase' : 'standard';
      customReason = `Primary protein anchor (${dish.protein}g) — boosted portion for your ${user.goal} goal`;
    } else if (isStaple) {
      if (isTopGrain) {
        // Redundant with Biryani / Pulao / Dosa
        indicator = 'skip';
        multiplier = 0;
        customReason = `${topAnchor.dish.name} already provides your complex carbohydrates — skip extra rice/roti to stay within your ${slotCalorieBudget} kcal budget`;
      } else if (hasSelectedStaple || currentPlateCalories + dish.calories > slotCalorieBudget) {
        // Choose between Roti or Rice, not both
        indicator = 'skip';
        multiplier = 0;
        customReason = 'Choose between Rice or Roti (not both) to hit your meal calorie target';
      } else {
        hasSelectedStaple = true;
        if (user.goal === 'fitness' || user.goal === 'lose') {
          multiplier = 0.75;
          indicator = 'reduce';
          customReason = 'Controlled carbohydrate portion to support fat loss and lean definition';
        } else {
          multiplier = 1.0;
          indicator = 'standard';
          customReason = 'Complex carbohydrate staple to pair with your curry';
        }
      }
    } else if (isExtra) {
      if (currentPlateCalories + dish.calories > slotCalorieBudget + 50) {
        indicator = 'skip';
        multiplier = 0;
        customReason = `Skip high-calorie extra to stay within your ${slotCalorieBudget} kcal meal target`;
      } else {
        indicator = 'reduce';
        multiplier = 0.5;
        customReason = 'Light treat portion to fit within your calorie budget';
      }
    } else if (isSalad) {
      indicator = 'standard';
      multiplier = 1.0;
      customReason = 'Fresh dietary fiber and essential micronutrients';
    } else {
      // Accompaniments (Gravy, Raita, Dal, Sambar, Sabji)
      if (currentPlateCalories + dish.calories > slotCalorieBudget + 100) {
        indicator = 'skip';
        multiplier = 0;
        customReason = 'Skip heavy secondary curry to prevent exceeding meal calorie budget';
      } else {
        indicator = 'standard';
        multiplier = 1.0;
        customReason = 'Nutrient-dense accompaniment for a balanced meal';
      }
    }

    const appliedMultiplier = applyPortionRules(dish, multiplier);
    const finalMult = indicator === 'skip' ? 0 : appliedMultiplier;

    const density = proteinDensity(dish);
    const isHighProtein = density >= 5.0 || dish.protein >= 15;
    const isHighStarchOrFat = (dish.carbs >= 35 && dish.protein < 5) || dish.fat > 12;

    const rec = toRecommendation(
      dish,
      fit,
      {
        indicator,
        multiplier: finalMult,
        proteinDensity: density,
        isHighProtein,
        isHighStarchOrFat,
      },
      user
    );

    rec.quantityIndicator = indicator;
    rec.portionMultiplier = finalMult;
    rec.calories = Math.round(dish.calories * finalMult);
    rec.protein = Math.round(dish.protein * finalMult * 10) / 10;
    rec.carbs = Math.round(dish.carbs * finalMult * 10) / 10;
    rec.fat = Math.round(dish.fat * finalMult * 10) / 10;
    rec.fiber = Math.round(dish.fiber * finalMult * 10) / 10;
    if (customReason) {
      rec.quickReason = customReason;
      rec.fullReason = customReason;
    }

    if (indicator === 'skip') {
      rec.indicatorLabel = '✕ Skip';
      rec.recommendedServing = 'Left off plate';
    } else {
      currentPlateCalories += rec.calories;
    }

    scoredItems.push(rec);
  }

  // 4. Promote Top Pick
  const eligibleItems = scoredItems.filter((i) => i.quantityIndicator !== 'skip');
  let topPickItem: MealItemRecommendation | null = null;
  if (eligibleItems.length > 0) {
    if (topAnchor) {
      topPickItem = eligibleItems.find((i) => i.dishId === topAnchor.dish.id) || eligibleItems[0];
    } else {
      topPickItem = eligibleItems[0];
    }
    if (topPickItem) {
      topPickItem.isTopPick = true;
    }
  }

  const sortedItems = [...scoredItems].sort((a, b) => {
    if (a.isTopPick) return -1;
    if (b.isTopPick) return 1;
    if (a.quantityIndicator === 'skip' && b.quantityIndicator !== 'skip') return 1;
    if (a.quantityIndicator !== 'skip' && b.quantityIndicator === 'skip') return -1;
    return b.score - a.score;
  });

  const activeItems = sortedItems.filter((i) => i.quantityIndicator !== 'skip');
  const avgFitScore =
    activeItems.length > 0
      ? Math.round(activeItems.reduce((sum, i) => sum + i.score, 0) / activeItems.length)
      : 0;

  const slotTargets = getMealSlotTargets(slot, user);

  return {
    mealSlot: slot,
    overallFitScore: avgFitScore,
    topPickItem,
    items: sortedItems,
    totalCalories: activeItems.reduce((sum, i) => sum + i.calories, 0),
    totalProtein: Math.round(activeItems.reduce((sum, i) => sum + i.protein, 0) * 10) / 10,
    totalCarbs: Math.round(activeItems.reduce((sum, i) => sum + i.carbs, 0) * 10) / 10,
    totalFat: Math.round(activeItems.reduce((sum, i) => sum + i.fat, 0) * 10) / 10,
    slotTargets,
  };
}

export function getMealRecommendations(
  availableDishes: Dish[],
  slot: MealSlot,
  user: UserProfile
): {
  topPick: FitScoreBreakdown | null;
  alternatives: FitScoreBreakdown[];
  allRanked: FitScoreBreakdown[];
  fullMealPlan: FullMealPlan;
} {
  const fullMealPlan = calculateFullMealPlan(availableDishes, slot, user);
  const ranked = availableDishes
    .map((dish) => calculateDishFitScore(dish, slot, user))
    .filter((item) => item.isDietCompatible && item.isAllergenFree)
    .sort((a, b) => b.score - a.score);

  return {
    topPick: ranked[0] || null,
    alternatives: ranked.slice(1, 4),
    allRanked: ranked,
    fullMealPlan,
  };
}
