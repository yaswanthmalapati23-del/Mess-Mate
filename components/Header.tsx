'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, X, Trash2, ArrowRight, Utensils, RotateCcw } from 'lucide-react';
import { UserProfile, MealLogItem } from '@/lib/types';
import { getStoredLogs, deleteStoredLog, clearTodayLogs, getTodayDateStr } from '@/lib/storage';

interface HeaderProps {
  profile: UserProfile;
  currentStreak: number;
  isDark?: boolean;
  studentEmail?: string;
  todayCalories?: number;
  targetCalories?: number;
  onToggleTheme?: () => void;
  onOpenProfile: () => void;
  onOpenPlan?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  todayCalories = 0,
  targetCalories = 2100,
  onOpenProfile,
  onOpenPlan,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayLogs, setTodayLogs] = useState<MealLogItem[]>([]);

  const todayStr = getTodayDateStr();

  // Load today's logs for the breakdown modal
  const refreshLogs = () => {
    const logs = getStoredLogs().filter((l) => l.dateStr === todayStr);
    setTodayLogs(logs);
  };

  useEffect(() => {
    refreshLogs();
    const handleUpdate = () => refreshLogs();
    window.addEventListener('mess_mate_logs_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('mess_mate_logs_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [todayStr]);

  const caloriePercent = Math.min(100, Math.round((todayCalories / targetCalories) * 100));
  const remainingCalories = Math.max(0, targetCalories - todayCalories);

  // Compute macro sums for today
  const proteinSum = Math.round(todayLogs.reduce((sum, l) => sum + l.protein, 0) * 10) / 10;
  const carbsSum = Math.round(todayLogs.reduce((sum, l) => sum + l.carbs, 0) * 10) / 10;
  const fatSum = Math.round(todayLogs.reduce((sum, l) => sum + l.fat, 0) * 10) / 10;

  const handleDeleteItem = (logId: string) => {
    deleteStoredLog(logId);
    refreshLogs();
  };

  const handleClearAll = () => {
    clearTodayLogs(todayStr);
    refreshLogs();
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-xl border-b border-[#A9BFB5]/20 px-4 py-2.5 transition-colors shadow-[0_1px_8px_rgba(20,48,38,0.04)] font-sans">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Left: Brand & University Subtitle */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1B5E4A] shadow-xs flex items-center justify-center text-white text-sm font-bold select-none">
              🌿
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#5F7A6E] uppercase tracking-wider">
                VIT-AP University
              </span>
              <h1 className="font-sans font-extrabold text-base tracking-tight text-[#143026] leading-none">
                Mess Mate
              </h1>
            </div>
          </div>

          {/* Right: Interactive Calorie Counter Pill & Profile Avatar */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                refreshLogs();
                setIsModalOpen(true);
              }}
              title="View daily calorie breakdown and logged items"
              className="flex items-center space-x-1.5 bg-white border border-[#A9BFB5]/30 px-3 py-1.5 rounded-full shadow-xs hover:border-[#1B5E4A]/50 hover:bg-[#F5F3EE] transition-all text-xs active:scale-95 cursor-pointer"
            >
              <span className="text-orange-500 text-xs font-bold leading-none select-none">🔥</span>
              <span className="font-extrabold text-[#143026]">
                {todayCalories.toLocaleString()}
              </span>
              <span className="text-[#5F7A6E] font-medium text-[11px]">
                /{targetCalories.toLocaleString()}
              </span>
            </button>

            <button
              onClick={onOpenProfile}
              aria-label="Profile"
              className="w-8 h-8 rounded-full bg-[#1B5E4A] hover:bg-[#004534] flex items-center justify-center text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Liability Guardrail notification if active */}
        {profile.isLiabilityGuardrailActive && (
          <div className="max-w-md mx-auto mt-2 bg-[#D8E8DE]/60 border border-[#1B5E4A]/20 text-[#143026] px-3 py-1.5 rounded-xl text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1B5E4A] shrink-0" />
              <span className="font-semibold text-[11px] text-[#1B5E4A]">Campus Wellness Guardrail Active</span>
            </div>
            <button
              onClick={onOpenProfile}
              className="text-[11px] font-bold text-[#1B5E4A] underline shrink-0 cursor-pointer"
            >
              Details
            </button>
          </div>
        )}
      </header>

      {/* Interactive Calorie Breakdown Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#A9BFB5]/30 space-y-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#A9BFB5]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <h3 className="text-base font-extrabold text-[#143026] leading-tight">
                    Daily Calorie Tracker
                  </h3>
                  <span className="text-[11px] text-[#5F7A6E]">Today&apos;s nutrition progress</span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F3EE] hover:bg-[#EAE8E3] flex items-center justify-center text-[#5F7A6E] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Calorie Progress Meter */}
            <div className="bg-[#F5F3EE] rounded-2xl p-4 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-[#1B5E4A] tracking-tight">
                    {todayCalories.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#5F7A6E] ml-1">
                    / {targetCalories.toLocaleString()} kcal
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#D6E6DC] text-[#1B5E4A]">
                  {caloriePercent}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#D8E8DE] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#1B5E4A] h-full rounded-full transition-all duration-500"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#5F7A6E] pt-0.5">
                <span>{remainingCalories.toLocaleString()} kcal remaining</span>
                <span>Goal: {profile.goal || 'Fitness'}</span>
              </div>
            </div>

            {/* 3 Macro Badges */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#F5F3EE] rounded-xl p-2.5 border border-[#A9BFB5]/20">
                <span className="text-[10px] font-bold text-[#5F7A6E] uppercase">Protein</span>
                <p className="text-sm font-extrabold text-[#1B5E4A] mt-0.5">{proteinSum}g</p>
                <span className="text-[9px] text-[#5F7A6E]">/{profile.targetProteinG || 110}g</span>
              </div>

              <div className="bg-[#F5F3EE] rounded-xl p-2.5 border border-[#A9BFB5]/20">
                <span className="text-[10px] font-bold text-[#5F7A6E] uppercase">Carbs</span>
                <p className="text-sm font-extrabold text-[#143026] mt-0.5">{carbsSum}g</p>
                <span className="text-[9px] text-[#5F7A6E]">/240g</span>
              </div>

              <div className="bg-[#F5F3EE] rounded-xl p-2.5 border border-[#A9BFB5]/20">
                <span className="text-[10px] font-bold text-[#5F7A6E] uppercase">Fats</span>
                <p className="text-sm font-extrabold text-[#143026] mt-0.5">{fatSum}g</p>
                <span className="text-[9px] text-[#5F7A6E]">/65g</span>
              </div>
            </div>

            {/* Logged Dishes List */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-[120px] max-h-[220px] pr-1">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-xs font-bold text-[#143026]">
                  Logged Items ({todayLogs.length})
                </span>
                {todayLogs.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-[10px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>

              {todayLogs.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#5F7A6E] bg-[#F5F3EE]/60 rounded-xl border border-dashed border-[#A9BFB5]/30">
                  <p>No meals logged yet today.</p>
                  <p className="text-[11px] text-[#5F7A6E]/80 mt-0.5">
                    Tap dishes on Today&apos;s Plan to start tracking.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {todayLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#F5F3EE] border border-[#A9BFB5]/20 text-xs"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-bold text-[#143026] truncate">{log.dishName}</span>
                        <span className="text-[10px] text-[#5F7A6E] capitalize">
                          {log.mealSlot} • {log.protein}g protein
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-[#1B5E4A]">{log.calories} kcal</span>
                        <button
                          onClick={() => handleDeleteItem(log.id)}
                          title="Remove item"
                          className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-[#A9BFB5]/20 flex items-center gap-2">
              {onOpenPlan && (
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    onOpenPlan();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-full bg-[#1B5E4A] hover:bg-[#004534] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>View Today&apos;s Plan</span>
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2.5 px-4 rounded-full bg-[#F5F3EE] hover:bg-[#EAE8E3] text-[#143026] text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
