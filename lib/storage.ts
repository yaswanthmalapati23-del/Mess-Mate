import { DailyMenuDay, DailyTrackingSummary, MealLogItem, UserProfile, FoodCourtItem, MessType } from './types';
import { MONTHLY_MESS_MENU, getMessMonthlyMenu } from './data/monthlyMenuData';
import { FOOD_COURT_ITEMS } from './data/foodCourtItems';
import { calculateNutritionProfile } from './nutrition/calculator';

const STORAGE_KEYS = {
  PROFILE: 'mess_mate_profile',
  LOGS: 'mess_mate_logs',
  CUSTOM_MENU: 'mess_mate_monthly_menu_v2',
  STREAK_INFO: 'mess_mate_streak_info',
  SKIP_COUNTS: 'mess_mate_skip_counts',
};

export const DEFAULT_PROFILE: UserProfile = calculateNutritionProfile({
  name: 'Student',
  hostelBlock: 'MH-1 (Boys Hostel)',
  age: 20,
  gender: 'male',
  heightCm: 172,
  weightKg: 65,
  activityLevel: 'moderately_active',
  goal: 'fitness',
  dietPreference: 'non-veg',
  messType: 'non-veg',
  allergies: [],
  hasMedicalCondition: false,
});

export function getStoredProfile(): UserProfile | null {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Discard legacy mock profile so real students are asked for their metrics
    if (parsed && parsed.name === 'Arjun Verma') {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      return null;
    }
    return {
      ...parsed,
      messType: parsed.messType || 'non-veg',
      dislikedDishIds: Array.isArray(parsed.dislikedDishIds) ? parsed.dislikedDishIds : [],
    };
  } catch (e) {
    console.error('Error reading profile from localStorage', e);
    return null;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to localStorage', e);
  }
}

export function getStoredLogs(): MealLogItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading logs from localStorage', e);
    return [];
  }
}

export function saveStoredLog(logItem: Omit<MealLogItem, 'id' | 'timestamp'>): MealLogItem {
  const fullItem: MealLogItem = {
    ...logItem,
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  if (typeof window === 'undefined') return fullItem;

  try {
    const current = getStoredLogs();
    const updated = [fullItem, ...current];
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('mess_mate_logs_updated'));
  } catch (e) {
    console.error('Error saving meal log', e);
  }

  return fullItem;
}

export function saveStoredLogsBatch(logItems: Omit<MealLogItem, 'id' | 'timestamp'>[]): MealLogItem[] {
  const newItems: MealLogItem[] = logItems.map((item, idx) => ({
    ...item,
    id: `log_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  }));

  if (typeof window === 'undefined') return newItems;

  try {
    const current = getStoredLogs();
    const updated = [...newItems, ...current];
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('mess_mate_logs_updated'));
  } catch (e) {
    console.error('Error saving batch meal logs', e);
  }

  return newItems;
}

export function deleteStoredLog(logId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredLogs();
    const filtered = current.filter((l) => l.id !== logId);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(filtered));
    window.dispatchEvent(new Event('mess_mate_logs_updated'));
  } catch (e) {
    console.error('Error deleting meal log', e);
  }
}

export function clearTodayLogs(dateStr: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredLogs();
    const filtered = current.filter((l) => l.dateStr !== dateStr);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(filtered));
    window.dispatchEvent(new Event('mess_mate_logs_updated'));
  } catch (e) {
    console.error('Error clearing today logs', e);
  }
}

export function getMonthlyMenu(messType?: MessType): DailyMenuDay[] {
  const defaultMenu = getMessMonthlyMenu(messType);
  if (typeof window === 'undefined') return defaultMenu;
  try {
    const key = messType && messType !== 'non-veg' ? `${STORAGE_KEYS.CUSTOM_MENU}_${messType}` : STORAGE_KEYS.CUSTOM_MENU;
    const raw = localStorage.getItem(key);
    if (!raw) return defaultMenu;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading menu from localStorage', e);
    return defaultMenu;
  }
}

export function saveCustomMonthlyMenu(menu: DailyMenuDay[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_MENU, JSON.stringify(menu));
  } catch (e) {
    console.error('Error saving custom menu', e);
  }
}

export function resetMenuToDefault(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_MENU);
}

export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaySummary(dateStr: string, user: UserProfile): DailyTrackingSummary {
  const logs = getStoredLogs().filter((l) => l.dateStr === dateStr);
  const caloriesConsumed = logs.reduce((sum, l) => sum + l.calories, 0);
  const proteinConsumed = Math.round(logs.reduce((sum, l) => sum + l.protein, 0) * 10) / 10;
  const carbsConsumed = Math.round(logs.reduce((sum, l) => sum + l.carbs, 0) * 10) / 10;
  const fatConsumed = Math.round(logs.reduce((sum, l) => sum + l.fat, 0) * 10) / 10;

  return {
    dateStr,
    caloriesConsumed,
    proteinConsumed,
    carbsConsumed,
    fatConsumed,
    calorieTarget: user.targetCalories,
    proteinTarget: user.targetProteinG,
    isProteinGoalMet: proteinConsumed >= user.targetProteinG * 0.85,
    loggedCount: logs.length,
  };
}

export function calculateStreak(): { currentStreak: number; bestStreak: number } {
  const logs = getStoredLogs();
  if (logs.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const loggedDates = Array.from(new Set(logs.map((l) => l.dateStr))).sort().reverse();
  const today = getTodayDateStr();

  let streak = 0;
  let checkDate = new Date();

  // If today isn't logged yet, check if yesterday was logged to preserve streak
  const hasToday = loggedDates.includes(today);
  if (!hasToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (let i = 0; i < 30; i++) {
    const y = checkDate.getFullYear();
    const m = String(checkDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkDate.getDate()).padStart(2, '0');
    const targetStr = `${y}-${m}-${d}`;

    if (loggedDates.includes(targetStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { currentStreak: streak, bestStreak: Math.max(streak, 7) };
}

export function getStoredFoodCourtItems(): FoodCourtItem[] {
  if (typeof window === 'undefined') return FOOD_COURT_ITEMS;
  try {
    const raw = localStorage.getItem('mess_mate_food_court_items');
    if (!raw) return FOOD_COURT_ITEMS;
    const parsed = JSON.parse(raw);
    return parsed.length > 0 ? parsed : FOOD_COURT_ITEMS;
  } catch (e) {
    return FOOD_COURT_ITEMS;
  }
}

export function saveStoredFoodCourtItems(items: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('mess_mate_food_court_items', JSON.stringify(items));
  } catch (e) {
    console.error('Error saving food court items', e);
  }
}

export function getSkipCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SKIP_COUNTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordDidNotEat(dishId: string): string[] {
  const counts = getSkipCounts();
  counts[dishId] = (counts[dishId] || 0) + 1;
  try {
    localStorage.setItem(STORAGE_KEYS.SKIP_COUNTS, JSON.stringify(counts));
  } catch {}
  return Object.entries(counts)
    .filter(([, n]) => n >= 3)
    .map(([id]) => id);
}

export function getSoftDislikedDishIds(): string[] {
  return Object.entries(getSkipCounts())
    .filter(([, n]) => n >= 3)
    .map(([id]) => id);
}
