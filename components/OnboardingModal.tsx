'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Scale } from 'lucide-react';
import { ActivityLevel, GoalType, UserProfile, MessType } from '@/lib/types';
import { calculateNutritionProfile, CalculationInput } from '@/lib/nutrition/calculator';

interface OnboardingModalProps {
  isOpen: boolean;
  currentProfile: UserProfile;
  studentEmail?: string;
  onSave: (profile: UserProfile) => void;
  onClose?: () => void;
}

const COMMON_ALLERGENS = [
  { id: 'dairy', label: 'Dairy / Lactose (Milk, Curd, Paneer)' },
  { id: 'gluten', label: 'Gluten (Roti, Atta, Maida, Suji)' },
  { id: 'nuts', label: 'Peanuts / Tree Nuts' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'soy', label: 'Soy / Soya Badi' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  currentProfile,
  studentEmail,
  onSave,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  const getInitialName = () => {
    if (currentProfile.name && currentProfile.name !== 'Arjun Verma' && currentProfile.name !== 'Student') {
      return currentProfile.name;
    }
    if (studentEmail) {
      const username = studentEmail.split('@')[0];
      const namePart = username.split(/[._]/)[0].replace(/\d+/g, '');
      if (namePart) {
        return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
      }
    }
    return '';
  };

  const isRealProfile = Boolean(
    currentProfile.name &&
    currentProfile.name !== 'Arjun Verma' &&
    currentProfile.name !== 'Student'
  );

  const [formData, setFormData] = useState<CalculationInput>({
    name: getInitialName(),
    hostelBlock: isRealProfile && currentProfile.hostelBlock ? currentProfile.hostelBlock : '',
    age: isRealProfile && currentProfile.age ? currentProfile.age : 20,
    gender: currentProfile.gender || 'male',
    heightCm: isRealProfile && currentProfile.heightCm ? currentProfile.heightCm : 172,
    weightKg: isRealProfile && currentProfile.weightKg ? currentProfile.weightKg : 65,
    activityLevel: currentProfile.activityLevel || 'moderately_active',
    goal: currentProfile.goal || 'fitness',
    dietPreference: currentProfile.dietPreference || 'veg',
    messType: currentProfile.messType || 'non-veg',
    allergies: isRealProfile && currentProfile.allergies ? currentProfile.allergies : [],
    hasMedicalCondition: isRealProfile ? Boolean(currentProfile.hasMedicalCondition) : false,
    medicalNotes: isRealProfile ? (currentProfile.medicalNotes || '') : '',
  });

  // Re-sync when modal opens with new student email or profile
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setStepError(null);
      const isReal = Boolean(
        currentProfile.name &&
        currentProfile.name !== 'Arjun Verma' &&
        currentProfile.name !== 'Student'
      );
      const initialName = getInitialName();
      setFormData((prev) => ({
        name: isReal ? currentProfile.name : (initialName || prev.name || ''),
        hostelBlock: isReal && currentProfile.hostelBlock ? currentProfile.hostelBlock : (prev.hostelBlock || ''),
        age: isReal && currentProfile.age ? currentProfile.age : (prev.age || 20),
        gender: currentProfile.gender || prev.gender || 'male',
        heightCm: isReal && currentProfile.heightCm ? currentProfile.heightCm : (prev.heightCm || 172),
        weightKg: isReal && currentProfile.weightKg ? currentProfile.weightKg : (prev.weightKg || 65),
        activityLevel: currentProfile.activityLevel || prev.activityLevel || 'moderately_active',
        goal: currentProfile.goal || prev.goal || 'fitness',
        dietPreference: currentProfile.dietPreference || prev.dietPreference || 'veg',
        messType: currentProfile.messType || prev.messType || 'non-veg',
        allergies: isReal && currentProfile.allergies ? currentProfile.allergies : (prev.allergies || []),
        hasMedicalCondition: isReal ? Boolean(currentProfile.hasMedicalCondition) : false,
        medicalNotes: isReal ? (currentProfile.medicalNotes || '') : '',
      }));
    }
  }, [isOpen, studentEmail, currentProfile]);

  if (!isOpen) return null;

  const previewProfile = calculateNutritionProfile(formData);

  const toggleAllergy = (allergyId: string) => {
    setFormData((prev) => {
      const exists = prev.allergies.includes(allergyId);
      return {
        ...prev,
        allergies: exists
          ? prev.allergies.filter((a) => a !== allergyId)
          : [...prev.allergies, allergyId],
      };
    });
  };

  const handleNextStep = () => {
    setStepError(null);
    if (step === 1) {
      if (!formData.name.trim()) {
        setStepError('Please enter your name.');
        return;
      }
      if (!formData.hostelBlock.trim()) {
        setStepError('Please select or enter your hostel block.');
        return;
      }
      if (!formData.age || formData.age < 15 || formData.age > 80) {
        setStepError('Please enter a valid age (15 – 80).');
        return;
      }
      if (!formData.heightCm || formData.heightCm < 100 || formData.heightCm > 240) {
        setStepError('Please enter a valid height in cm (100 – 240).');
        return;
      }
      if (!formData.weightKg || formData.weightKg < 30 || formData.weightKg > 200) {
        setStepError('Please enter a valid weight in kg (30 – 200).');
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleFinish = () => {
    onSave(previewProfile);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] overflow-hidden text-gray-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/70">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-terracotta-400 uppercase">
              Phase 1 • Step {step} of 4
            </span>
            <h2 className="text-base font-bold text-gray-900 mt-0.5">
              {step === 1 && 'Physical Biomarkers'}
              {step === 2 && 'Goal & Campus Activity'}
              {step === 3 && 'Diet, Allergies & Health'}
              {step === 4 && 'Your Personalized Targets'}
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 p-1.5 rounded-xl hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Validation Alert */}
          {stepError && (
            <div className="bg-red-950/70 border border-red-500/50 text-red-200 px-3.5 py-2.5 rounded-2xl flex items-center space-x-2 text-xs animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{stepError}</span>
            </div>
          )}

          {/* STEP 1: Basic Physical Stats */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setStepError(null);
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  placeholder="e.g. Yaswanth or Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-hidden focus:border-terracotta-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Hostel Block / Wing</label>
                <input
                  type="text"
                  value={formData.hostelBlock}
                  onChange={(e) => {
                    setStepError(null);
                    setFormData({ ...formData, hostelBlock: e.target.value });
                  }}
                  placeholder="e.g. MH-1, MH-2, LH-1, LH-2"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-hidden focus:border-terracotta-500 text-xs"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['MH-1', 'MH-2', 'MH-3', 'MH-4', 'MH-5', 'LH-1', 'LH-2'].map((block) => (
                    <button
                      key={block}
                      type="button"
                      onClick={() => {
                        setStepError(null);
                        setFormData({ ...formData, hostelBlock: block });
                      }}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                        formData.hostelBlock === block
                          ? 'bg-terracotta-900/80 border-terracotta-500 text-terracotta-200 font-bold shadow-glow-terracotta'
                          : 'bg-obsidian-950 border-gray-200 text-gray-400 hover:text-gray-900 hover:border-white/20'
                      }`}
                    >
                      {block}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="16"
                    max="60"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-hidden focus:border-terracotta-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Gender (BMR Formula)</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-hidden focus:border-terracotta-500 text-xs"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="120"
                    max="220"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-hidden focus:border-terracotta-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    min="35"
                    max="180"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-hidden focus:border-terracotta-500 text-xs"
                  />
                </div>
              </div>

              {/* BMI Indicator */}
              <div className="bg-obsidian-950 p-3 rounded-2xl border border-gray-150 flex items-center justify-between text-gray-400">
                <span>Calculated BMI: <strong className="text-gray-900 font-display">{previewProfile.bmi}</strong></span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  previewProfile.isExtremeBmi
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    : 'bg-olive-900/60 text-olive-300 border border-olive-700/40'
                }`}>
                  {previewProfile.bmi < 18.5 ? 'Underweight' : previewProfile.bmi <= 24.9 ? 'Normal Reference' : previewProfile.bmi <= 29.9 ? 'Overweight' : 'Obese'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Goal & Activity */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Individual Target</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'lose', label: 'Lose Weight', desc: 'Calorie deficit (-450 kcal)' },
                    { id: 'maintain', label: 'Maintain Weight', desc: 'Sustain energy balance' },
                    { id: 'gain', label: 'Gain Muscle', desc: 'Hypertrophy surplus (+400 kcal)' },
                    { id: 'fitness', label: 'Improve Fitness', desc: 'High protein recomp' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, goal: g.id as GoalType })}
                      className={`p-3.5 rounded-2xl text-left border transition-all duration-200 ${
                        formData.goal === g.id
                          ? 'border-terracotta-500 bg-terracotta-950/50 shadow-glow-terracotta text-gray-900 font-bold'
                          : 'border-gray-150 bg-obsidian-950/60 text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      <div className="font-display font-bold text-xs text-gray-900">{g.label}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Campus Activity Multiplier</label>
                <div className="space-y-2">
                  {[
                    { id: 'sedentary', title: 'Sedentary', sub: 'Desk studying & lectures mostly' },
                    { id: 'lightly_active', title: 'Lightly Active', sub: 'Walking across campus departments' },
                    { id: 'moderately_active', title: 'Moderately Active', sub: 'Gym / Sports 3–5 days per week' },
                    { id: 'very_active', title: 'Very Active', sub: 'College varsity / intense daily training' },
                  ].map((act) => (
                    <label
                      key={act.id}
                      className={`flex items-center p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        formData.activityLevel === act.id
                          ? 'border-terracotta-500/80 bg-terracotta-950/40 text-gray-900 shadow-xs'
                          : 'border-gray-150 bg-obsidian-950/60 text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      <input
                        type="radio"
                        name="activityLevel"
                        value={act.id}
                        checked={formData.activityLevel === act.id}
                        onChange={() => setFormData({ ...formData, activityLevel: act.id as ActivityLevel })}
                        className="text-terracotta-500 focus:ring-terracotta-500 mr-3"
                      />
                      <div>
                        <div className="font-bold text-xs text-gray-900">{act.title}</div>
                        <div className="text-[11px] text-gray-400">{act.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Diet Preference, Allergies & Medical Screening */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Campus Mess Enrolled</label>
                <p className="text-[11px] text-gray-500 mb-2">
                  Select your single enrolled hostel mess. The app will strictly tailor your daily & monthly menus to this contract.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'non-veg', label: 'Non-Veg Mess', icon: '🍗', desc: 'Chicken, fish, eggs & standard curries' },
                    { id: 'veg', label: 'Veg Mess', icon: '🟢', desc: '100% vegetarian with paneer & soya' },
                    { id: 'special', label: 'Special Mess', icon: '⭐', desc: 'Juices, cereals, chef soups & desserts' },
                  ].map((m) => (
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
                      className={`p-3 rounded-2xl text-center border text-xs transition-all cursor-pointer ${
                        formData.messType === m.id
                          ? 'border-[#E04F16] bg-orange-50/60 text-gray-900 shadow-xs font-bold ring-2 ring-[#E04F16]/20'
                          : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xl mb-1">{m.icon}</div>
                      <div className="font-bold text-xs">{m.label}</div>
                      <div className="text-[10px] text-gray-400 mt-1 leading-tight">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Dietary Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'veg', label: 'Vegetarian', icon: '🟢' },
                    { id: 'egg', label: 'Eggetarian', icon: '🥚' },
                    { id: 'non-veg', label: 'Non-Veg', icon: '🍗' },
                  ].map((diet) => (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, dietPreference: diet.id as any })}
                      className={`p-3 rounded-2xl text-center border text-xs font-bold transition-all ${
                        formData.dietPreference === diet.id
                          ? 'border-[#E04F16] bg-orange-50/60 text-gray-900 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-base mb-1">{diet.icon}</div>
                      {diet.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">Allergies (Strict Exclusion Filter)</label>
                <div className="space-y-1.5">
                  {COMMON_ALLERGENS.map((allg) => {
                    const checked = formData.allergies.includes(allg.id);
                    return (
                      <button
                        key={allg.id}
                        type="button"
                        onClick={() => toggleAllergy(allg.id)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                          checked
                            ? 'border-terracotta-500/60 bg-terracotta-950/70 text-terracotta-200'
                            : 'border-gray-150 bg-obsidian-950 text-gray-400 hover:text-gray-900'
                        }`}
                      >
                        <span>{allg.label}</span>
                        {checked && <span className="text-[10px] bg-terracotta-900 text-terracotta-300 px-2 py-0.5 rounded font-bold">Filtered</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guardrail Question: Medical / Eating Concern */}
              <div className="bg-saffron-950/40 border border-saffron-600/30 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-start space-x-2.5">
                  <ShieldAlert className="w-5 h-5 text-saffron-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-saffron-200 block">
                      Screening Question (Clinical Liability Guardrail)
                    </span>
                    <p className="text-[11px] text-gray-700 leading-relaxed mt-0.5">
                      Any medical conditions (diabetes, PCOS, thyroid) or eating concerns?
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="radio"
                      name="medCondition"
                      checked={formData.hasMedicalCondition === false}
                      onChange={() => setFormData({ ...formData, hasMedicalCondition: false })}
                      className="text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span>No, none</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-saffron-300">
                    <input
                      type="radio"
                      name="medCondition"
                      checked={formData.hasMedicalCondition === true}
                      onChange={() => setFormData({ ...formData, hasMedicalCondition: true })}
                      className="text-saffron-500 focus:ring-saffron-500"
                    />
                    <span>Yes, switch to balanced guidance</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review Calculated Plan */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-terracotta-900 to-obsidian-950 text-gray-900 p-5 rounded-3xl border border-terracotta-700/40 shadow-glow-terracotta">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-terracotta-300 font-bold">
                      Daily Energy Target
                    </span>
                    <div className="text-4xl font-display font-black text-gray-900 mt-0.5">
                      {previewProfile.targetCalories} <span className="text-xs font-normal text-terracotta-200">kcal/day</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400">Formula</span>
                    <div className="text-xs font-bold text-saffron-300">Mifflin-St Jeor</div>
                  </div>
                </div>

                {/* Macro Distribution */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-200 text-center">
                  <div className="bg-black/20 rounded-2xl p-2.5">
                    <div className="text-[9px] text-saffron-400 font-bold uppercase">Protein</div>
                    <div className="text-base font-display font-black text-gray-900">{previewProfile.targetProteinG}g</div>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-2.5">
                    <div className="text-[9px] text-gray-400 font-bold uppercase">Carbs</div>
                    <div className="text-base font-display font-black text-gray-900">{previewProfile.targetCarbsG}g</div>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-2.5">
                    <div className="text-[9px] text-gray-400 font-bold uppercase">Fats</div>
                    <div className="text-base font-display font-black text-gray-900">{previewProfile.targetFatG}g</div>
                  </div>
                </div>
              </div>

              {/* Guardrails check */}
              {previewProfile.calorieFloorTriggered && (
                <div className="bg-saffron-950/60 border border-saffron-500/40 text-saffron-200 p-3 rounded-2xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-saffron-400 shrink-0" />
                  <span>
                    <strong>Calorie Floor Guardrail:</strong> Clamped to safe minimum (1200+ kcal) to protect health.
                  </span>
                </div>
              )}

              <div className="bg-obsidian-950 p-3.5 rounded-2xl border border-gray-150 space-y-1.5 text-gray-400">
                <div className="flex justify-between">
                  <span>Basal Metabolic Rate (BMR):</span>
                  <strong className="text-gray-900">{previewProfile.bmr} kcal</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Daily Expenditure (TDEE):</span>
                  <strong className="text-gray-900">{previewProfile.tdee} kcal</strong>
                </div>
                <div className="flex justify-between">
                  <span>Diet Preference:</span>
                  <strong className="text-gray-900 uppercase">{previewProfile.dietPreference}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Enrolled Mess:</span>
                  <strong className="text-gray-900">
                    {previewProfile.messType === 'special'
                      ? '⭐ Special Mess'
                      : previewProfile.messType === 'veg'
                      ? '🟢 Veg Mess'
                      : '🍗 Non-Veg Mess'}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-gray-150 flex items-center justify-between bg-obsidian-950/60">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center space-x-1 px-5 py-2.5 rounded-xl bg-[#E04F16] text-white font-bold text-xs hover:bg-terracotta-500 shadow-glow-terracotta transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-terracotta-600 to-saffron-600 text-gray-900 font-bold text-xs hover:opacity-95 shadow-glow-terracotta transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Activate Personalized Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
