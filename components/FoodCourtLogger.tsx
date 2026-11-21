'use client';

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Plus,
  Check,
  CheckCircle2,
  ArrowLeft,
  Flame,
  Leaf,
  Store,
  SlidersHorizontal,
} from 'lucide-react';
import { FoodCourtItem, FoodCourtShop, UserProfile } from '@/lib/types';
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

// Exact brand styling matching the physical store menus and WhatsApp screenshots
const OUTLET_THEMES: Record<
  string,
  {
    bg: string;
    gradient: string;
    textColor: string;
    subtextColor: string;
    badgeBg: string;
    badgeText: string;
    circleBg: string;
  }
> = {
  shop_cake_stories: {
    bg: '#E91E63',
    gradient: 'linear-gradient(135deg, #FF1867 0%, #D81B60 100%)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    badgeBg: 'rgba(0, 0, 0, 0.28)',
    badgeText: '#FFFFFF',
    circleBg: 'rgba(255, 255, 255, 0.25)',
  },
  shop_zuzu: {
    bg: '#F5BA13',
    gradient: 'linear-gradient(135deg, #FDC726 0%, #E6AC0C 100%)',
    textColor: '#141000', // High contrast dark charcoal on golden yellow
    subtextColor: 'rgba(20, 16, 0, 0.85)',
    badgeBg: 'rgba(20, 16, 0, 0.14)',
    badgeText: '#141000',
    circleBg: 'rgba(20, 16, 0, 0.08)',
  },
  shop_bits_bites: {
    bg: '#22A34A',
    gradient: 'linear-gradient(135deg, #28A745 0%, #15803D 100%)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    badgeBg: 'rgba(0, 0, 0, 0.25)',
    badgeText: '#FFFFFF',
    circleBg: 'rgba(255, 255, 255, 0.22)',
  },
  shop_shakers_movers: {
    bg: '#00A8B5',
    gradient: 'linear-gradient(135deg, #00A8B5 0%, #00828E 100%)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    badgeBg: 'rgba(0, 0, 0, 0.25)',
    badgeText: '#FFFFFF',
    circleBg: 'rgba(255, 255, 255, 0.22)',
  },
  shop_ice_cream_bakery: {
    bg: '#5B2C98',
    gradient: 'linear-gradient(135deg, #6C35B3 0%, #4D1E87 100%)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    badgeBg: 'rgba(0, 0, 0, 0.28)',
    badgeText: '#FFFFFF',
    circleBg: 'rgba(255, 255, 255, 0.22)',
  },
  shop_coffee_shop: {
    bg: '#604332',
    gradient: 'linear-gradient(135deg, #6F4E37 0%, #452D1C 100%)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    badgeBg: 'rgba(0, 0, 0, 0.32)',
    badgeText: '#FFFFFF',
    circleBg: 'rgba(255, 255, 255, 0.22)',
  },
  shop_oasis_kitchens: {
    bg: '#F35B25',
    gradient: 'linear-gradient(135deg, #F35B25 0%, #D4420E 100%)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    badgeBg: 'rgba(0, 0, 0, 0.25)',
    badgeText: '#FFFFFF',
    circleBg: 'rgba(255, 255, 255, 0.22)',
  },
};

