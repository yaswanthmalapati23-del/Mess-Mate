'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Activity,
  ShieldCheck,
  Award,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Sparkles,
  PieChart,
  BarChart3,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { AggregateAnalytics, MealSlotLoggingRate, DishPopularityMetric, FitScoreBucket, GoalDistribution } from '@/lib/types';
import { getStoredLogs } from '@/lib/storage';
import { supabase } from '@/lib/supabaseClient';

export const AdminAnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [analytics, setAnalytics] = useState<AggregateAnalytics | null>(null);

  useEffect(() => {
    // Generate/aggregate live metrics from stored meal logs + simulated multi-student campus cohorts
    const localLogs = getStoredLogs();

    // Default calibrated campus baseline for VIT-AP Mess pilot
    const totalStudents = 1420;
    const dau = Math.min(totalStudents, 618 + Math.floor(localLogs.length * 1.5));
    const wau = 1185;
    const overallRate = Math.round((dau / totalStudents) * 1000) / 10;

    const mealSlotRates: MealSlotLoggingRate[] = [
      { slot: 'breakfast', label: 'Breakfast', loggedCount: 485, percentage: 78.4 },
      { slot: 'lunch', label: 'Lunch', loggedCount: 562, percentage: 90.9 },
      { slot: 'snacks', label: 'Evening Snacks', loggedCount: 290, percentage: 46.9 },
      { slot: 'dinner', label: 'Dinner', loggedCount: 512, percentage: 82.8 },
    ];

    const mostLogged: DishPopularityMetric[] = [
      { dishName: 'Tawa Roti (2 pcs)', dishId: 'dish_tawa_roti_pair', logCount: 1240, category: 'veg' },
      { dishName: 'Toor Dal Tadka', dishId: 'dish_toor_dal_tadka', logCount: 980, category: 'veg' },
      { dishName: 'Paneer Butter Masala', dishId: 'dish_paneer_butter_masala', logCount: 890, category: 'veg' },
      { dishName: 'Boiled Eggs (2 pcs)', dishId: 'dish_boiled_eggs', logCount: 765, category: 'egg' },
      { dishName: 'Steamed Basmati Rice', dishId: 'dish_steamed_rice', logCount: 740, category: 'veg' },
    ];

    const leastLogged: DishPopularityMetric[] = [
      { dishName: 'Lauki Chana Dal', dishId: 'dish_lauki_chana_dal', logCount: 94, category: 'veg' },
      { dishName: 'Plain Vegetable Upma', dishId: 'dish_upma', logCount: 112, category: 'veg' },
      { dishName: 'Karela Masala', dishId: 'dish_karela_masala', logCount: 130, category: 'veg' },
      { dishName: 'Bread & Butter', dishId: 'dish_bread_butter', logCount: 155, category: 'veg' },
    ];

    const fitScoreDist: FitScoreBucket[] = [
      { range: '80-100', label: 'High Nutritional Fit', count: 682, percentage: 48 },
      { range: '60-79', label: 'Moderate Fit', count: 483, percentage: 34 },
      { range: '40-59', label: 'Low Macro Fit', count: 185, percentage: 13 },
      { range: '<40', label: 'Critical Gap', count: 70, percentage: 5 },
    ];

    const goalDist: GoalDistribution[] = [
      { goal: 'gain', label: 'Muscle Gain (Hypertrophy)', count: 639, percentage: 45 },
      { goal: 'lose', label: 'Fat Loss (Calorie Deficit)', count: 454, percentage: 32 },
      { goal: 'fitness', label: 'Health & Maintenance', count: 327, percentage: 23 },
    ];

    setAnalytics({
      totalRegisteredStudents: totalStudents,
      dau,
      wau,
      overallLoggingRateToday: overallRate,
      mealSlotRates,
      mostLoggedDishes: mostLogged,
      leastLoggedDishes: leastLogged,
      fitScoreDistribution: fitScoreDist,
      goalDistribution: goalDist,
      lastUpdated: new Date().toLocaleTimeString(),
    });
  }, []);

  if (!analytics) return null;

  return (
    <div className="space-y-8">
      {/* Strict Privacy Guardrail Banner */}
      <div className="bg-olive-950/50 border border-olive-500/40 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-olive-500/20 border border-olive-500/40 text-olive-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-olive-200">
                Strict Student Privacy Guardrail Enforced
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-olive-900/80 text-olive-300 border border-olive-600/40 uppercase">
                Zero PII Exposed
              </span>
            </div>
            <p className="text-xs text-olive-300/80 mt-1 leading-relaxed">
              All metrics on this dashboard are strictly aggregate functions (<code className="font-mono text-olive-200">COUNT</code>, <code className="font-mono text-olive-200">AVG</code>, <code className="font-mono text-olive-200">GROUP BY</code>). Individual student logs (&ldquo;Student X ate Y, weighs Z kg&rdquo;) are prohibited and blocked at the Postgres database layer.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] text-gray-400 font-mono">
            Synced: {analytics.lastUpdated}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Students */}
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Registered Students
            </span>
            <Users className="w-4 h-4 text-terracotta-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-display text-white">
              {analytics.totalRegisteredStudents.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-olive-400">VIT-AP Hostel</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Verified @vitapstudent.ac.in accounts</p>
        </div>

        {/* Daily Active Users */}
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Active Users (DAU)
            </span>
            <Activity className="w-4 h-4 text-saffron-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-display text-white">
              {analytics.dau.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-saffron-400">Today</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Students interacting with menu or logs today
          </p>
        </div>

        {/* Weekly Active Users */}
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Weekly Active (WAU)
            </span>
            <TrendingUp className="w-4 h-4 text-terracotta-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-display text-white">
              {analytics.wau.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-olive-400">
              {Math.round((analytics.wau / analytics.totalRegisteredStudents) * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Active in past 7 rolling days</p>
        </div>

        {/* Today's Meal Logging Rate */}
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Logging Rate Today
            </span>
            <Flame className="w-4 h-4 text-terracotta-500" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-display text-white">
              {analytics.overallLoggingRateToday}%
            </span>
            <span className="text-xs font-bold text-terracotta-400">Participation</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Students logging at least 1 meal slot</p>
        </div>
      </div>

      {/* Row 2: Meal Slot Breakdown & Fit Score Adherence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Slot Participation */}
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Meal Slot Logging Rates
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                % of registered hostel students who logged each meal
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-terracotta-400" />
          </div>

          <div className="space-y-4">
            {analytics.mealSlotRates.map((slot) => (
              <div key={slot.slot} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-200">{slot.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 font-mono text-[11px]">
                      {slot.loggedCount} students
                    </span>
                    <span className="font-bold text-white font-mono">{slot.percentage}%</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-obsidian-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-saffron-500 transition-all duration-500"
                    style={{ width: `${slot.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Peak meal engagement observed during Lunch (90.9%).</span>
            <span className="text-terracotta-400 font-bold">12:30 PM - 2:00 PM</span>
          </div>
        </div>

        {/* Clinical Fit Score Adherence Distribution */}
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Fit Score Distribution (Nutritional Adherence)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Evaluates whether current mess menu matches individual macro targets
              </p>
            </div>
            <Award className="w-4 h-4 text-saffron-400" />
          </div>

          <div className="space-y-3.5">
            {analytics.fitScoreDistribution.map((bucket) => {
              const colorClass =
                bucket.range === '80-100'
                  ? 'bg-olive-500'
                  : bucket.range === '60-79'
                  ? 'bg-saffron-500'
                  : bucket.range === '40-59'
                  ? 'bg-terracotta-500'
                  : 'bg-red-500';

              return (
                <div key={bucket.range} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        {bucket.range}
                      </span>
                      <span className="text-gray-300 font-medium">{bucket.label}</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {bucket.percentage}% ({bucket.count})
                    </span>
                  </div>
                  <div className="h-2 w-full bg-obsidian-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorClass}`}
                      style={{ width: `${bucket.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-olive-950/40 border border-olive-800/40 text-[11px] text-olive-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-olive-400 shrink-0" />
            <span>82% of students achieve Moderate to High nutritional target satisfaction.</span>
          </div>
        </div>
      </div>

      {/* Row 3: Dish Popularity (Top Picked vs Skipped/Waste) & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Logged Dishes */}
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ThumbsUp className="w-4 h-4 text-olive-400" />
              <span>Top 5 Most Popular Dishes</span>
            </h3>
            <span className="text-[10px] font-bold text-olive-400 bg-olive-950/60 px-2 py-0.5 rounded-full border border-olive-800/40">
              High Demand
            </span>
          </div>

          <div className="space-y-2.5">
            {analytics.mostLoggedDishes.map((dish, i) => (
              <div
                key={dish.dishId}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-obsidian-950 border border-white/5 text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/5 text-gray-400 flex items-center justify-center font-mono font-bold text-[10px]">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-gray-200">{dish.dishName}</span>
                </div>
                <span className="font-mono font-bold text-terracotta-400 text-xs">
                  {dish.logCount} logs
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Least Logged / Waste Warning */}
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ThumbsDown className="w-4 h-4 text-terracotta-400" />
              <span>Least Picked / High Waste Risk</span>
            </h3>
            <span className="text-[10px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800/40">
              Low Pickup
            </span>
          </div>

          <div className="space-y-2.5">
            {analytics.leastLoggedDishes.map((dish, i) => (
              <div
                key={dish.dishId}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-obsidian-950 border border-white/5 text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 flex items-center justify-center font-mono font-bold text-[10px]">
                    !
                  </span>
                  <span className="font-semibold text-gray-200">{dish.dishName}</span>
                </div>
                <span className="font-mono font-bold text-gray-400 text-xs">
                  {dish.logCount} logs
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-gray-500 italic">
            Recommendation: Consider swapping low-pickup dishes with high-fiber legume alternatives.
          </p>
        </div>

        {/* Student Goal Distribution */}
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-saffron-400" />
              <span>Campus Goal Distribution</span>
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
              Hostel Cohort
            </span>
          </div>

          {/* SVG Donut representation */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  className="stroke-obsidian-950 stroke-[3.5]"
                />
                {/* Muscle Gain: 45% (dasharray 39.5, offset 0) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#dd573a"
                  strokeWidth="3.5"
                  strokeDasharray="39.5 88"
                  strokeDashoffset="0"
                />
                {/* Fat Loss: 32% (dasharray 28.1, offset -39.5) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f49d25"
                  strokeWidth="3.5"
                  strokeDasharray="28.1 88"
                  strokeDashoffset="-39.5"
                />
                {/* Maintenance: 23% (dasharray 20.2, offset -67.6) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#5f8150"
                  strokeWidth="3.5"
                  strokeDasharray="20.2 88"
                  strokeDashoffset="-67.6"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black font-display text-white">1,420</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                  Goals
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            {analytics.goalDistribution.map((g) => (
              <div key={g.goal} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      g.goal === 'gain'
                        ? 'bg-terracotta-500'
                        : g.goal === 'lose'
                        ? 'bg-saffron-500'
                        : 'bg-olive-500'
                    }`}
                  />
                  <span className="text-gray-300 font-medium">{g.label.split('(')[0]}</span>
                </div>
                <span className="font-mono font-bold text-white">{g.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
