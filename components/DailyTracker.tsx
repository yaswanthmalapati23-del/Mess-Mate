'use client';

import React, { useState } from 'react';
import {
  Flame,
  Award,
  Users,
  Bell,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { getDaySummary, calculateStreak, getStoredLogs, getTodayDateStr } from '@/lib/storage';

interface DailyTrackerProps {
  profile: UserProfile;
}

const HOSTEL_LEADERBOARD = [
  { rank: 1, name: 'Hostel 4 (Aravali)', avgProteinStreak: '6.8 days', score: '94% Consistency', isUserHostel: true },
  { rank: 2, name: 'Hostel 7 (Karakoram)', avgProteinStreak: '6.2 days', score: '91% Consistency', isUserHostel: false },
  { rank: 3, name: 'Hostel 1 (Nilgiri)', avgProteinStreak: '5.9 days', score: '88% Consistency', isUserHostel: false },
  { rank: 4, name: 'Hostel 2 (Vindhyachal)', avgProteinStreak: '5.4 days', score: '82% Consistency', isUserHostel: false },
  { rank: 5, name: 'Hostel 6 (Shivalik)', avgProteinStreak: '4.8 days', score: '78% Consistency', isUserHostel: false },
];

export const DailyTracker: React.FC<DailyTrackerProps> = ({ profile }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { currentStreak, bestStreak } = calculateStreak();

  const todayStr = getTodayDateStr();
  const todaySummary = getDaySummary(todayStr, profile);

  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const summary = getDaySummary(dateStr, profile);
    return {
      dateStr,
      dayName,
      calories: summary.caloriesConsumed,
      protein: summary.proteinConsumed,
      met: summary.isProteinGoalMet,
    };
  });

  const maxCaloriesInWeek = Math.max(
    profile.targetCalories * 1.2,
    ...past7Days.map((d) => d.calories),
    1000
  );

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* 1. STREAK HERO CARD */}
      <div className="bg-gradient-to-br from-[#E04F16] via-[#EA580C] to-[#F59E0B] text-white rounded-3xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-orange-100 text-[10px] font-bold uppercase tracking-widest block">
              Active Habit Streak
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <Flame className="w-8 h-8 text-white fill-white" />
              <span className="text-3xl font-extrabold">{currentStreak} Days</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-2xl text-right border border-white/20">
            <span className="text-[10px] text-orange-100 block">Personal Record</span>
            <span className="text-sm font-extrabold text-white">{bestStreak} Days</span>
          </div>
        </div>
        <p className="text-xs text-orange-100 mt-2.5 font-medium">
          {currentStreak > 0
            ? '🔥 You are building real mess meal consistency!'
            : 'Check in with today’s mess pick to ignite your streak!'}
        </p>
      </div>

      {/* 2. TODAY'S MACRO FUEL SUMMARY */}
      <div className="bg-white rounded-3xl p-5 border border-gray-150/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
            <Target className="w-4 h-4 text-[#E04F16]" />
            <span>Today&apos;s Nutrition Tracker</span>
          </h3>
          <span className="text-xs text-gray-500 font-medium">{todayStr}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-150">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Calories</div>
            <div className="text-lg font-extrabold text-gray-900 mt-0.5">
              {todaySummary.caloriesConsumed}{' '}
              <span className="text-xs font-normal text-gray-500 font-sans">/ {profile.targetCalories}</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#E04F16] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (todaySummary.caloriesConsumed / profile.targetCalories) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200/70">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Protein Goal</div>
            <div className="text-lg font-extrabold text-blue-700 mt-0.5">
              {todaySummary.proteinConsumed}g{' '}
              <span className="text-xs font-normal text-blue-500 font-sans">/ {profile.targetProteinG}g</span>
            </div>
            <div className="w-full bg-blue-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (todaySummary.proteinConsumed / profile.targetProteinG) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. 7-DAY CONSISTENCY GRAPH */}
      <div className="bg-white rounded-3xl p-5 border border-gray-150/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#2563EB]" />
            <h4 className="font-bold text-sm text-gray-900">7-Day Consistency Trend</h4>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">Target: {profile.targetCalories} kcal</span>
        </div>

        <div className="pt-4 pb-2 flex items-end justify-between h-36 gap-2">
          {past7Days.map((d) => {
            const heightPercent = Math.max(8, Math.min(100, (d.calories / maxCaloriesInWeek) * 100));
            const isToday = d.dateStr === todayStr;

            return (
              <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="text-[9px] font-bold text-blue-600">
                  {d.protein > 0 ? `${Math.round(d.protein)}g` : ''}
                </div>
                <div className="w-full bg-gray-100 rounded-xl flex flex-col justify-end h-24 p-0.5">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-[#E04F16] shadow-xs'
                        : d.calories > 0
                        ? 'bg-[#2563EB]'
                        : 'bg-gray-200'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    isToday ? 'text-[#E04F16]' : 'text-gray-400'
                  }`}
                >
                  {d.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CAMPUS HOSTEL LEADERBOARD */}
      <div className="bg-white rounded-3xl p-5 border border-gray-150/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#E04F16]" />
            <h4 className="font-bold text-sm text-gray-900">Hostel Block Challenge</h4>
          </div>
          <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            Campus Rank
          </span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Which campus hostel mess hits their protein targets most consistently?
        </p>

        <div className="space-y-2 pt-1">
          {HOSTEL_LEADERBOARD.map((item) => (
            <div
              key={item.name}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                item.isUserHostel
                  ? 'bg-orange-50/70 border-orange-200/80 shadow-xs'
                  : 'bg-gray-50/70 border-gray-150'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    item.rank === 1
                      ? 'bg-amber-400 text-amber-950'
                      : item.rank === 2
                      ? 'bg-gray-300 text-gray-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {item.rank}
                </span>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-gray-900">{item.name}</span>
                    {item.isUserHostel && (
                      <span className="text-[9px] bg-orange-100 text-[#E04F16] font-bold px-1.5 py-0.2 rounded-full border border-orange-200">
                        Your Block
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">{item.avgProteinStreak}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-gray-900 block">{item.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
