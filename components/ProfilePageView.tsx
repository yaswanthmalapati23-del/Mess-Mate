'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
  LogOut,
  User,
  Shield,
  Sparkles,
  Zap,
  Flame,
  Scale,
  Utensils,
  Award,
  Trophy,
  Target,
  Activity,
  Heart,
  ChevronRight,
  Edit3,
  Trash2,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  UserProfile,
  ActivityLevel,
  GoalType,
  DietPreference,
  MessType,
  StudentAccount,
} from '@/lib/types';
import { calculateNutritionProfile, CalculationInput } from '@/lib/nutrition/calculator';
import { calculateStreak, getStoredLogs, getDaySummary, getTodayDateStr } from '@/lib/storage';

interface ProfilePageViewProps {
  profile: UserProfile;
  student: StudentAccount | null;
  onSaveProfile: (newProfile: UserProfile) => Promise<void> | void;
  onSignOut: () => void;
  onBackToHome: () => void;
}

const COMMON_ALLERGENS = [
  { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
  { id: 'tree_nuts', label: 'Tree Nuts (Cashews, Almonds)', icon: '🌰' },
  { id: 'dairy', label: 'Dairy / Lactose (Milk, Curd, Paneer)', icon: '🥛' },
  { id: 'gluten', label: 'Gluten / Wheat (Roti, Maida, Bread)', icon: '🌾' },
  { id: 'soy', label: 'Soy (Soya Chunks, Soya Bean)', icon: '🫘' },
  { id: 'shellfish', label: 'Fish / Seafood', icon: '🐟' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'mustard', label: 'Mustard Seeds', icon: '🟡' },
];

const PRESET_AVATARS = [
  { id: 'scholar', emoji: '🎓', label: 'Scholar', bg: 'from-blue-600 to-indigo-700' },
  { id: 'athlete', emoji: '🏃', label: 'Athlete', bg: 'from-emerald-500 to-teal-700' },
  { id: 'beast', emoji: '🏋️', label: 'Gym Beast', bg: 'from-amber-500 to-orange-600' },
  { id: 'clean', emoji: '🥑', label: 'Clean Eater', bg: 'from-green-500 to-emerald-600' },
  { id: 'tiger', emoji: '🦁', label: 'Mascot', bg: 'from-orange-500 to-red-600' },
  { id: 'champ', emoji: '👑', label: 'Champion', bg: 'from-yellow-400 to-amber-600' },
  { id: 'zen', emoji: '🧘', label: 'Mindful', bg: 'from-purple-500 to-indigo-600' },
  { id: 'rocket', emoji: '🚀', label: 'Achiever', bg: 'from-rose-500 to-pink-600' },
];

export const ProfilePageView: React.FC<ProfilePageViewProps> = ({
  profile,
  student,
  onSaveProfile,
  onSignOut,
  onBackToHome,
}) => {
  const [formData, setFormData] = useState<CalculationInput>({
    name: profile.name && profile.name !== 'Student' && profile.name !== 'Arjun Verma' ? profile.name : '',
    hostelBlock: profile.hostelBlock || 'MH-1',
    age: profile.age || 20,
    gender: profile.gender || 'male',
    heightCm: profile.heightCm || 172,
    weightKg: profile.weightKg || 65,
    activityLevel: profile.activityLevel || 'moderately_active',
    goal: profile.goal || 'fitness',
    dietPreference: profile.dietPreference || 'non-veg',
    messType: profile.messType || 'non-veg',
    allergies: profile.allergies || [],
    hasMedicalCondition: Boolean(profile.hasMedicalCondition),
    medicalNotes: profile.medicalNotes || '',
  });

  const [selectedAvatar, setSelectedAvatar] = useState<string>('scholar');
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(() => {
    if (profile.goal === 'lose') return Math.max(35, (profile.weightKg || 65) - 4);
    if (profile.goal === 'gain') return (profile.weightKg || 65) + 4;
    return profile.weightKg || 65;
  });

  const [stats, setStats] = useState({
    currentStreak: 0,
    bestStreak: 0,
    totalLogs: 0,
    hasBreakfastLog: false,
    hasProteinMet: false,
    hasFoodCourtLog: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);

  // Load avatar and real stats on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('mess_mate_avatar_id');
      if (savedAvatar) setSelectedAvatar(savedAvatar);

      const streakData = calculateStreak();
      const logs = getStoredLogs();
      const todayStr = getTodayDateStr();
      const todaySum = getDaySummary(todayStr, profile);

      const hasBf = logs.some((l) => l.mealSlot === 'breakfast');
      const hasFc = logs.some((l) => l.source === 'food_court');

      setStats({
        currentStreak: streakData.currentStreak,
        bestStreak: streakData.bestStreak,
        totalLogs: logs.length,
        hasBreakfastLog: hasBf,
        hasProteinMet: todaySum.isProteinGoalMet,
        hasFoodCourtLog: hasFc,
      });
    }
  }, [profile]);

  // Live computed metrics using Mifflin-St Jeor
  const preview = calculateNutritionProfile(formData);

  const toggleAllergy = (allergyId: string) => {
    setFormData((prev: CalculationInput) => {
      const exists = prev.allergies.includes(allergyId);
      return {
        ...prev,
        allergies: exists
          ? prev.allergies.filter((a: string) => a !== allergyId)
          : [...prev.allergies, allergyId],
      };
    });
  };

  const handleSelectAvatar = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mess_mate_avatar_id', avatarId);
    }
    setIsAvatarPickerOpen(false);
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('mess_mate_logs');
        localStorage.removeItem('mess_mate_skip_counts');
        window.dispatchEvent(new Event('mess_mate_logs_updated'));
        setStats((prev) => ({ ...prev, totalLogs: 0, currentStreak: 0, bestStreak: 0 }));
        setShowClearCacheModal(false);
      } catch (e) {
        console.error('Error resetting cache', e);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.name.trim()) {
      setValidationError('Please enter your student name.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.hostelBlock.trim()) {
      setValidationError('Please select or specify your hostel block.');
      return;
    }
    if (formData.age < 16 || formData.age > 75) {
      setValidationError('Age must be between 16 and 75.');
      return;
    }
    if (formData.heightCm < 110 || formData.heightCm > 230) {
      setValidationError('Height must be between 110cm and 230cm.');
      return;
    }
    if (formData.weightKg < 30 || formData.weightKg > 200) {
      setValidationError('Weight must be between 30kg and 200kg.');
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfile = calculateNutritionProfile(formData);
      await onSaveProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setValidationError(err?.message || 'Error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // BMI Category determination
  const bmiCategory = () => {
    const b = preview.bmi;
    if (b < 18.5) return { label: 'Underweight', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (b <= 24.9) return { label: 'Healthy Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (b <= 29.9) return { label: 'Overweight', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Clinical Attention', color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const activeAvatar = PRESET_AVATARS.find((a) => a.id === selectedAvatar) || PRESET_AVATARS[0];

  return (
    <div className="space-y-5 pb-28 animate-fade-in text-[#143026] font-sans">
      {/* 1. Top Navigation Bar */}
      <div className="flex items-center justify-between pt-1">
        {student?.onboardingCompleted ? (
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center space-x-1.5 text-xs font-bold text-[#143026] hover:text-[#1B5E4A] bg-white border border-[#A9BFB5]/30 px-3.5 py-1.5 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#1B5E4A]" />
            <span>Back to Dashboard</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E4A] animate-pulse" />
            <span className="text-xs font-bold text-[#1B5E4A]">Step 2 of 2: Required Student Setup</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-[11px] font-black tracking-wider uppercase bg-[#D6E6DC] text-[#1B5E4A] px-2.5 py-1 rounded-full">
          <Shield className="w-3 h-3" />
          <span>VIT-AP Verified</span>
        </div>
      </div>

      {!student?.onboardingCompleted && (
        <div className="p-4 rounded-3xl bg-[#D6E6DC]/70 border border-[#1B5E4A]/30 text-[#143026] text-xs shadow-xs space-y-1">
          <p className="font-extrabold text-[#1B5E4A] text-sm flex items-center gap-1.5">
            <span>🎉 Email Verified Successfully!</span>
          </p>
          <p className="text-[11px] text-[#284237] leading-relaxed">
            Fill in your details and enrolled mess hall below so Mess Mate can personalize your daily calorie, protein, and dining targets.
          </p>
        </div>
      )}

      {/* 2. Hero Profile Card with Custom Avatar Picker */}
      <div className="bg-white border border-[#A9BFB5]/30 rounded-3xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-center space-x-4">
          {/* Avatar with tap-to-change pill */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setIsAvatarPickerOpen(true)}
              title="Tap to customize student avatar"
              className={`w-18 h-18 rounded-2xl bg-gradient-to-tr ${activeAvatar.bg} text-white flex items-center justify-center text-3xl shadow-md cursor-pointer active:scale-95 transition-transform border-2 border-white`}
            >
              <span>{activeAvatar.emoji}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAvatarPickerOpen(true)}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1B5E4A] text-white flex items-center justify-center shadow-xs border border-white hover:bg-[#004534] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#143026] truncate">
                {formData.name || 'Student Profile'}
              </h2>
            </div>
            <p className="text-xs text-[#5F7A6E] font-medium truncate mt-0.5">
              {student?.email || 'student@vitapstudent.ac.in'} • {formData.hostelBlock || 'Hostel'}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#D6E6DC] text-[#1B5E4A] border border-[#A9BFB5]/30">
                <span>
                  {formData.messType === 'special'
                    ? '⭐ Special Mess'
                    : formData.messType === 'veg'
                    ? '🟢 Veg Mess'
                    : '🍗 Non-Veg Mess'}
                </span>
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${bmiCategory().color}`}>
                BMI {preview.bmi} • {bmiCategory().label}
              </span>
            </div>
          </div>
        </div>

        {/* Success notification banner */}
        {saveSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile and mess schedule updated successfully!</span>
          </div>
        )}

        {/* Validation error notification banner */}
        {validationError && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-300 text-red-700 text-xs font-bold flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Avatar Picker Modal */}
      {isAvatarPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-[#A9BFB5]/30 space-y-4">
            <div className="flex items-center justify-between border-b border-[#A9BFB5]/20 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1B5E4A]" />
                <h3 className="text-sm font-black text-[#143026]">Choose Campus Persona</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(false)}
                className="text-xs font-bold text-[#5F7A6E] hover:text-[#143026]"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 pt-1">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => handleSelectAvatar(av.id)}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                    selectedAvatar === av.id
                      ? 'border-[#1B5E4A] bg-[#D6E6DC] ring-2 ring-[#1B5E4A]/30 scale-105'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                  <span className="text-[9px] font-bold text-[#143026] mt-1 truncate">{av.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Campus Consistency & Activity Hub */}
      <div className="bg-white border border-[#A9BFB5]/30 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🔥</span>
            <div>
              <h3 className="text-sm font-black text-[#143026]">Campus Consistency &amp; Stats</h3>
              <p className="text-[11px] text-[#5F7A6E]">Your active logging streak and milestones</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#1B5E4A] bg-[#D6E6DC] px-2.5 py-1 rounded-full">
            Active Tracker
          </span>
        </div>

        {/* 4-Stat Metric Row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-[#F5F3EE] p-2.5 rounded-2xl border border-[#A9BFB5]/20">
            <div className="text-[9px] font-bold text-[#5F7A6E] uppercase">Current</div>
            <div className="text-base font-black text-orange-600 mt-0.5">
              🔥 {stats.currentStreak}d
            </div>
            <div className="text-[9px] text-[#5F7A6E]">Streak</div>
          </div>

          <div className="bg-[#F5F3EE] p-2.5 rounded-2xl border border-[#A9BFB5]/20">
            <div className="text-[9px] font-bold text-[#5F7A6E] uppercase">Best</div>
            <div className="text-base font-black text-[#1B5E4A] mt-0.5">
              🏆 {stats.bestStreak}d
            </div>
            <div className="text-[9px] text-[#5F7A6E]">Record</div>
          </div>

          <div className="bg-[#F5F3EE] p-2.5 rounded-2xl border border-[#A9BFB5]/20">
            <div className="text-[9px] font-bold text-[#5F7A6E] uppercase">Meals</div>
            <div className="text-base font-black text-[#143026] mt-0.5">
              🍽️ {stats.totalLogs}
            </div>
            <div className="text-[9px] text-[#5F7A6E]">Logged</div>
          </div>

          <div className="bg-[#F5F3EE] p-2.5 rounded-2xl border border-[#A9BFB5]/20">
            <div className="text-[9px] font-bold text-[#5F7A6E] uppercase">Protein</div>
            <div className="text-base font-black text-blue-600 mt-0.5">
              {stats.hasProteinMet ? '✅ 100%' : '⚡ Live'}
            </div>
            <div className="text-[9px] text-[#5F7A6E]">Adherence</div>
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="border-t border-[#A9BFB5]/20 pt-3">
          <span className="text-[10px] font-bold text-[#5F7A6E] uppercase tracking-wider block mb-2">
            Campus Achievement Badges
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                title: 'First Plate',
                sub: 'Started Tracking',
                icon: '🏅',
                unlocked: stats.totalLogs > 0,
              },
              {
                title: 'Streak Fire',
                sub: '3+ Days Streak',
                icon: '🔥',
                unlocked: stats.bestStreak >= 3 || stats.currentStreak >= 3,
              },
              {
                title: 'Protein Master',
                sub: 'Target Reached',
                icon: '⚡',
                unlocked: stats.hasProteinMet,
              },
              {
                title: 'Food Explorer',
                sub: 'Rock Plaza / SAC',
                icon: '🥗',
                unlocked: stats.hasFoodCourtLog,
              },
            ].map((b, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-2xl border flex items-center space-x-2 transition-all ${
                  b.unlocked
                    ? 'bg-[#D6E6DC]/40 border-[#1B5E4A]/30 text-[#143026]'
                    : 'bg-gray-50/80 border-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <span className="text-xl">{b.icon}</span>
                <div className="min-w-0">
                  <div className="text-[11px] font-black leading-tight truncate">{b.title}</div>
                  <div className="text-[9px] font-semibold opacity-75">{b.unlocked ? 'Unlocked' : 'Locked'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* 4. Campus Mess Contract Selection */}
        <div className="bg-white border border-[#A9BFB5]/30 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🍽️</span>
            <div>
              <h3 className="text-sm font-black text-[#143026]">
                Campus Mess Contract Enrolled
              </h3>
              <p className="text-[11px] text-[#5F7A6E]">
                Select your official hostel mess dining contract to filter daily menus and nutrient scores.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {[
              {
                id: 'non-veg',
                label: 'Non-Veg Mess',
                icon: '🍗',
                desc: 'Chicken, fish & egg schedule. Veg replacement paneer dishes are excluded.',
                badge: 'Chicken / Fish / Eggs',
              },
              {
                id: 'veg',
                label: 'Veg Mess',
                icon: '🟢',
                desc: 'Strictly 100% vegetarian. Paneer, soya chunks, sundal & legumes. Zero meat/eggs.',
                badge: '100% Pure Veg',
              },
              {
                id: 'special',
                label: 'Special Mess',
                icon: '⭐',
                desc: 'Premium contract: Morning fresh juices, cereals, chef evening soups & desserts.',
                badge: 'Juices & Desserts',
              },
            ].map((m) => {
              const isSelected = formData.messType === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    const updates: Partial<CalculationInput> = { messType: m.id as MessType };
                    if (m.id === 'veg') {
                      updates.dietPreference = 'veg';
                    }
                    setFormData({ ...formData, ...updates });
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#1B5E4A] bg-[#D6E6DC]/40 ring-2 ring-[#1B5E4A]/30 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{m.icon}</span>
                    {isSelected && (
                      <span className="text-[10px] font-black text-white bg-[#1B5E4A] px-2 py-0.5 rounded-full">
                        Enrolled
                      </span>
                    )}
                  </div>
                  <div className="font-black text-xs text-[#143026]">{m.label}</div>
                  <p className="text-[10px] text-[#5F7A6E] mt-1 leading-relaxed">{m.desc}</p>
                  <div className="mt-2 text-[10px] font-bold text-[#5F7A6E]/80">
                    {m.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Student Identity & Hostel Block */}
        <div className="bg-white border border-[#A9BFB5]/30 rounded-3xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏢</span>
            <div>
              <h3 className="text-sm font-black text-[#143026]">Student Identity &amp; Block</h3>
              <p className="text-[11px] text-[#5F7A6E]">Your campus identifier and residence</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#143026] mb-1">Full Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Yaswanth"
                className="w-full px-4 py-2.5 rounded-xl border border-[#A9BFB5]/40 text-xs text-[#143026] focus:outline-hidden focus:border-[#1B5E4A] focus:ring-1 focus:ring-[#1B5E4A] bg-[#FBF9F4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143026] mb-1">Hostel Block / Wing</label>
              <input
                type="text"
                value={formData.hostelBlock}
                onChange={(e) => setFormData({ ...formData, hostelBlock: e.target.value })}
                placeholder="e.g. MH-1, LH-2"
                className="w-full px-4 py-2.5 rounded-xl border border-[#A9BFB5]/40 text-xs text-[#143026] focus:outline-hidden focus:border-[#1B5E4A] focus:ring-1 focus:ring-[#1B5E4A] bg-[#FBF9F4]"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['MH-1', 'MH-2', 'MH-3', 'MH-4', 'MH-5', 'LH-1', 'LH-2', 'LH-3'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData({ ...formData, hostelBlock: b })}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                      formData.hostelBlock === b
                        ? 'bg-[#1B5E4A] text-white border-[#1B5E4A]'
                        : 'bg-white text-[#5F7A6E] border-[#A9BFB5]/40 hover:bg-[#F5F3EE]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Physical Biomarkers & Mifflin-St Jeor Engine */}
        <div className="bg-white border border-[#A9BFB5]/30 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚖️</span>
            <div>
              <h3 className="text-sm font-black text-[#143026]">Physical Biomarkers &amp; Targets</h3>
              <p className="text-[11px] text-[#5F7A6E]">Clinical inputs for energy expenditure calculation</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#143026] mb-1">Age</label>
              <input
                type="number"
                min="16"
                max="75"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A9BFB5]/40 text-xs text-[#143026] bg-[#FBF9F4] focus:border-[#1B5E4A] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143026] mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A9BFB5]/40 text-xs text-[#143026] bg-[#FBF9F4] focus:border-[#1B5E4A] focus:outline-hidden"
              >
                <option value="male">Male (Mifflin formula +5)</option>
                <option value="female">Female (Mifflin formula -161)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#143026] mb-1">Height (cm)</label>
              <input
                type="number"
                min="110"
                max="230"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A9BFB5]/40 text-xs text-[#143026] bg-[#FBF9F4] focus:border-[#1B5E4A] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143026] mb-1">Current Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="200"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A9BFB5]/40 text-xs text-[#143026] bg-[#FBF9F4] focus:border-[#1B5E4A] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Target Weight & Pace Card */}
          <div className="bg-[#F5F3EE] p-3.5 rounded-2xl border border-[#A9BFB5]/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#143026] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#1B5E4A]" />
                <span>Target Weight Goal</span>
              </span>
              <span className="text-xs font-black text-[#1B5E4A]">
                {targetWeightKg} kg
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={Math.max(35, formData.weightKg - 25)}
                max={Math.min(180, formData.weightKg + 25)}
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full accent-[#1B5E4A] cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#5F7A6E]">
              <span>Current: {formData.weightKg} kg</span>
              <span>
                {targetWeightKg === formData.weightKg
                  ? 'Maintenance'
                  : targetWeightKg < formData.weightKg
                  ? `Goal: -${(formData.weightKg - targetWeightKg).toFixed(1)} kg loss (~0.4 kg/wk)`
                  : `Goal: +${(targetWeightKg - formData.weightKg).toFixed(1)} kg gain (~0.3 kg/wk)`}
              </span>
            </div>
          </div>

          {/* Activity Multipliers */}
          <div>
            <label className="block text-xs font-bold text-[#143026] mb-2">Campus Activity Multiplier</label>
            <div className="space-y-2">
              {[
                { id: 'sedentary', title: 'Sedentary (1.2×)', sub: 'Mostly studying, lectures & desk work' },
                { id: 'lightly_active', title: 'Lightly Active (1.375×)', sub: 'Frequent campus department walking' },
                { id: 'moderately_active', title: 'Moderately Active (1.55×)', sub: 'Gym or sports 3–5 days/week' },
                { id: 'very_active', title: 'Very Active (1.725×)', sub: 'College varsity / intense daily training' },
              ].map((act) => (
                <label
                  key={act.id}
                  className={`flex items-center p-3 rounded-2xl border cursor-pointer transition-all ${
                    formData.activityLevel === act.id
                      ? 'border-[#1B5E4A] bg-[#D6E6DC]/40 text-[#143026] font-bold shadow-xs'
                      : 'border-gray-200 bg-white text-[#5F7A6E] hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="activityLevel"
                    value={act.id}
                    checked={formData.activityLevel === act.id}
                    onChange={() => setFormData({ ...formData, activityLevel: act.id as ActivityLevel })}
                    className="mr-3 text-[#1B5E4A] focus:ring-[#1B5E4A]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#143026]">{act.title}</div>
                    <div className="text-[11px] text-[#5F7A6E] font-normal">{act.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Live Nutrition Dashboard Card */}
          <div className="bg-[#143026] text-white rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Nutrition Computation</span>
              </span>
              <span className="text-[10px] text-gray-300 font-medium">Mifflin-St Jeor Formula</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <div className="text-[10px] text-gray-300 font-bold uppercase">Daily Calories</div>
                <div className="text-xl font-black text-white mt-0.5">{preview.targetCalories} kcal</div>
                <div className="text-[10px] text-gray-300">TDEE: {preview.tdee}</div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <div className="text-[10px] text-gray-300 font-bold uppercase">Protein Target</div>
                <div className="text-xl font-black text-emerald-300 mt-0.5">{preview.targetProteinG}g</div>
                <div className="text-[10px] text-gray-300">BMR: {preview.bmr} kcal</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
              <div>
                <span className="text-gray-300 block text-[10px]">Carbs (Remainder)</span>
                <span className="font-bold text-amber-300">{preview.targetCarbsG}g</span>
              </div>
              <div>
                <span className="text-gray-300 block text-[10px]">Fat (25% kcal)</span>
                <span className="font-bold text-purple-300">{preview.targetFatG}g</span>
              </div>
              <div>
                <span className="text-gray-300 block text-[10px]">BMI</span>
                <span className="font-bold text-emerald-300">{preview.bmi}</span>
              </div>
            </div>

            {/* Meal Slot Sub-Targets (25% / 35% / 30% / 10%) */}
            <div className="border-t border-white/10 pt-2.5 mt-2">
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block mb-1.5 text-left">
                Meal-Level Sub-Targets
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                <div className="bg-white/5 p-1.5 rounded-xl border border-white/10">
                  <div className="text-gray-300 font-semibold text-[9px]">Breakfast (25%)</div>
                  <div className="font-bold text-white mt-0.5">{Math.round(preview.targetCalories * 0.25)} kcal</div>
                  <div className="text-emerald-300 text-[9px] font-semibold">{Math.round(preview.targetProteinG * 0.25)}g P</div>
                </div>
                <div className="bg-white/5 p-1.5 rounded-xl border border-white/10">
                  <div className="text-gray-300 font-semibold text-[9px]">Lunch (35%)</div>
                  <div className="font-bold text-white mt-0.5">{Math.round(preview.targetCalories * 0.35)} kcal</div>
                  <div className="text-emerald-300 text-[9px] font-semibold">{Math.round(preview.targetProteinG * 0.35)}g P</div>
                </div>
                <div className="bg-white/5 p-1.5 rounded-xl border border-white/10">
                  <div className="text-gray-300 font-semibold text-[9px]">Dinner (30%)</div>
                  <div className="font-bold text-white mt-0.5">{Math.round(preview.targetCalories * 0.30)} kcal</div>
                  <div className="text-emerald-300 text-[9px] font-semibold">{Math.round(preview.targetProteinG * 0.30)}g P</div>
                </div>
                <div className="bg-white/5 p-1.5 rounded-xl border border-white/10">
                  <div className="text-gray-300 font-semibold text-[9px]">Snacks (10%)</div>
                  <div className="font-bold text-white mt-0.5">{Math.round(preview.targetCalories * 0.10)} kcal</div>
                  <div className="text-emerald-300 text-[9px] font-semibold">{Math.round(preview.targetProteinG * 0.10)}g P</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Nutrition Goal */}
        <div className="bg-white border border-[#A9BFB5]/30 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <div>
              <h3 className="text-sm font-black text-[#143026]">Primary Goal</h3>
              <p className="text-[11px] text-[#5F7A6E]">Sets energy deficit/surplus and protein distribution</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'lose', label: 'Weight Loss', icon: '🔥', desc: '-450 kcal · 1.8g/kg' },
              { id: 'fitness', label: 'Fitness / Recomp', icon: '⚡', desc: '-150 kcal · 2.0g/kg' },
              { id: 'gain', label: 'Muscle Gain', icon: '💪', desc: '+400 kcal · 1.9g/kg' },
              { id: 'maintain', label: 'Maintenance', icon: '⚖️', desc: 'TDEE · 1.4g/kg' },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setFormData({ ...formData, goal: g.id as GoalType })}
                className={`p-3 rounded-2xl text-center border text-xs transition-all cursor-pointer ${
                  formData.goal === g.id
                    ? 'border-[#1B5E4A] bg-[#D6E6DC] font-black text-[#143026] ring-2 ring-[#1B5E4A]/30 shadow-xs'
                    : 'border-gray-200 bg-white text-[#5F7A6E] hover:bg-gray-50'
                }`}
              >
                <div className="text-xl mb-1">{g.icon}</div>
                <div className="font-black text-xs text-[#143026]">{g.label}</div>
                <div className="text-[10px] text-[#5F7A6E] mt-0.5">{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 8. Dietary Preference & Allergy Filters */}
        <div className="bg-white border border-[#A9BFB5]/30 rounded-3xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🥗</span>
            <div>
              <h3 className="text-sm font-black text-[#143026]">Dietary &amp; Allergy Filters</h3>
              <p className="text-[11px] text-[#5F7A6E]">Strict exclusions applied to every meal suggestion</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#143026] mb-2">Dietary Preference</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'veg', label: 'Vegetarian', icon: '🟢' },
                { id: 'egg', label: 'Eggetarian', icon: '🥚' },
                { id: 'non-veg', label: 'Non-Veg', icon: '🍗' },
              ].map((diet) => (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, dietPreference: diet.id as DietPreference })}
                  className={`p-3 rounded-2xl text-center border text-xs font-black transition-all cursor-pointer ${
                    formData.dietPreference === diet.id
                      ? 'border-[#1B5E4A] bg-[#D6E6DC] text-[#143026] shadow-xs ring-2 ring-[#1B5E4A]/20'
                      : 'border-gray-200 bg-white text-[#5F7A6E] hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xl mb-1">{diet.icon}</div>
                  {diet.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#143026] mb-1.5">Allergies (Strict Exclusion)</label>
            <div className="space-y-1.5">
              {COMMON_ALLERGENS.map((allg) => {
                const checked = formData.allergies.includes(allg.id);
                return (
                  <label
                    key={allg.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? 'border-red-400 bg-red-50/60 text-red-900 font-bold'
                        : 'border-gray-200 bg-white text-[#143026] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{allg.icon}</span>
                      <span>{allg.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAllergy(allg.id)}
                      className="rounded-sm text-red-600 focus:ring-red-500"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* 9. Medical & Dietary Health Screening */}
        <div className="bg-white border border-[#A9BFB5]/30 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🩺</span>
              <div>
                <h3 className="text-sm font-black text-[#143026]">Medical Health Notes</h3>
                <p className="text-[11px] text-[#5F7A6E]">Optional dietary guidelines or health restrictions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasMedicalCondition}
                onChange={(e) => setFormData({ ...formData, hasMedicalCondition: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B5E4A]"></div>
            </label>
          </div>

          {formData.hasMedicalCondition && (
            <div className="pt-2 animate-fade-in">
              <label className="block text-xs font-bold text-[#143026] mb-1">
                Medical condition details (e.g. Acidity, Lactose intolerance, Diabetes)
              </label>
              <textarea
                value={formData.medicalNotes || ''}
                onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                rows={2}
                placeholder="Mention any specific doctor recommendations or dietary restrictions..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A9BFB5]/40 text-xs text-[#143026] bg-[#FBF9F4] focus:border-[#1B5E4A] focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* 10. Native App Info & Data Management */}
        <div className="bg-[#F5F3EE] border border-[#A9BFB5]/30 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1B5E4A] animate-pulse" />
              <span className="text-xs font-black text-[#143026]">Mess Mate Android v1.0.2</span>
            </div>
            <span className="text-[10px] font-bold text-[#5F7A6E]">Native Production App</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#A9BFB5]/20 text-[11px]">
            <span className="text-[#5F7A6E]">Reset &amp; Refresh Data:</span>
            <button
              type="button"
              onClick={() => setShowClearCacheModal(true)}
              className="text-[#1B5E4A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear Local Logs Cache</span>
            </button>
          </div>
        </div>

        {/* Clear Cache Confirmation Modal */}
        {showClearCacheModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-[#A9BFB5]/30 space-y-3">
              <h3 className="text-sm font-black text-[#143026]">Clear Stored Logs?</h3>
              <p className="text-xs text-[#5F7A6E] leading-relaxed">
                This will reset your local meal history on this phone and refresh from the college database.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClearCacheModal(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 11. Save & Logout Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#1B5E4A] hover:bg-[#004534] active:scale-[0.99] text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-md transition-all cursor-pointer disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSaving
                ? 'Saving Changes...'
                : student?.onboardingCompleted
                ? 'Save Profile & Update Menus'
                : 'Complete Setup & Enter Mess Mate 🚀'}
            </span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="w-full bg-white border border-[#A9BFB5]/40 hover:bg-[#F5F3EE] text-[#5F7A6E] hover:text-[#143026] font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2 text-xs shadow-xs transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#5F7A6E]" />
            <span>Sign Out of College Account</span>
          </button>
        </div>
      </form>
    </div>
  );
};
