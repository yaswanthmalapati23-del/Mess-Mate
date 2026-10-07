'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ChevronRight,
  Store,
  ChevronDown,
  Leaf,
  Dumbbell,
  CheckCircle2,
} from 'lucide-react';
import { DailyMenuDay, UserProfile } from '@/lib/types';
import { DISH_LOOKUP } from '@/lib/data/messDishes';

interface MonthlyPlanViewProps {
  monthlyMenu: DailyMenuDay[];
  profile: UserProfile;
  onSelectDay: (dayNumber: number) => void;
  selectedDayNumber: number;
  onOpenProfile?: () => void;
}

export const MonthlyPlanView: React.FC<MonthlyPlanViewProps> = ({
  monthlyMenu,
  profile,
  onSelectDay,
  selectedDayNumber,
  onOpenProfile,
}) => {
  const [filterChoice, setFilterChoice] = useState<'all' | 'veg' | 'protein'>('all');

  const currentMess = profile.messType || 'non-veg';
  const messDisplay =
    currentMess === 'special' ? 'Special Mess ⭐' : currentMess === 'veg' ? 'Veg Mess 🟢' : 'Non-Veg Mess 🍗';

  const todayDate = Math.min(30, Math.max(1, new Date().getDate()));
  const activeDay = monthlyMenu.find((d) => d.dayNumber === selectedDayNumber) || monthlyMenu[0];

  // Helper to format dishes for a slot
  const getSlotDetails = (slotIds: string[], fallback: string) => {
    if (!slotIds || slotIds.length === 0) return { title: fallback, list: fallback };
    const dishes = slotIds.map((id) => DISH_LOOKUP.get(id)).filter(Boolean);
    const title = dishes[0]?.name || fallback;
    const list = dishes.map((d) => d?.name).join(', ');
    return { title, list };
  };

  const breakfastData = getSlotDetails(activeDay?.slots?.breakfast || [], 'Mysore Masala Dosa & Sambar');
  const lunchData = getSlotDetails(activeDay?.slots?.lunch || [], 'Steamed Rice, Dal Tadka, Aloo Gobi & Curd');
  const snacksData = getSlotDetails(activeDay?.slots?.snacks || [], 'Veg Puff & Ginger Cutting Tea');
  const dinnerData = getSlotDetails(activeDay?.slots?.dinner || [], 'Phulka, Paneer Butter Masala / Chicken Gravy');

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* 1. HEADER TITLE & MESS SELECTOR */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-bold text-[#143026]">Weekly Mess Menu</h2>
          <span className="text-xs text-[#5F7A6E] font-medium">October 2024 • Cycle Roster</span>
        </div>

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D6E6DC] text-[#1B5E4A] text-xs font-bold shadow-xs hover:bg-[#D8E8DE] cursor-pointer"
        >
          <Store className="w-3.5 h-3.5" />
          <span className="truncate max-w-[110px]">{messDisplay}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. DAY SELECTOR CAROUSEL */}
      <div className="w-full overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        <div className="flex items-center gap-2 min-w-max">
          {monthlyMenu.slice(0, 14).map((d) => {
            const isSelected = d.dayNumber === selectedDayNumber;
            const isToday = d.dayNumber === todayDate;

            return (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => onSelectDay(d.dayNumber)}
                className={`flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'w-[58px] h-[70px] bg-[#1B5E4A] text-white shadow-md'
                    : 'w-[54px] h-[66px] bg-white text-[#5F7A6E] border border-[#A9BFB5]/25 hover:border-[#1B5E4A]/40'
                }`}
              >
                {isToday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mb-0.5 ${
                      isSelected ? 'bg-[#AEF0D6]' : 'bg-[#1B5E4A]'
                    }`}
                  />
                )}
                <span
                  className={`text-[11px] font-bold uppercase ${
                    isSelected ? 'text-[#AEF0D6]' : 'text-[#5F7A6E]'
                  }`}
                >
                  {d.dayOfWeek.slice(0, 3)}
                </span>
                <span className="text-sm font-extrabold mt-0.5">{d.dayNumber}</span>
                {isToday && (
                  <span className="text-[9px] uppercase tracking-tighter opacity-90 font-bold">
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SPECIAL MEAL HIGHLIGHT ALERT (ARCH TOP SILHOUETTE) */}
      <div className="relative overflow-hidden rounded-t-[32px] rounded-b-[20px] bg-[#D6E6DC] p-4 text-[#143026] shadow-xs border border-[#A9BFB5]/30">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1B5E4A] flex items-center justify-center shrink-0 mt-0.5 text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-[#AEF0D6]" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#1B5E4A]">Special Feast Roster</span>
              <span className="text-[10px] bg-white text-[#1B5E4A] px-2 py-0.5 rounded-full font-bold shadow-xs">
                Featured
              </span>
            </div>
            <p className="text-xs text-[#404944] mt-1 leading-snug">
              Wednesday &amp; Sunday dinner features slow-cooked aromatic biryani and high-protein
              gravies for {currentMess} subscribers.
            </p>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE DIETARY PREFERENCE CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setFilterChoice('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
            filterChoice === 'all'
              ? 'bg-[#1B5E4A] text-white'
              : 'bg-white text-[#5F7A6E] border border-[#A9BFB5]/25'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setFilterChoice('veg')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
            filterChoice === 'veg'
              ? 'bg-[#1B5E4A] text-white'
              : 'bg-white text-[#5F7A6E] border border-[#A9BFB5]/25'
          }`}
        >
          Pure Veg
        </button>
        <button
          onClick={() => setFilterChoice('protein')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
            filterChoice === 'protein'
              ? 'bg-[#1B5E4A] text-white'
              : 'bg-white text-[#5F7A6E] border border-[#A9BFB5]/25'
          }`}
        >
          High Protein
        </button>
      </div>

      {/* 5. MEAL SCHEDULE CARDS (1, 2, 3, 4) */}
      <div className="flex flex-col gap-3">
        {/* Card 1: Breakfast */}
        <div className="rounded-[24px] bg-white p-4 shadow-xs border border-[#A9BFB5]/20 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D6E6DC] flex items-center justify-center text-[#1B5E4A] font-extrabold text-sm">
                1
              </div>
              <div>
                <span className="text-sm font-bold text-[#143026]">Breakfast</span>
                <span className="text-[11px] text-[#5F7A6E] block">07:30 AM – 09:30 AM</span>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-[#F5F3EE] px-2.5 py-1 rounded-full text-[#5F7A6E]">
              420-550 kcal
            </span>
          </div>
          <div className="pl-10.5">
            <span className="text-xs font-bold text-[#143026]">{breakfastData.title}</span>
            <p className="text-[11px] text-[#5F7A6E] mt-0.5 leading-snug">{breakfastData.list}</p>
          </div>
        </div>

        {/* Card 2: Lunch (Arch Canopy Highlight) */}
        <div className="rounded-t-[36px] rounded-b-[20px] bg-white p-4 shadow-sm border border-[#A9BFB5]/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1B5E4A] flex items-center justify-center text-white font-extrabold text-sm">
                2
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#143026]">Lunch</span>
                  <span className="w-2 h-2 rounded-full bg-[#1B5E4A]"></span>
                </div>
                <span className="text-[11px] text-[#5F7A6E]">12:30 PM – 02:30 PM</span>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-[#D6E6DC] text-[#1B5E4A] px-2.5 py-1 rounded-full">
              580-720 kcal
            </span>
          </div>
          <div className="pl-10.5">
            <span className="text-xs font-bold text-[#143026]">{lunchData.title}</span>
            <p className="text-[11px] text-[#5F7A6E] mt-0.5 leading-snug">{lunchData.list}</p>
          </div>
        </div>

        {/* Card 3: Snacks */}
        <div className="rounded-[24px] bg-white p-4 shadow-xs border border-[#A9BFB5]/20 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D6E6DC] flex items-center justify-center text-[#1B5E4A] font-extrabold text-sm">
                3
              </div>
              <div>
                <span className="text-sm font-bold text-[#143026]">Evening Snacks</span>
                <span className="text-[11px] text-[#5F7A6E] block">05:00 PM – 06:30 PM</span>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-[#F5F3EE] px-2.5 py-1 rounded-full text-[#5F7A6E]">
              ~220 kcal
            </span>
          </div>
          <div className="pl-10.5">
            <span className="text-xs font-bold text-[#143026]">{snacksData.title}</span>
            <p className="text-[11px] text-[#5F7A6E] mt-0.5 leading-snug">{snacksData.list}</p>
          </div>
        </div>

        {/* Card 4: Dinner */}
        <div className="rounded-[24px] bg-white p-4 shadow-xs border border-[#A9BFB5]/20 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D6E6DC] flex items-center justify-center text-[#1B5E4A] font-extrabold text-sm">
                4
              </div>
              <div>
                <span className="text-sm font-bold text-[#143026]">Dinner</span>
                <span className="text-[11px] text-[#5F7A6E] block">07:30 PM – 09:30 PM</span>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-[#F5F3EE] px-2.5 py-1 rounded-full text-[#5F7A6E]">
              ~550 kcal
            </span>
          </div>
          <div className="pl-10.5">
            <span className="text-xs font-bold text-[#143026]">{dinnerData.title}</span>
            <p className="text-[11px] text-[#5F7A6E] mt-0.5 leading-snug">{dinnerData.list}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