export const FoodCourtLogger: React.FC<FoodCourtLoggerProps> = ({
  profile,
  onLogUpdated,
}) => {
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
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

  const selectedShop = useMemo(() => {
    return FOOD_COURT_SHOPS.find((s) => s.id === selectedShopId) || null;
  }, [selectedShopId]);

  const activeTheme = selectedShop ? OUTLET_THEMES[selectedShop.id] : null;

  const handleSelectShop = (shopId: string) => {
    setSelectedShopId(shopId);
    setSelectedSubcategory('All');
    setSearchTerm('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToShops = () => {
    setSelectedShopId(null);
    setSelectedSubcategory('All');
    setSearchTerm('');
  };

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

  // Filter items based on current view, search, subcategory, and diet
  const visibleItems = useMemo(() => {
    return enrichedItems.filter((item) => {
      // 1. If in shop view, match shopId
      if (selectedShopId && item.shopId !== selectedShopId) {
        return false;
      }

      // 2. Subcategory filter inside shop
      if (
        selectedShopId &&
        selectedSubcategory !== 'All' &&
        item.subcategory !== selectedSubcategory
      ) {
        return false;
      }

      // 3. Search query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesShop = item.shopName.toLowerCase().includes(query);
        const matchesSubcat = item.subcategory?.toLowerCase().includes(query);
        if (!matchesName && !matchesShop && !matchesSubcat) {
          return false;
        }
      }

      // 4. Diet filter
      if (dietFilter === 'veg' && item.category !== 'veg') return false;
      if (dietFilter === 'non-veg' && item.category === 'veg') return false;

      return true;
    });
  }, [enrichedItems, selectedShopId, selectedSubcategory, searchTerm, dietFilter]);

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* 1. TOP HERO CONTEXT BANNER */}
      <div className="w-full bg-[#F5F3EE] rounded-t-[36px] rounded-b-[24px] p-5 relative overflow-hidden shadow-xs border border-[#A9BFB5]/20">
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1B5E4A] animate-pulse"></span>
            <span className="text-[11px] font-bold text-[#5F7A6E] uppercase tracking-wider">
              Food Street Campus Dining Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#143026]">
            {selectedShop ? selectedShop.name : 'Food Street Outlets'}
          </h2>
          <p className="text-xs text-[#5F7A6E]">
            {selectedShop
              ? selectedShop.tagline
              : 'Rock Plaza & Student Activity Center (SAC) Real Food Outlets'}
          </p>
        </div>

        <div className="mt-3.5 pt-2 flex items-center justify-between relative z-10 border-t border-[#A9BFB5]/20">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-[#1B5E4A]" />
            <span className="text-xs font-bold text-[#1B5E4A]">
              7 Campus Outlets Live
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#5F7A6E] shadow-xs">
            Open Now
          </span>
        </div>

        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#D8E8DE]/40 pointer-events-none" />
      </div>

      {/* 2. TARGET CALORIE INTAKE PILL */}
      <div className="flex items-center justify-between bg-[#F5F3EE] px-4 py-2.5 rounded-2xl border border-[#A9BFB5]/20 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#D8E8DE] flex items-center justify-center text-[#1B5E4A]">
            <Flame className="w-3.5 h-3.5 text-[#1B5E4A]" />
          </div>
          <span className="text-xs font-bold text-[#143026]">
            Today&apos;s Target: {remainingCalories.toLocaleString()} kcal left
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#1B5E4A]">Live Sync</span>
      </div>

      {/* Success notification */}
      {successNotice && (
        <div className="bg-[#D8E8DE] border border-[#1B5E4A]/30 text-[#1B5E4A] px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-[#1B5E4A]" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW A: STORE SELECTION GRID (Appears First)             */}
      {/* ======================================================== */}
      {!selectedShop && (
        <div className="space-y-4">
          {/* Search bar across all outlets */}
          <div className="relative flex items-center w-full h-[50px] bg-white rounded-full shadow-xs px-4 border border-[#A9BFB5]/30">
            <Search className="w-4 h-4 text-[#1B5E4A] shrink-0 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search across outlets or dish names..."
              className="w-full bg-transparent text-xs text-[#143026] placeholder:text-[#5F7A6E] focus:outline-hidden"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-xs font-bold text-[#5F7A6E] hover:text-[#143026] mr-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Section Heading */}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold text-[#143026] tracking-tight">
              Select an Outlet to View Menu
            </h3>
            <span className="text-[11px] font-bold text-[#5F7A6E]">
              {FOOD_COURT_SHOPS.length} Outlets
            </span>
          </div>

          {/* 2-Column Food Street Outlets Grid with Guaranteed High-Contrast Colors */}
          <div className="grid grid-cols-2 gap-3.5">
            {FOOD_COURT_SHOPS.filter((shop) => {
              if (!searchTerm) return true;
              return (
                shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shop.tagline.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }).map((shop) => {
              const shopItemCount = RAW_FOOD_COURT_ITEMS.filter((i) => i.shopId === shop.id).length;
              const theme = OUTLET_THEMES[shop.id] || {
                bg: '#1B5E4A',
                gradient: 'linear-gradient(135deg, #1B5E4A 0%, #004534 100%)',
                textColor: '#FFFFFF',
                subtextColor: 'rgba(255, 255, 255, 0.9)',
                badgeBg: 'rgba(0, 0, 0, 0.25)',
                badgeText: '#FFFFFF',
                circleBg: 'rgba(255, 255, 255, 0.22)',
              };

              return (
                <button
                  key={shop.id}
                  type="button"
                  onClick={() => handleSelectShop(shop.id)}
                  style={{
                    backgroundColor: theme.bg,
                    backgroundImage: theme.gradient,
                    color: theme.textColor,
                  }}
                  className="relative overflow-hidden rounded-[26px] p-4 text-left transition-all duration-200 active:scale-95 shadow-md flex flex-col justify-between min-h-[185px] cursor-pointer group"
                >
                  {/* Category Pill Tag */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      style={{
                        backgroundColor: theme.badgeBg,
                        color: theme.badgeText,
                      }}
                      className="text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md px-2.5 py-0.5 rounded-full"
                    >
                      {shop.categoryTag || 'Food Street'}
                    </span>
                    <span
                      style={{ color: theme.textColor }}
                      className="text-xs font-bold opacity-80 group-hover:translate-x-1 transition-transform"
                    >
                      →
                    </span>
                  </div>

                  {/* Centered Artwork Illustration */}
                  <div className="flex items-center justify-center my-2">
                    <div
                      style={{ backgroundColor: theme.circleBg }}
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner text-3xl"
                    >
                      {shop.icon}
                    </div>
                  </div>

                  {/* Bottom Store Title & Info - 100% High Contrast Visible */}
                  <div>
                    <h4
                      style={{ color: theme.textColor }}
                      className="font-black text-base sm:text-lg leading-tight tracking-tight drop-shadow-xs"
                    >
                      {shop.name}
                    </h4>
                    <p
                      style={{ color: theme.subtextColor }}
                      className="text-[11px] font-bold mt-1 line-clamp-1"
                    >
                      {shopItemCount} items • {shop.priceRange}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Search Results if user searched on the main screen */}
          {searchTerm && visibleItems.length > 0 && (
            <div className="mt-6 space-y-3 pt-3 border-t border-[#A9BFB5]/20">
              <h4 className="text-xs font-bold text-[#5F7A6E] uppercase tracking-wider">
                Matching Dishes ({visibleItems.length})
              </h4>
              <div className="flex flex-col gap-2.5">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#A9BFB5]/25 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.category === 'veg'
                              ? 'bg-emerald-600'
                              : item.category === 'egg'
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}
                        />
                        <span className="text-xs font-bold text-[#143026]">{item.name}</span>
                      </div>
                      <p className="text-[10px] text-[#5F7A6E] mt-0.5">
                        {item.shopName} • {item.calories} kcal • {item.protein}g protein
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#1B5E4A]">₹{item.price}</span>
                      <button
                        type="button"
                        onClick={() => handleLogFoodCourtItem(item)}
                        className="px-2.5 py-1 rounded-full bg-[#1B5E4A] hover:bg-[#004534] text-white text-[11px] font-bold shadow-xs active:scale-95 cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW B: STORE MENU VIEW (Appears after selecting Store)  */}
      {/* ======================================================== */}
      {selectedShop && activeTheme && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
          {/* Back Navigation Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackToShops}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#A9BFB5]/30 text-xs font-bold text-[#143026] hover:text-[#1B5E4A] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#1B5E4A]" />
              <span>Back to Outlets</span>
            </button>
            <span className="text-xs font-bold text-[#5F7A6E]">
              {visibleItems.length} menu items
            </span>
          </div>

          {/* Store Banner Card styled with Guaranteed Solid Theme */}
          <div
            style={{
              backgroundColor: activeTheme.bg,
              backgroundImage: activeTheme.gradient,
              color: activeTheme.textColor,
            }}
            className="p-5 rounded-[28px] shadow-lg relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span
                  style={{
                    backgroundColor: activeTheme.badgeBg,
                    color: activeTheme.badgeText,
                  }}
                  className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                >
                  {selectedShop.categoryTag || 'Food Street'}
                </span>
                <h3
                  style={{ color: activeTheme.textColor }}
                  className="text-2xl font-black tracking-tight mt-1.5 drop-shadow-xs"
                >
                  {selectedShop.name}
                </h3>
                <p
                  style={{ color: activeTheme.subtextColor }}
                  className="text-xs mt-0.5 font-medium max-w-[240px]"
                >
                  {selectedShop.tagline}
                </p>
              </div>
              <div
                style={{ backgroundColor: activeTheme.circleBg }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner shrink-0 ml-2"
              >
                {selectedShop.icon}
              </div>
            </div>

            {/* Quick subcategory pills in hero card */}
            {selectedShop.subcategories && selectedShop.subcategories.length > 0 && (
              <div className="mt-4 pt-3 border-t border-black/15 flex flex-wrap gap-1.5 relative z-10">
                {selectedShop.subcategories.map((subcat) => (
                  <button
                    key={subcat}
                    type="button"
                    onClick={() => setSelectedSubcategory(subcat)}
                    style={{
                      backgroundColor:
                        selectedSubcategory === subcat
                          ? '#FFFFFF'
                          : activeTheme.badgeBg,
                      color:
                        selectedSubcategory === subcat
                          ? '#141000'
                          : activeTheme.textColor,
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shadow-2xs"
                  >
                    {subcat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search bar inside store */}
          <div className="relative flex items-center w-full h-[46px] bg-white rounded-full shadow-xs px-4 border border-[#A9BFB5]/30">
            <Search className="w-4 h-4 text-[#1B5E4A] shrink-0 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search in ${selectedShop.name}...`}
              className="w-full bg-transparent text-xs text-[#143026] placeholder:text-[#5F7A6E] focus:outline-hidden"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-xs font-bold text-[#5F7A6E] hover:text-[#143026]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Subcategory Filter Tabs (Under header) */}
          {selectedShop.subcategories && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
              <button
                type="button"
                onClick={() => setSelectedSubcategory('All')}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  selectedSubcategory === 'All'
                    ? 'bg-[#1B5E4A] text-white shadow-sm'
                    : 'bg-white text-[#5F7A6E] hover:bg-[#D8E8DE]/40 border border-[#A9BFB5]/25'
                }`}
              >
                All Categories
              </button>
              {selectedShop.subcategories.map((subcat) => {
                const isActive = selectedSubcategory === subcat;
                return (
                  <button
                    key={subcat}
                    type="button"
                    onClick={() => setSelectedSubcategory(subcat)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isActive
                        ? 'bg-[#1B5E4A] text-white shadow-sm'
                        : 'bg-white text-[#5F7A6E] hover:bg-[#D8E8DE]/40 border border-[#A9BFB5]/25'
                    }`}
                  >
                    {subcat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Menu Items List matching screenshot layout */}
          <div className="flex flex-col gap-2.5">
            {visibleItems.map((item) => {
              const isVeg = item.category === 'veg';
              const isEgg = item.category === 'egg';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-[22px] p-4 shadow-xs border border-[#A9BFB5]/25 flex flex-col gap-2 hover:border-[#1B5E4A]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            isVeg ? 'bg-emerald-600' : isEgg ? 'bg-amber-600' : 'bg-rose-600'
                          }`}
                          title={isVeg ? 'Vegetarian' : isEgg ? 'Contains Egg' : 'Non-Vegetarian'}
                        />
                        <h4 className="text-sm font-extrabold text-[#143026] leading-tight">
                          {item.name}
                        </h4>
                        {item.isPopular && (
                          <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
                            Popular
                          </span>
                        )}
                      </div>

                      {item.portionDescription && (
                        <p className="text-[11px] text-[#5F7A6E] mt-1 line-clamp-1">
                          {item.portionDescription}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-[#1B5E4A]">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  {/* Nutrition details & Action row */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#F5F3EE] text-[#143026] text-[10px] font-bold">
                        {item.calories} kcal
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#F5F3EE] text-[#5F7A6E] text-[10px] font-bold">
                        {item.protein}g protein
                      </span>
                      {item.carbs > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-[#F5F3EE] text-[#5F7A6E] text-[10px] font-bold hidden sm:inline">
                          {item.carbs}g carbs
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLogFoodCourtItem(item)}
                      className="flex items-center gap-1 h-7 px-3 rounded-full bg-[#1B5E4A] hover:bg-[#004534] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {visibleItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#A9BFB5]/40 p-6">
                <Store className="w-8 h-8 text-[#5F7A6E] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#5F7A6E] font-medium">
                  No items found matching your current filter in {selectedShop.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
