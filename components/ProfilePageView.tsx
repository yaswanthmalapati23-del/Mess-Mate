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

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  return (
    <div className="space-y-5 pb-24 animate-fade-in text-gray-900">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center space-x-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-white border border-gray-200/90 px-3.5 py-1.5 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Student Profile
        </span>
      </div>

      {/* 2. Profile Hero Card */}
      <div className="bg-white border border-gray-150/80 rounded-3xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1B5E4A] via-orange-500 to-amber-500 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold text-gray-900 truncate">
              {formData.name || 'Student Profile'}
            </h2>
            <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
              {student?.email || 'vitapstudent.ac.in'} • {formData.hostelBlock || 'Hostel'}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#1B5E4A]">
                <span>{formData.messType === 'special' ? '⭐ Special Mess' : formData.messType === 'veg' ? '🟢 Veg Mess' : '🍗 Non-Veg Mess'}</span>
              </span>
              <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                BMI {preview.bmi}
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

      <form onSubmit={handleSave} className="space-y-5">
        {/* 3. SECTION: CAMPUS MESS ENROLLMENT (CORE REQUIREMENT) */}
        <div className="bg-white border border-gray-150/80 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🍽️</span>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">
                Campus Mess Contract Enrolled
              </h3>
              <p className="text-[11px] text-gray-500">
                Choose the single mess hall you are enrolled in. The entire app strictly filters your daily & monthly menus to this contract.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {[
              {
                id: 'non-veg',
                label: 'Non-Veg Mess',
                icon: '🍗',
                desc: 'Authentic chicken, fish & egg schedule. Veg replacement paneer dishes are excluded.',
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
                desc: 'Premium contract: 250ml morning fresh fruit juices, cereals, chef evening soups & desserts.',
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
                      ? 'border-[#1B5E4A] bg-orange-50/50 ring-2 ring-[#1B5E4A]/20 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{m.icon}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-white bg-[#1B5E4A] px-2 py-0.5 rounded-full">
                        Enrolled
                      </span>
                    )}
                  </div>
                  <div className="font-extrabold text-xs text-gray-900">{m.label}</div>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{m.desc}</p>
                  <div className="mt-2 text-[10px] font-bold text-gray-400">
                    {m.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SECTION: STUDENT IDENTITY & HOSTEL WING */}
        <div className="bg-white border border-gray-150/80 rounded-3xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏢</span>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Student Identity &amp; Block</h3>
              <p className="text-[11px] text-gray-500">Your campus residence and identifier</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Yaswanth"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-[#1B5E4A] focus:ring-1 focus:ring-[#1B5E4A] bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hostel Block / Wing</label>
              <input
                type="text"
                value={formData.hostelBlock}
                onChange={(e) => setFormData({ ...formData, hostelBlock: e.target.value })}
                placeholder="e.g. MH-1, LH-2"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-[#1B5E4A] focus:ring-1 focus:ring-[#1B5E4A] bg-gray-50/50"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['MH-1', 'MH-2', 'MH-3', 'MH-4', 'MH-5', 'LH-1', 'LH-2', 'LH-3'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData({ ...formData, hostelBlock: b })}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                      formData.hostelBlock === b
                        ? 'bg-[#1B5E4A] text-white border-[#1B5E4A]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. SECTION: PHYSICAL BIOMARKERS (MIFFLIN-ST JEOR FORMULA) */}
        <div className="bg-white border border-gray-150/80 rounded-3xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚖️</span>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Physical Biomarkers</h3>
              <p className="text-[11px] text-gray-500">Clinical inputs used to calculate BMR and energy targets</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Age</label>
              <input
                type="number"
                min="16"
                max="75"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-gray-50/50 focus:border-[#1B5E4A] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-gray-50/50 focus:border-[#1B5E4A] focus:outline-hidden"
              >
                <option value="male">Male (Mifflin formula +5)</option>
                <option value="female">Female (Mifflin formula -161)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                min="110"
                max="230"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-gray-50/50 focus:border-[#1B5E4A] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="200"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-gray-50/50 focus:border-[#1B5E4A] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Campus Activity Multiplier</label>
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
                      ? 'border-[#1B5E4A] bg-orange-50/40 text-gray-900 font-bold shadow-xs'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
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
                    <div className="text-xs font-bold">{act.title}</div>
                    <div className="text-[11px] text-gray-400 font-normal">{act.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Live Nutrition Dashboard Card */}
          <div className="bg-gray-900 text-white rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs border-b border-gray-800 pb-2">
              <span className="font-bold uppercase tracking-wider text-orange-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Nutrition Computation</span>
              </span>
              <span className="text-[11px] text-gray-400">Clinical Guardrails Active</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-800/80 p-2.5 rounded-xl">
                <div className="text-[10px] text-gray-400 font-bold">DAILY CALORIES</div>
                <div className="text-xl font-black text-white mt-0.5">{preview.targetCalories} kcal</div>
                <div className="text-[10px] text-gray-400">TDEE: {preview.tdee}</div>
              </div>
              <div className="bg-gray-800/80 p-2.5 rounded-xl">
                <div className="text-[10px] text-gray-400 font-bold">PROTEIN TARGET</div>
                <div className="text-xl font-black text-blue-400 mt-0.5">{preview.targetProteinG}g</div>
                <div className="text-[10px] text-gray-400">BMR: {preview.bmr} kcal</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
              <div>
                <span className="text-gray-400 block text-[10px]">Carbs (Remainder)</span>
                <span className="font-bold text-amber-300">{preview.targetCarbsG}g</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Fat (25% kcal)</span>
                <span className="font-bold text-purple-300">{preview.targetFatG}g</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">BMI</span>
                <span className="font-bold text-emerald-400">{preview.bmi}</span>
              </div>
            </div>

            {/* Meal Slot Sub-Targets (25% / 35% / 30% / 10%) */}
            <div className="border-t border-gray-700/60 pt-2.5 mt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 text-left">
                Meal-Level Sub-Targets
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                <div className="bg-gray-800/60 p-1.5 rounded-xl border border-gray-700/40">
                  <div className="text-gray-400 font-semibold text-[9px]">Breakfast (25%)</div>
                  <div className="font-bold text-white mt-0.5">{Math.round(preview.targetCalories * 0.25)} kcal</div>
                  <div className="text-emerald-400 text-[9px] font-semibold">{Math.round(preview.targetProteinG * 0.25)}g P</div>
                </div>
                <div className="bg-gray-800/60 p-1.5 rounded-xl border border-gray-700/40">
                  <div className="text-gray-400 font-semibold text-[9px]">Lunch (35%)</div>
                  <div className="font-bold text-white mt-0.5">{Math.round(preview.targetCalories * 0.35)} kcal</div>
                  <div className="text-emerald-400 text-[9px] font-semibold">{Math.round(preview.targetProteinG * 0.35)}g P</div>
                </div>
                <div className="bg-gray-800/60 p-1.5 rounded-xl border border-gray-700/40">
                  <div className="text-gray-400 font-semibold text-[9px]">Dinner (30%)</div>
                  <div className="font-bold text-white mt-0.5">{Math.round(preview.targetCalories * 0.30)} kcal</div>
                  <div className="text-emerald-400 text-[9px] font-semibold">{Math.round(preview.targetProteinG * 0.30)}g P</div>
                </div>
                <div className="bg-gray-800/60 p-1.5 rounded-xl border border-gray-700/40">
                  <div className="text-gray-400 font-semibold text-[9px]">Snacks (10%)</div>
                  <div className="font-bold text-white mt-0.5">{Math.round(preview.targetCalories * 0.10)} kcal</div>
                  <div className="text-emerald-400 text-[9px] font-semibold">{Math.round(preview.targetProteinG * 0.10)}g P</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. SECTION: NUTRITION GOAL */}
        <div className="bg-white border border-gray-150/80 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Primary Goal</h3>
              <p className="text-[11px] text-gray-500">Sets energy deficit/surplus and protein distribution</p>
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
                    ? 'border-[#1B5E4A] bg-[#D8E8DE]/40 font-bold text-gray-900 ring-2 ring-[#1B5E4A]/30'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="text-xl mb-1">{g.icon}</div>
                <div className="font-bold">{g.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 7. SECTION: DIETARY PREFERENCE & ALLERGIES */}
        <div className="bg-white border border-gray-150/80 rounded-3xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🥗</span>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Dietary &amp; Allergy Filters</h3>
              <p className="text-[11px] text-gray-500">Strict exclusions applied to every meal plate</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Dietary Preference</label>
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
                  className={`p-3 rounded-2xl text-center border text-xs font-bold transition-all cursor-pointer ${
                    formData.dietPreference === diet.id
                      ? 'border-[#1B5E4A] bg-orange-50/60 text-gray-900 shadow-xs ring-2 ring-[#1B5E4A]/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xl mb-1">{diet.icon}</div>
                  {diet.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Allergies (Strict Exclusion)</label>
            <div className="space-y-1.5">
              {COMMON_ALLERGENS.map((allg) => {
                const checked = formData.allergies.includes(allg.id);
                return (
                  <label
                    key={allg.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? 'border-red-400 bg-red-50/50 text-red-900 font-bold'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
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

        {/* 8. Save & Logout Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#1B5E4A] hover:bg-[#004534] active:scale-[0.99] text-white font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-md transition-all cursor-pointer disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile & Update Menus'}</span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2 text-xs shadow-xs transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-gray-400" />
            <span>Sign Out of College Account</span>
          </button>
        </div>
      </form>
    </div>
  );
};
