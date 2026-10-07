export type GoalType = 'lose' | 'maintain' | 'gain' | 'fitness';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
export type DietPreference = 'veg' | 'non-veg' | 'egg';
export type MessType = 'non-veg' | 'veg' | 'special';
export type MealSlot = 'breakfast' | 'lunch' | 'snacks' | 'dinner';
export type PortionStatus = 'measured' | 'estimated';
export type PortionKind = 'scalable' | 'discrete';

export interface Allergen {
  id: string;
  name: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  hostelBlock: string; // e.g. "Hostel 3", "Block B"
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  dietPreference: DietPreference;
  messType?: MessType; // 'non-veg' | 'veg' | 'special'
  allergies: string[]; // ['dairy', 'nuts', 'gluten', 'eggs', 'soy']
  dislikedDishIds: string[]; // Menu-item dislikes, separate from allergies
  hasMedicalCondition: boolean; // Flagged in screening question
  medicalNotes?: string;
  
  // Computed targets
  bmr: number;
  tdee: number;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  bmi: number;
  isExtremeBmi: boolean;
  calorieFloorTriggered: boolean;
  isLiabilityGuardrailActive: boolean;
}

export interface IFCTIngredient {
  id: string;
  code: string; // IFCT Code, e.g. "A001"
  name: string;
  category: 'Cereals' | 'Pulses & Legumes' | 'Vegetables' | 'Dairy' | 'Meat & Poultry' | 'Eggs' | 'Oils & Fats' | 'Spices & Condiments' | 'Fruits' | 'Nuts & Seeds';
  calories: number; // per 100g
  protein: number; // g per 100g
  carbs: number; // g per 100g
  fat: number; // g per 100g
  fiber: number; // g per 100g
  commonMeasureNote?: string;
  allergens?: string[];
}

export interface DishIngredientComposition {
  ingredientId: string;
  rawGrams: number;
}

export interface Dish {
  id: string;
  name: string;
  mealSlots: MealSlot[]; // Can be served in breakfast, lunch, etc.
  category: DietPreference;
  allergens: string[];
  portionDescription: string; // e.g., "1 standard mess ladle (~150ml)", "2 medium rotis", "1 katori"
  portionSizeGrams: number;
  portionStatus: PortionStatus; // 'measured' vs 'estimated'
  portionKind: PortionKind; // ladle/scoop vs whole-unit (roti, egg, piece)
  standardUnits: number; // 1 ladle or 2 rotis
  maxUnits: number; // mess counter cap
  ingredients: DishIngredientComposition[];
  
  // Calculated per standard portion
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description?: string;
}

export interface DailyMenuDay {
  dayNumber: number; // 1 to 30
  dayOfWeek: string; // "Monday", "Tuesday", etc.
  slots: {
    breakfast: string[]; // dish IDs
    lunch: string[];
    snacks: string[];
    dinner: string[];
  };
}

export type QuantityIndicator = 'increase' | 'standard' | 'reduce' | 'skip';

export interface MealItemRecommendation {
  dishId: string;
  dish: Dish;
  score: number; // 0 to 100
  isTopPick: boolean;
  quantityIndicator: QuantityIndicator;
  indicatorLabel: string; // "↑ Increase", "↓ Reduce", "✓ Standard", "✕ Skip today"
  recommendedServing: string; // e.g. "2 ladles (~300g)", "1 roti (~30g)"
  portionMultiplier: number; // e.g. 1.5, 1.0, 0.5, 0
  calories: number; // Scaled to recommended portion
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  quickReason: string; // 1-line summary visible on compact card
  fullReason: string; // Detailed rationale visible on expand
  isAllergenFree: boolean;
  isDietCompatible: boolean;
}

export interface MealSlotTargets {
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}

export interface FullMealPlan {
  mealSlot: MealSlot;
  overallFitScore: number;
  topPickItem: MealItemRecommendation | null;
  items: MealItemRecommendation[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  slotTargets?: MealSlotTargets;
}

export interface FitScoreBreakdown {
  dishId: string;
  dish: Dish;
  score: number; // 0 to 100
  verdict: 'Top Pick' | 'Good Match' | 'Alternative' | 'Consume in Moderation' | 'Avoid';
  calorieFit: number;
  proteinFit: number;
  macroMatchPercentage: number;
  isAllergenFree: boolean;
  isDietCompatible: boolean;
  reason: string;
  recommendedPortionSuggestion: string;
}

export interface FoodCourtShop {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  priceRange: string;
  popularItemName: string;
}

export interface FoodCourtItem {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  price: number; // Price in INR (₹)
  category: DietPreference;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  allergens: string[];
  portionDescription: string;
  isPopular?: boolean;
  isBestValue?: boolean; // Highlighted for highest protein-per-rupee
  proteinPerRupee?: number; // Calculated ratio
}

export interface MealLogItem {
  id: string;
  timestamp: string;
  dateStr: string; // YYYY-MM-DD
  dishId: string;
  dishName: string;
  source: 'mess' | 'food_court';
  mealSlot: MealSlot;
  portionCount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyTrackingSummary {
  dateStr: string;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  calorieTarget: number;
  proteinTarget: number;
  isProteinGoalMet: boolean;
  loggedCount: number;
}

export type AuthStep = 'login' | 'signup_email' | 'signup_otp' | 'create_password' | 'forgot_password';

export interface StudentAccount {
  id: string; // auth.users UUID
  email: string;
  collegeDomain: string;
  onboardingCompleted: boolean;
  profile?: UserProfile;
}

export type AdminRole = 'admin' | 'mess_committee' | 'superadmin';

export interface AdminUser {
  id: string;
  userId: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}

export interface CsvMenuRow {
  date: string; // YYYY-MM-DD or Day 1-30
  meal: MealSlot;
  dishName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: DietPreference;
  isOptIn: boolean;
  allergens: string[];
  matchedDishId?: string;
  isNewDish?: boolean;
  rowNumber: number;
}

export interface MenuValidationError {
  rowNumber: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface FoodCourtItemAdmin extends FoodCourtItem {
  isAvailable?: boolean;
}

export interface FitScoreBucket {
  range: '80-100' | '60-79' | '40-59' | '<40';
  label: string;
  count: number;
  percentage: number;
}

export interface GoalDistribution {
  goal: GoalType;
  label: string;
  count: number;
  percentage: number;
}

export interface MealSlotLoggingRate {
  slot: MealSlot;
  label: string;
  loggedCount: number;
  percentage: number;
}

export interface DishPopularityMetric {
  dishName: string;
  dishId: string;
  logCount: number;
  category: DietPreference;
}

export interface AggregateAnalytics {
  totalRegisteredStudents: number;
  dau: number; // Daily Active Users
  wau: number; // Weekly Active Users
  overallLoggingRateToday: number; // % of registered students who logged today
  mealSlotRates: MealSlotLoggingRate[];
  mostLoggedDishes: DishPopularityMetric[];
  leastLoggedDishes: DishPopularityMetric[];
  fitScoreDistribution: FitScoreBucket[];
  goalDistribution: GoalDistribution[];
  lastUpdated: string;
}

