'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { UserProfile, DailyMenuDay, DailyTrackingSummary } from '@/lib/types';
import { DISH_LOOKUP } from '@/lib/data/messDishes';

interface StitchDashboardProps {
  profile: UserProfile;
  studentEmail?: string;
  currentDayMenu: DailyMenuDay;
  todaySummary?: DailyTrackingSummary;
  streakCount: number;
  onOpenViewPlan: () => void;
  onNavigateTab: (tab: 'home' | 'dining' | 'log' | 'monthly' | 'tracker' | 'profile') => void;
  onOpenLogMeal: () => void;
  onOpenProfile: () => void;
}

interface DishItem {
  name: string;
  isNonVeg: boolean;
}

// Official VIT-AP Mess Reference Menu for Monday / Day 5
const MONDAY_REFERENCE_MENU: Record<'breakfast' | 'lunch' | 'snacks' | 'dinner', DishItem[]> = {
  breakfast: [
    { name: 'Ghee', isNonVeg: false },
    { name: 'Veg Pongal', isNonVeg: false },
    { name: 'Bhature', isNonVeg: false },
    { name: 'Groundnut Chutney', isNonVeg: false },
    { name: 'Sambar', isNonVeg: false },
    { name: 'Chole Curry', isNonVeg: false },
    { name: 'White Bread', isNonVeg: false },
    { name: 'Butter', isNonVeg: false },
    { name: 'Jam', isNonVeg: false },
    { name: 'Tea', isNonVeg: false },
    { name: 'Coffee', isNonVeg: false },
    { name: 'Milk', isNonVeg: false },
    { name: 'Banana Milk Shake with Light Sugar', isNonVeg: false },
    { name: 'Boiled Mixed Beans Salad', isNonVeg: false },
    { name: 'Boiled Egg', isNonVeg: true },
  ],
  lunch: [
    { name: 'Boiled Chana Salad with Onion & Tomato', isNonVeg: false },
    { name: 'Chapathi', isNonVeg: false },
    { name: 'White Rice', isNonVeg: false },
    { name: 'Palak Dal', isNonVeg: false },
    { name: 'Sambar', isNonVeg: false },
    { name: 'Tomato Rice', isNonVeg: false },
    { name: 'Pesara Punugulu Curry', isNonVeg: false },
    { name: 'Capsicum Tomato Masala', isNonVeg: false },
    { name: 'Curd', isNonVeg: false },
    { name: 'Fryums & Papad', isNonVeg: false },
    { name: 'Mixed Pickle', isNonVeg: false },
    { name: 'Chicken Curry', isNonVeg: true },
  ],
  snacks: [
    { name: 'Crispy Samosa', isNonVeg: false },
    { name: 'Mint Chutney', isNonVeg: false },
    { name: 'Tomato Sauce', isNonVeg: false },
    { name: 'Cutting Ginger Tea', isNonVeg: false },
    { name: 'Hot Filter Coffee', isNonVeg: false },
  ],
  dinner: [
    { name: 'Fresh Cucumber & Carrot Salad', isNonVeg: false },
    { name: 'Tawa Roti (2 pcs)', isNonVeg: false },
    { name: 'Steamed White Rice', isNonVeg: false },
    { name: 'Dal Makhani', isNonVeg: false },
    { name: 'Mess Sambar', isNonVeg: false },
    { name: 'Paneer Butter Masala', isNonVeg: false },
    { name: 'Egg Bhurji / Chicken Gravy', isNonVeg: true },
    { name: 'Fresh Curd', isNonVeg: false },
    { name: 'Seasonal Fruit', isNonVeg: false },
    { name: 'Hot Milk & Bournvita', isNonVeg: false },
  ],
};

function isNonVegDish(name: string, category?: string): boolean {
  if (category === 'non-veg' || category === 'egg') return true;
  const lower = name.toLowerCase();
  return (
    lower.includes('egg') ||
    lower.includes('chicken') ||
    lower.includes('fish') ||
    lower.includes('mutton') ||
    lower.includes('prawn') ||
    lower.includes('meat') ||
    lower.includes('omelet')
  );
}

