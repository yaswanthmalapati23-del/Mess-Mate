'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Check,
  Scale,
  Clock,
  Utensils,
  CheckCheck,
  ArrowLeft,
  Calendar,
  Leaf,
  Plus,
} from 'lucide-react';
import { DailyMenuDay, MealItemRecommendation, MealSlot, UserProfile } from '@/lib/types';
import { DISH_LOOKUP } from '@/lib/data/messDishes';
import { calculateFullMealPlan } from '@/lib/nutrition/fitScore';
import { getMealSlotTargets } from '@/lib/nutrition/calculator';
import { saveStoredLog, getTodayDateStr, getStoredLogs, deleteStoredLog } from '@/lib/storage';

interface TodayPlanViewProps {
  currentDayMenu: DailyMenuDay;
  profile: UserProfile;
  onMealLogged: () => void;
  isDark?: boolean;
  onOpenProfile?: () => void;
}

const MEAL_SLOTS: { id: MealSlot; label: string; icon: string; timing: string }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: '☕', timing: '7:30 – 9:30 AM' },
  { id: 'lunch', label: 'Lunch', icon: '🍛', timing: '12:30 – 2:30 PM' },
  { id: 'snacks', label: 'Snacks', icon: '🫖', timing: '5:00 – 6:30 PM' },
  { id: 'dinner', label: 'Dinner', icon: '🍲', timing: '7:30 – 9:30 PM' },
];

