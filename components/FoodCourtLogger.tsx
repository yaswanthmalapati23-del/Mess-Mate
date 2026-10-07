'use client';

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Plus,
  Check,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Leaf,
  Store,
} from 'lucide-react';
import { FoodCourtItem, UserProfile } from '@/lib/types';
import {
  FOOD_COURT_SHOPS,
  RAW_FOOD_COURT_ITEMS,
  enrichFoodCourtItems,
} from '@/lib/data/foodCourtItems';
import { saveStoredLog, getStoredLogs, getTodayDateStr } from '@/lib/storage';

interface FoodCourtLoggerProps {
  profile: UserProfile;
  onLogUpdated: () => void;
}

const CATEGORY_CHIPS = [
  'All Outlets',
  'Under 300 kcal',
  'High Protein (>20g)',
  'Fresh Juices',
  'South Kiosk',
  'Rolls & Wraps',
];

export const FoodCourtLogger: React.FC<FoodCourtLoggerProps> = ({
  profile,
  onLogUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Outlets');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const todayStr = getTodayDateStr();
  const allLogs = getStoredLogs();
  const todayLogs = allLogs.filter((l) => l.dateStr === todayStr);

  const caloriesConsumed = todayLogs.reduce((sum, l) => sum + l.calories, 0);
  const targetCalories = profile.targetCalories || 2100;
  const remainingCalories = Math.max(0, targetCalories - caloriesConsumed);

  const enrichedItems = useMemo(() => {
    return enrichFoodCourtItems(RAW_FOOD_COURT_ITEMS, profile.goal);
  }, [profile.goal]);

  const handleLogFoodCourtItem = (item: FoodCourtItem) => {
    saveStoredLog({
      dateStr: todayStr,
      source: 'food_court',
      mealSlot: 'snacks',
      dishId: item.id,
      dishName: `${item.name} (${item.shopName})`,
      portionCount: 1.0,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
    });

    setSuccessNotice(`Logged ${item.name} (₹${item.price})!`);
    setTimeout(() => setSuccessNotice(null), 2500);

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.85 },
        colors: ['#1B5E4A', '#D8E8DE', '#004534', '#AEF0D6'],
      });
    } catch (e) {}

    onLogUpdated();
  };

  const filteredItems = useMemo(() => {
    return enrichedItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shopName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = (() => {
        if (selectedCategory === 'All Outlets') return true;
        if (selectedCategory === 'Under 300 kcal') return item.calories < 300;
        if (selectedCategory === 'High Protein (>20g)') return item.protein >= 20;
        if (selectedCategory === 'Fresh Juices')
          return item.name.toLowerCase().includes('juice') || item.shopName.toLowerCase().includes('juice');
        if (selectedCategory === 'South Kiosk')
          return item.shopName.toLowerCase().includes('dakshin') || item.name.toLowerCase().includes('dosa') || item.name.toLowerCase().includes('idli');
        if (selectedCategory === 'Rolls & Wraps')
          return item.name.toLowerCase().includes('roll') || item.name.toLowerCase().includes('wrap');
        return true;
      })();

      return matchesSearch && matchesCategory;
    });
  }, [enrichedItems, searchTerm, selectedCategory]);

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* 1. HERO CAMPUS CONTEXT ARCH BANNER */}
      <div className="w-full bg-[#F5F3EE] rounded-t-[40px] rounded-b-[24px] p-5 relative overflow-hidden shadow-xs border border-[#A9BFB5]/20">
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1B5E4A] animate-pulse"></span>
            <span className="text-[11px] font-bold text-[#5F7A6E] uppercase tracking-wider">
              Campus Dining Active Now
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#143026]">Food Court &amp; Canteen</h2>
          <p className="text-xs text-[#5F7A6E]">
            Rock Plaza &amp; Student Activity Center (SAC) Outlets
          </p>
        </div>

        <div className="mt-3.5 pt-2 flex items-center justify-between relative z-10 border-t border-[#A9BFB5]/20">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-[#1B5E4A]" />
            <span className="text-xs font-bold text-[#1B5E4A]">
              Clean Ingredients &amp; Nutri-Tracking
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#5F7A6E] shadow-xs">
            12 Open
          </span>
        </div>

        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#D8E8DE]/40 pointer-events-none" />
      </div>

      {/* 2. SEARCH BAR COMPONENT */}
      <div className="relative flex items-center w-full h-[50px] bg-white rounded-full shadow-xs px-4 border border-[#A9BFB5]/30">
        <Search className="w-4 h-4 text-[#1B5E4A] shrink-0 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search shawarma, dosa, juice, wraps..."
          className="w-full bg-transparent text-xs text-[#143026] placeholder:text-[#5F7A6E] focus:outline-hidden"
        />
        <button
          type="button"
          aria-label="Filter"
          className="w-8 h-8 rounded-full bg-[#D8E8DE]/50 flex items-center justify-center text-[#1B5E4A] shrink-0 ml-1 hover:bg-[#D8E8DE]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. HORIZONTAL SCROLLABLE CATEGORY CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
        {CATEGORY_CHIPS.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isActive
                  ? 'bg-[#1B5E4A] text-white shadow-sm'
                  : 'bg-white text-[#5F7A6E] hover:bg-[#D8E8DE]/40 border border-[#A9BFB5]/20'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. FEATURED NUTRITION HIGHLIGHT PILL */}
      <div className="flex items-center justify-between bg-[#F5F3EE] px-4 py-2.5 rounded-2xl border border-[#A9BFB5]/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#D8E8DE] flex items-center justify-center text-[#1B5E4A]">
            <Flame className="w-3.5 h-3.5 text-[#1B5E4A]" />
          </div>
          <span className="text-xs font-bold text-[#143026]">
            Target Intake: {remainingCalories.toLocaleString()} kcal left today
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#1B5E4A]">Track Live</span>
      </div>

      {/* Success notification */}
      {successNotice && (
        <div className="bg-[#D8E8DE] border border-[#1B5E4A]/30 text-[#1B5E4A] px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-[#1B5E4A]" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* 5. VENDOR FOOD CARDS FEED */}
      <div className="flex flex-col gap-3">
        {filteredItems.map((item) => {
          const isVeg = item.category === 'veg';
          return (
            <article
              key={item.id}
              className="bg-white rounded-[24px] overflow-hidden shadow-xs border border-[#A9BFB5]/20 flex flex-col transition-transform active:scale-[0.99]"
            >
              {/* Banner Area */}
              <div className="relative h-28 w-full bg-[#F5F3EE] flex items-start justify-between p-3 border-b border-[#A9BFB5]/15">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isVeg ? 'bg-emerald-600' : 'bg-amber-700'
                    }`}
                  />
                  <span className="text-[10px] font-bold text-[#143026]">
                    {isVeg ? 'Veg Delicacy' : 'Non-Veg Pick'}
                  </span>
                </div>

                {item.isBestValue && (
                  <span className="px-2.5 py-1 rounded-full bg-[#1B5E4A] text-white text-[10px] font-bold shadow-xs">
                    Campus Special
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#143026] leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#5F7A6E] flex items-center gap-1 mt-0.5">
                      <Store className="w-3 h-3 text-[#5F7A6E]" />
                      {item.shopName} • Rock Plaza
                    </p>
                  </div>
                  <span className="text-base font-extrabold text-[#1B5E4A] shrink-0">
                    ₹{item.price}
                  </span>
                </div>

                {/* Macro Badges */}
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5F3EE] text-[#143026] text-[11px] font-bold">
                    {item.calories} kcal
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5F3EE] text-[#5F7A6E] text-[11px] font-bold">
                    {item.protein}g Protein
                  </span>
                </div>

                {/* Bottom Action Row */}
                <div className="mt-3 flex items-center justify-between pt-1 border-t border-gray-100">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D8E8DE] text-[#1B5E4A] text-[10px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fits your deficit goal</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLogFoodCourtItem(item)}
                    className="flex items-center gap-1 h-8 px-3.5 rounded-full bg-[#1B5E4A] hover:bg-[#004534] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-[#A9BFB5]/40 p-6">
            <p className="text-xs text-[#5F7A6E] font-medium">
              No matching items found for &quot;{searchTerm}&quot; in {selectedCategory}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