function formatDishName(rawId: string): string {
  return rawId
    .replace(/^dish_/, '')
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export const StitchDashboard: React.FC<StitchDashboardProps> = ({
  profile,
  currentDayMenu,
  onNavigateTab,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Format date: e.g. "Monday, October 5, 2026"
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate dynamic meal countdown
  const getCountdown = () => {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    // Schedule:
    // Breakfast: 07:15 AM - 09:00 AM (435 - 540)
    // Lunch:     12:15 PM - 02:00 PM (735 - 840)
    // Snacks:    05:00 PM - 06:30 PM (1020 - 1110)
    // Dinner:    07:30 PM - 09:30 PM (1170 - 1290)
    if (currentMinutes < 435) {
      const diff = 435 - currentMinutes;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return { icon: '🌅', text: `Breakfast in ${h > 0 ? `${h}h ` : ''}${m}m` };
    } else if (currentMinutes <= 540) {
      return { icon: '🌅', text: 'Breakfast serving now' };
    } else if (currentMinutes < 735) {
      const diff = 735 - currentMinutes;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return { icon: '☀️', text: `Lunch in ${h > 0 ? `${h}h ` : ''}${m}m` };
    } else if (currentMinutes <= 840) {
      return { icon: '☀️', text: 'Lunch serving now' };
    } else if (currentMinutes < 1020) {
      const diff = 1020 - currentMinutes;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return { icon: '☕', text: `Snacks in ${h > 0 ? `${h}h ` : ''}${m}m` };
    } else if (currentMinutes <= 1110) {
      return { icon: '☕', text: 'Snacks serving now' };
    } else if (currentMinutes < 1170) {
      const diff = 1170 - currentMinutes;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return { icon: '🌙', text: `Dinner in ${h > 0 ? `${h}h ` : ''}${m}m` };
    } else if (currentMinutes <= 1290) {
      return { icon: '🌙', text: 'Dinner serving now' };
    } else {
      const diff = 1440 - currentMinutes + 435;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return { icon: '🌅', text: `Breakfast in ${h > 0 ? `${h}h ` : ''}${m}m` };
    }
  };

  const countdown = getCountdown();

  // Helper to extract dishes for a slot
  const getSlotDishes = (slotKey: 'breakfast' | 'lunch' | 'snacks' | 'dinner'): DishItem[] => {
    const isReferenceDay = currentDayMenu?.dayOfWeek === 'Monday' || currentDayMenu?.dayNumber === 5;
    if (isReferenceDay && MONDAY_REFERENCE_MENU[slotKey]?.length > 0) {
      const isVegOnly = profile.messType === 'veg' || profile.dietPreference === 'veg';
      if (isVegOnly) {
        return MONDAY_REFERENCE_MENU[slotKey].filter((d) => !d.isNonVeg);
      }
      return MONDAY_REFERENCE_MENU[slotKey];
    }

    const slotIds = currentDayMenu?.slots?.[slotKey] || [];
    if (slotIds.length === 0) {
      return MONDAY_REFERENCE_MENU[slotKey];
    }

    return slotIds.map((id) => {
      const dish = DISH_LOOKUP.get(id);
      const name = dish?.name || formatDishName(id);
      const nonVeg = isNonVegDish(name, dish?.category);
      return {
        name,
        isNonVeg: nonVeg,
      };
    });
  };

  const mealCards = [
    {
      key: 'breakfast' as const,
      title: 'Breakfast',
      timing: '07:15 AM - 09:00 AM',
      iconNode: (
        <div className="w-9 h-9 rounded-xl bg-[#D6E6DC] flex items-center justify-center text-lg shadow-2xs select-none">
          🌅
        </div>
      ),
      dishes: getSlotDishes('breakfast'),
    },
    {
      key: 'lunch' as const,
      title: 'Lunch',
      timing: '12:15 PM - 02:00 PM',
      iconNode: (
        <div className="w-9 h-9 rounded-xl bg-[#FFF3D6] flex items-center justify-center text-lg shadow-2xs select-none">
          ☀️
        </div>
      ),
      dishes: getSlotDishes('lunch'),
    },
    {
      key: 'snacks' as const,
      title: 'Snacks',
      timing: '05:00 PM - 06:30 PM',
      iconNode: (
        <div className="w-9 h-9 rounded-xl bg-[#EAE8E3] flex items-center justify-center text-lg shadow-2xs select-none">
          ☕
        </div>
      ),
      dishes: getSlotDishes('snacks'),
    },
    {
      key: 'dinner' as const,
      title: 'Dinner',
      timing: '07:30 PM - 09:30 PM',
      iconNode: (
        <div className="w-9 h-9 rounded-xl bg-[#D6E6DC] flex items-center justify-center text-lg shadow-2xs select-none">
          🌙
        </div>
      ),
      dishes: getSlotDishes('dinner'),
    },
  ];

  return (
    <div className="space-y-4 pb-6 font-sans select-none animate-fade-in">
      {/* 1. Header: Today's Menu + Date + Calendar Button */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <h1 className="text-2xl font-extrabold text-[#143026] tracking-tight leading-tight">
            Today&apos;s Menu
          </h1>
          <p className="text-xs font-semibold text-[#5F7A6E] mt-0.5">
            {formattedDate}
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('monthly')}
          className="w-10 h-10 rounded-2xl bg-[#D6E6DC] text-[#1B5E4A] hover:bg-[#c4ded0] active:scale-95 flex items-center justify-center transition-all shadow-xs cursor-pointer"
          title="Open Monthly Menu"
        >
          <Calendar className="w-4 h-4 text-[#1B5E4A]" />
        </button>
      </div>

      {/* 2. Next Meal Countdown Pill (Google Stitch Botanical Pill) */}
      <div className="w-full py-2.5 px-4 rounded-2xl bg-white border border-[#1B5E4A]/30 text-[#1B5E4A] flex items-center justify-center gap-2 font-bold text-xs shadow-xs">
        <span className="text-sm">{countdown.icon}</span>
        <span>{countdown.text}</span>
      </div>

      {/* 3. Food Wisdom / Quote Card (Botanical Arch/Accent Card) */}
      <div className="relative overflow-hidden rounded-2xl bg-white py-3 px-4 flex items-center gap-3 border border-[#A9BFB5]/30 shadow-xs">
        {/* Solid vertical botanical green accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1B5E4A] rounded-l-2xl" />
        <span className="text-lg shrink-0 select-none ml-1">☕</span>
        <p className="text-xs font-medium italic text-[#143026]">
          All you need is love and a good meal.
        </p>
      </div>

      {/* 4. Meal Cards (Breakfast, Lunch, Snacks, Dinner) */}
      <div className="space-y-3.5">
        {mealCards.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-3xl p-5 border border-[#A9BFB5]/30 shadow-[0_4px_20px_rgba(20,48,38,0.04)] space-y-3"
          >
            {/* Meal Header */}
            <div className="flex items-center gap-3">
              {card.iconNode}
              <div>
                <h2 className="text-base font-extrabold text-[#143026] tracking-tight leading-tight">
                  {card.title}
                </h2>
                <p className="text-[11px] font-semibold text-[#5F7A6E] mt-0.5">
                  {card.timing}
                </p>
              </div>
            </div>

            {/* Dish Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {card.dishes.map((dish, idx) => (
                <span
                  key={idx}
                  className={
                    dish.isNonVeg
                      ? 'px-3 py-1.5 rounded-full bg-[#FDF0EB] text-[#C2410C] border border-[#EA580C]/40 text-xs font-bold flex items-center gap-1.5 shadow-2xs'
                      : 'px-3 py-1.5 rounded-full bg-[#F5F3EE] text-[#143026] border border-[#A9BFB5]/40 text-xs font-medium hover:border-[#1B5E4A]/50 transition-colors'
                  }
                >
                  {dish.isNonVeg && <span>🍗</span>}
                  <span>{dish.name}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