export const TodayPlanView: React.FC<TodayPlanViewProps> = ({
  currentDayMenu,
  profile,
  onMealLogged,
}) => {
  const [activeSlot, setActiveSlot] = useState<MealSlot>('lunch');
  const [loggedItemsMap, setLoggedItemsMap] = useState<Record<string, boolean>>({});
  const [isFullMealLogged, setIsFullMealLogged] = useState(false);

  const todayStr = getTodayDateStr();

  // Retrieve dishes in today's menu for the selected meal slot
  const slotDishIds = currentDayMenu.slots[activeSlot] || [];
  const availableDishes = slotDishIds
    .map((id) => DISH_LOOKUP.get(id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  // Compute full-meal composition plan
  const fullMealPlan = calculateFullMealPlan(availableDishes, activeSlot, profile);
  const slotTargets = fullMealPlan.slotTargets || getMealSlotTargets(activeSlot, profile);
  const slotInfo = MEAL_SLOTS.find((s) => s.id === activeSlot) || MEAL_SLOTS[1];

  // Dynamic calories and macros
  const plateCalories = fullMealPlan.totalCalories > 0 ? fullMealPlan.totalCalories : slotTargets.calories;
  const plateProtein = fullMealPlan.totalProtein > 0 ? fullMealPlan.totalProtein : slotTargets.proteinG;
  const plateCarbs = fullMealPlan.totalCarbs > 0 ? fullMealPlan.totalCarbs : slotTargets.carbsG;
  const plateFats = fullMealPlan.totalFat > 0 ? fullMealPlan.totalFat : slotTargets.fatG;

  // Synchronize logged items from storage
  React.useEffect(() => {
    const logs = getStoredLogs().filter((l) => l.dateStr === todayStr && l.mealSlot === activeSlot);
    const map: Record<string, boolean> = {};
    logs.forEach((l) => {
      if (l.dishId) {
        map[`${activeSlot}_${l.dishId}`] = true;
      }
    });
    setLoggedItemsMap(map);

    const active = fullMealPlan.items.filter((i) => i.quantityIndicator !== 'skip');
    if (active.length > 0 && active.every((item) => map[`${activeSlot}_${item.dishId}`])) {
      setIsFullMealLogged(true);
    } else {
      setIsFullMealLogged(false);
    }
  }, [activeSlot, todayStr]);

  // Single-item log/unlog toggle handler
  const handleToggleSingleItem = (item: MealItemRecommendation) => {
    const key = `${activeSlot}_${item.dishId}`;
    const isCurrentlyLogged = Boolean(loggedItemsMap[key]);

    if (isCurrentlyLogged) {
      // Find log entry and remove it
      const existing = getStoredLogs().find(
        (l) => l.dateStr === todayStr && l.mealSlot === activeSlot && l.dishId === item.dishId
      );
      if (existing) {
        deleteStoredLog(existing.id);
      }
      setLoggedItemsMap((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setIsFullMealLogged(false);
    } else {
      saveStoredLog({
        dateStr: todayStr,
        source: 'mess',
        mealSlot: activeSlot,
        dishId: item.dishId,
        dishName: item.dish.name,
        portionCount: item.portionMultiplier,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
      });

      setLoggedItemsMap((prev) => ({ ...prev, [key]: true }));

      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#1B5E4A', '#D8E8DE', '#004534', '#AEF0D6'],
        });
      } catch (e) {}
    }

    onMealLogged();
  };

  // Full-meal log/unlog toggle handler
  const handleLogFullMeal = () => {
    const activeItems = fullMealPlan.items.filter((i) => i.quantityIndicator !== 'skip');
    if (activeItems.length === 0) return;

    if (isFullMealLogged) {
      // Unlog all active items in this slot
      activeItems.forEach((item) => {
        const existing = getStoredLogs().find(
          (l) => l.dateStr === todayStr && l.mealSlot === activeSlot && l.dishId === item.dishId
        );
        if (existing) {
          deleteStoredLog(existing.id);
        }
      });
      setLoggedItemsMap({});
      setIsFullMealLogged(false);
    } else {
      // Log all active items that are not yet logged
      const unlogged = activeItems.filter((item) => !loggedItemsMap[`${activeSlot}_${item.dishId}`]);
      unlogged.forEach((item) => {
        saveStoredLog({
          dateStr: todayStr,
          source: 'mess',
          mealSlot: activeSlot,
          dishId: item.dishId,
          dishName: item.dish.name,
          portionCount: item.portionMultiplier,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        });
      });

      const newMap: Record<string, boolean> = { ...loggedItemsMap };
      activeItems.forEach((item) => {
        newMap[`${activeSlot}_${item.dishId}`] = true;
      });
      setLoggedItemsMap(newMap);
      setIsFullMealLogged(true);

      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#1B5E4A', '#D8E8DE', '#004534', '#AEF0D6'],
        });
      } catch (e) {}
    }

    onMealLogged();
  };

  // Visually separate active recommendations from excluded/skipped items
  const activeItems = fullMealPlan.items.filter((item) => item.quantityIndicator !== 'skip');
  const skippedItems = fullMealPlan.items.filter((item) => item.quantityIndicator === 'skip');

  return (
    <div className="space-y-4 pb-24 font-sans select-none animate-fade-in text-[#143026]">
      {/* 1. HEADER SUMMARY */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-md bg-[#1B5E4A] flex items-center justify-center text-white text-[10px] font-bold select-none">
              MH
            </span>
            <span className="text-[11px] font-bold text-[#5F7A6E] uppercase tracking-wider">
              Central Mess • VIT-AP Campus
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1B5E4A] mt-0.5">
            {slotInfo.label} Nutrition Plan
          </h2>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#D8E8DE] text-[#1B5E4A] text-xs font-bold shadow-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>{slotInfo.timing}</span>
        </div>
      </div>

      {/* 2. MEAL SLOT SELECTOR TABS */}
      <div className="grid grid-cols-4 gap-1.5 bg-white p-1.5 rounded-2xl border border-[#A9BFB5]/25 shadow-xs">
        {MEAL_SLOTS.map((slot) => {
          const isActive = activeSlot === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => {
                setActiveSlot(slot.id);
                setIsFullMealLogged(false);
              }}
              className={`py-2 px-1 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#1B5E4A] text-white shadow-sm font-bold active:scale-95'
                  : 'text-[#5F7A6E] hover:text-[#143026] hover:bg-[#F5F3EE] font-medium'
              }`}
            >
              <div className="text-sm leading-none mb-1">{slot.icon}</div>
              <div className="text-[11px] font-bold truncate tracking-tight">{slot.label}</div>
            </button>
          );
        })}
      </div>

      {/* 3. ARCH CANOPY SUGGESTED SERVING HERO CARD */}
      <div className="w-full bg-white rounded-t-[36px] rounded-b-[24px] p-5 shadow-[0_8px_24px_rgba(20,48,38,0.06)] relative overflow-hidden border border-[#A9BFB5]/20">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#D8E8DE]/40 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[11px] font-bold text-[#5F7A6E] uppercase tracking-wider">
              Suggested Serving
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-[#1B5E4A] tracking-tight">
                {plateCalories}
              </span>
              <span className="text-sm font-semibold text-[#5F7A6E]">/ {slotTargets.calories} kcal</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B5E4A] text-white shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-[#AEF0D6]" />
            <span className="text-xs font-bold">Target Plate</span>
          </div>
        </div>

        {/* 3-Column Macro Breakdown */}
        <div className="grid grid-cols-3 gap-2 mt-4 bg-[#F5F3EE] rounded-2xl p-2.5 relative z-10">
          {/* Protein */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white shadow-xs">
            <span className="text-[11px] font-semibold text-[#5F7A6E]">Protein</span>
            <span className="text-xs font-bold text-[#1B5E4A] mt-0.5">{plateProtein}g</span>
            <div className="w-full bg-[#D8E8DE] rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-[#1B5E4A] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (plateProtein / Math.max(1, slotTargets.proteinG)) * 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-[#5F7A6E] mt-1 font-medium">Goal: {slotTargets.proteinG}g</span>
          </div>

          {/* Carbs */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white shadow-xs">
            <span className="text-[11px] font-semibold text-[#5F7A6E]">Carbs</span>
            <span className="text-xs font-bold text-[#143026] mt-0.5">{plateCarbs}g</span>
            <div className="w-full bg-[#D8E8DE] rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-[#53625A] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (plateCarbs / Math.max(1, slotTargets.carbsG)) * 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-[#5F7A6E] mt-1 font-medium">Goal: {slotTargets.carbsG}g</span>
          </div>

          {/* Fats */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white shadow-xs">
            <span className="text-[11px] font-semibold text-[#5F7A6E]">Fats</span>
            <span className="text-xs font-bold text-[#143026] mt-0.5">{plateFats}g</span>
            <div className="w-full bg-[#D8E8DE] rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-[#53625A] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (plateFats / Math.max(1, slotTargets.fatG)) * 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-[#5F7A6E] mt-1 font-medium">Goal: {slotTargets.fatG}g</span>
          </div>
        </div>
      </div>

      {/* 4. GUIDED CAMPUS PLATE CHECKLIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🍽️</span>
            <h3 className="text-sm font-bold text-[#1B5E4A]">Guided Campus Plate</h3>
          </div>
          <span className="text-[11px] text-[#5F7A6E]">Tap item to log</span>
        </div>

        {/* ACTIVE / RECOMMENDED ITEMS (Full card, clean original Google Stitch botanical style) */}
        <div className="space-y-2">
          {activeItems.map((item) => {
            const isItemLogged = loggedItemsMap[`${activeSlot}_${item.dishId}`];

            return (
              <div
                key={item.dishId}
                onClick={() => handleToggleSingleItem(item)}
                className={`rounded-2xl p-3.5 shadow-xs border transition-all cursor-pointer flex items-center gap-3 ${
                  isItemLogged
                    ? 'border-[#1B5E4A] bg-[#D8E8DE]/30'
                    : 'border-[#A9BFB5]/25 bg-white hover:border-[#1B5E4A]/50'
                }`}
              >
                {/* Selection Check Circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isItemLogged
                      ? 'bg-[#1B5E4A] text-white'
                      : 'border-2 border-[#A9BFB5] bg-[#F5F3EE]'
                  }`}
                >
                  {isItemLogged && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <h4 className="text-xs font-bold text-[#143026] leading-tight truncate">
                      {item.dish.name}
                    </h4>
                    {item.isTopPick && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D8E8DE] text-[#1B5E4A] text-[9px] font-bold shrink-0">
                        Top Pick
                      </span>
                    )}
                  </div>

                  {/* One Combined Line: quantity + unit · kcal · protein · carbs */}
                  <div className="text-xs text-[#5F7A6E] mt-0.5 flex items-center gap-1.5 flex-wrap truncate">
                    <span className="text-[#143026] font-medium">{item.recommendedServing}</span>
                    <span>•</span>
                    <span className="text-[#1B5E4A] font-bold">{item.calories} kcal</span>
                    <span>•</span>
                    <span className="text-[#143026] font-medium">{item.protein}g Protein</span>
                    <span>•</span>
                    <span className="text-[#5F7A6E]">{item.carbs}g Carbs</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* EXCLUDED / SKIPPED ITEMS (Single thin row, ~1/3 height, muted strikethrough, no macros/checkbox) */}
        {skippedItems.length > 0 && (
          <div className="pt-2 border-t border-[#A9BFB5]/30 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F7A6E] px-1">
              Left Off Plate
            </span>
            {skippedItems.map((item) => (
              <div
                key={item.dishId}
                className="py-1.5 px-3 rounded-lg flex items-center justify-between text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs line-through text-gray-400 font-medium truncate">
                  {item.dish.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                  Skip today
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-[#A9BFB5]/30 p-3 shadow-lg">
        <div className="max-w-md mx-auto">
          {isFullMealLogged ? (
            <div className="w-full h-12 rounded-full bg-[#D8E8DE] border border-[#1B5E4A]/30 text-[#1B5E4A] text-xs font-bold flex items-center justify-center gap-2">
              <CheckCheck className="w-4 h-4 text-[#1B5E4A]" />
              <span>Plate Logged ({plateCalories} kcal • {plateProtein}g Protein)</span>
            </div>
          ) : (
            <button
              onClick={handleLogFullMeal}
              className="w-full h-12 rounded-full bg-[#1B5E4A] hover:bg-[#004534] active:scale-[0.99] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Log this Plate ({plateCalories} kcal)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
