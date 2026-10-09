'use client';

import React, { useState, useEffect } from 'react';
import { Utensils, Calendar, PlusCircle, User, ArrowLeft } from 'lucide-react';
import { UserProfile, DailyMenuDay, StudentAccount, MessType, DailyTrackingSummary } from '@/lib/types';
import {
  DEFAULT_PROFILE,
  getStoredProfile,
  saveStoredProfile,
  getMonthlyMenu,
  calculateStreak,
  getDaySummary,
  getTodayDateStr,
} from '@/lib/storage';
import { supabase, signOutStudent, upsertStudentProfile, fetchStudentProfile } from '@/lib/supabaseClient';
import { Header } from '@/components/Header';
import { StitchDashboard } from '@/components/StitchDashboard';
import { TodayPlanView } from '@/components/TodayPlanView';
import { MonthlyPlanView } from '@/components/MonthlyPlanView';
import { FoodCourtLogger } from '@/components/FoodCourtLogger';
import { DailyTracker } from '@/components/DailyTracker';
import { ProfilePageView } from '@/components/ProfilePageView';
import { AuthPageView } from '@/components/AuthPageView';

const BurgerIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 11h16a1 1 0 0 0 .8-1.6C19.7 7.7 16.2 5 12 5S4.3 7.7 3.2 9.4A1 1 0 0 0 4 11z" />
    <path d="M4 15h16" />
    <path d="M5 19h14a2 2 0 0 0 2-2H3a2 2 0 0 0 2 2z" />
  </svg>
);

type MainTab = 'home' | 'dining' | 'log' | 'monthly' | 'tracker' | 'profile';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [student, setStudent] = useState<StudentAccount | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [monthlyMenu, setMonthlyMenu] = useState<DailyMenuDay[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [streakCount, setStreakCount] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [todaySummary, setTodaySummary] = useState<DailyTrackingSummary>(() =>
    getDaySummary(getTodayDateStr(), DEFAULT_PROFILE)
  );

  useEffect(() => {
    setIsClient(true);

    // Initialize menu, streak, and calendar day immediately
    const existingProfile = getStoredProfile();
    const initMess = existingProfile?.messType || 'non-veg';
    const menu = getMonthlyMenu(initMess);
    setMonthlyMenu(menu);

    const { currentStreak } = calculateStreak();
    setStreakCount(currentStreak);

    const day = Math.min(30, Math.max(1, new Date().getDate()));
    setSelectedDayNumber(day);

    if (existingProfile) {
      setProfile(existingProfile);
      setTodaySummary(getDaySummary(getTodayDateStr(), existingProfile));
    }

    // 1. Check local session cache for fast load
    try {
      const cachedStudent = localStorage.getItem('mess_mate_auth_student');
      if (cachedStudent) {
        const parsed: StudentAccount = JSON.parse(cachedStudent);
        setStudent(parsed);
      }
    } catch (e) {}

    // 2. Handle PKCE auth code exchange if student clicked verification link from email
    if (typeof window !== 'undefined' && supabase) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          if (!error && data?.session) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        });
      }
    }

    // 3. Supabase auth state listener
    let authSubscription: { unsubscribe: () => void } | null = null;

    if (supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const domain = session.user.email?.split('@')[1] || 'vitapstudent.ac.in';
          const { onboardingCompleted, profile: dbProfile } = await fetchStudentProfile(session.user.id, session.user.email);
          const isComplete = Boolean(onboardingCompleted && dbProfile && dbProfile.name && dbProfile.name.trim() !== '' && dbProfile.name !== 'Student');

          const activeStudent: StudentAccount = {
            id: session.user.id,
            email: session.user.email || '',
            collegeDomain: domain,
            onboardingCompleted: isComplete,
            profile: isComplete ? dbProfile : undefined,
          };
          setStudent(activeStudent);
          try {
            localStorage.setItem('mess_mate_auth_student', JSON.stringify(activeStudent));
          } catch (e) {}

          if (isComplete && dbProfile) {
            setProfile(dbProfile);
            const mType = dbProfile.messType || 'non-veg';
            setMonthlyMenu(getMonthlyMenu(mType));
            saveStoredProfile(dbProfile);
          }
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const domain = session.user.email?.split('@')[1] || 'vitapstudent.ac.in';
          const { onboardingCompleted, profile: dbProfile } = await fetchStudentProfile(session.user.id, session.user.email);
          const isComplete = Boolean(onboardingCompleted && dbProfile && dbProfile.name && dbProfile.name.trim() !== '' && dbProfile.name !== 'Student');
          const activeStudent: StudentAccount = {
            id: session.user.id,
            email: session.user.email || '',
            collegeDomain: domain,
            onboardingCompleted: isComplete,
            profile: isComplete ? dbProfile : undefined,
          };
          setStudent(activeStudent);
          try {
            localStorage.setItem('mess_mate_auth_student', JSON.stringify(activeStudent));
          } catch (e) {}

          if (isComplete && dbProfile) {
            setProfile(dbProfile);
            const mType = dbProfile.messType || 'non-veg';
            setMonthlyMenu(getMonthlyMenu(mType));
            saveStoredProfile(dbProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          setStudent(null);
          try {
            localStorage.removeItem('mess_mate_auth_student');
            localStorage.removeItem('mess_mate_profile');
          } catch (e) {}
        }
      });

      authSubscription = authListener?.subscription || null;
    }

    const handleLogsUpdated = () => {
      const p = getStoredProfile() || DEFAULT_PROFILE;
      setTodaySummary(getDaySummary(getTodayDateStr(), p));
      const { currentStreak } = calculateStreak();
      setStreakCount(currentStreak);
    };

    window.addEventListener('mess_mate_logs_updated', handleLogsUpdated);
    window.addEventListener('storage', handleLogsUpdated);

    return () => {
      authSubscription?.unsubscribe();
      window.removeEventListener('mess_mate_logs_updated', handleLogsUpdated);
      window.removeEventListener('storage', handleLogsUpdated);
    };
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handleAuthSuccess = async (authenticatedStudent: StudentAccount, isNewStudent: boolean) => {
    // Verify DB status
    const { onboardingCompleted, profile: dbProfile } = await fetchStudentProfile(
      authenticatedStudent.id,
      authenticatedStudent.email
    );
    const isComplete = Boolean(
      !isNewStudent &&
      onboardingCompleted &&
      dbProfile &&
      dbProfile.name &&
      dbProfile.name.trim() !== '' &&
      dbProfile.name !== 'Student'
    );

    const activeStudent: StudentAccount = {
      ...authenticatedStudent,
      onboardingCompleted: isComplete,
      profile: isComplete ? dbProfile : undefined,
    };

    setStudent(activeStudent);
    try {
      localStorage.setItem('mess_mate_auth_student', JSON.stringify(activeStudent));
    } catch (e) {}

    if (isNewStudent || !isComplete || !dbProfile) {
      try {
        localStorage.removeItem('mess_mate_profile');
      } catch (e) {}
      setProfile({
        ...DEFAULT_PROFILE,
        name: '',
      });
      setActiveTab('profile');
    } else {
      setProfile(dbProfile);
      const mType = dbProfile.messType || 'non-veg';
      setMonthlyMenu(getMonthlyMenu(mType));
      saveStoredProfile(dbProfile);
      setActiveTab('home');
    }
  };

  const handleSignOut = async () => {
    await signOutStudent();
    setStudent(null);
    try {
      localStorage.removeItem('mess_mate_auth_student');
      localStorage.removeItem('mess_mate_profile');
    } catch (e) {}
  };

  const handleProfileSave = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
    const mType = newProfile.messType || 'non-veg';
    setMonthlyMenu(getMonthlyMenu(mType));
    setTodaySummary(getDaySummary(getTodayDateStr(), newProfile));
    setActiveTab('home');

    if (student) {
      const updatedStudent: StudentAccount = {
        ...student,
        onboardingCompleted: true,
        profile: newProfile,
      };
      setStudent(updatedStudent);
      try {
        localStorage.setItem('mess_mate_auth_student', JSON.stringify(updatedStudent));
      } catch (e) {}

      // Sync to Supabase public.students table
      await upsertStudentProfile(newProfile, student.id, student.email);
    }
  };

  const handleRefreshData = () => {
    const menu = getMonthlyMenu(profile.messType || 'non-veg');
    setMonthlyMenu(menu);
    const { currentStreak } = calculateStreak();
    setStreakCount(currentStreak);
    setTodaySummary(getDaySummary(getTodayDateStr(), profile));
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8FB]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E04F16] flex items-center justify-center text-white text-2xl animate-pulse shadow-md">
            🍲
          </div>
          <span className="text-xs font-bold text-gray-500 font-sans">Loading Mess Mate...</span>
        </div>
      </div>
    );
  }

  // 1. Mandatory Sign In / Sign Up full-page view if student is not authenticated
  if (!student) {
    return <AuthPageView onAuthSuccess={handleAuthSuccess} />;
  }

  // 2. Full-page Profile onboarding if student has not completed biomarker setup
  if (!student.onboardingCompleted) {
    return (
      <ProfilePageView
        profile={profile}
        student={student}
        onSaveProfile={handleProfileSave}
        onSignOut={handleSignOut}
        onBackToHome={() => setActiveTab('home')}
      />
    );
  }

  const currentDayMenu =
    monthlyMenu.find((d) => d.dayNumber === selectedDayNumber) || monthlyMenu[0] || {
      dayNumber: 1,
      dayOfWeek: 'Monday',
      slots: { breakfast: [], lunch: [], snacks: [], dinner: [] },
    };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#143026] flex flex-col justify-between selection:bg-[#1B5E4A] selection:text-white transition-colors duration-200 font-sans">
      {/* Top Header matching Google Stitch reference */}
      <Header
        profile={profile}
        currentStreak={streakCount}
        isDark={isDark}
        todayCalories={todaySummary.caloriesConsumed}
        targetCalories={profile.targetCalories || 2100}
        studentEmail={student?.email}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenPlan={() => setActiveTab('log')}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="max-w-md mx-auto w-full px-4 pt-1 flex-1 pb-4">
        {/* Tab 1: Stitch Home Dashboard (Clean meal information) */}
        {activeTab === 'home' && (
          <StitchDashboard
            profile={profile}
            studentEmail={student?.email}
            currentDayMenu={currentDayMenu}
            todaySummary={todaySummary}
            streakCount={streakCount}
            onOpenViewPlan={() => setActiveTab('log')}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenLogMeal={() => setActiveTab('log')}
            onOpenProfile={() => setActiveTab('profile')}
          />
        )}

        {/* Back header for sub-views */}
        {activeTab !== 'home' && activeTab !== 'profile' && (
          <div className="mb-3.5 flex items-center justify-between pt-1">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-1.5 text-xs font-bold text-[#143026] hover:text-[#004534] bg-white border border-[#A9BFB5]/30 px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#1B5E4A]" />
              <span>Back to Home</span>
            </button>
            <span className="text-xs font-bold text-[#5F7A6E] uppercase tracking-wider">
              {activeTab === 'dining' ? 'Food Court' : activeTab === 'log' ? "Today's Plan" : activeTab === 'monthly' ? '30-Day Plan' : 'Habit Tracker'}
            </span>
          </div>
        )}

        {/* Tab 2: Today's Plan */}
        {activeTab === 'log' && (
          <TodayPlanView
            currentDayMenu={currentDayMenu}
            profile={profile}
            onMealLogged={handleRefreshData}
            isDark={isDark}
            onOpenProfile={() => setActiveTab('profile')}
          />
        )}

        {/* Tab 3: 30-Day Plan */}
        {activeTab === 'monthly' && (
          <MonthlyPlanView
            monthlyMenu={monthlyMenu}
            profile={profile}
            selectedDayNumber={selectedDayNumber}
            onOpenProfile={() => setActiveTab('profile')}
            onSelectDay={(dayNum) => {
              setSelectedDayNumber(dayNum);
              setActiveTab('log');
            }}
          />
        )}

        {/* Tab 4: Food Court Logger */}
        {activeTab === 'dining' && (
          <FoodCourtLogger profile={profile} onLogUpdated={handleRefreshData} />
        )}

        {/* Tab 5: Habit Tracker */}
        {activeTab === 'tracker' && <DailyTracker profile={profile} />}

        {/* Tab 6: Full-Page Profile & Biomarkers View */}
        {activeTab === 'profile' && (
          <ProfilePageView
            profile={profile}
            student={student}
            onSaveProfile={handleProfileSave}
            onSignOut={handleSignOut}
            onBackToHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Sticky Bottom Navigation Bar (Stitch Botanical Modern) */}
      <nav className="sticky bottom-0 z-40 bg-[#FBF9F4]/90 backdrop-blur-xl border-t border-[#A9BFB5]/30 px-3 py-2 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Tab 1: Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#D6E6DC] text-[#1B5E4A] px-4 py-1.5 rounded-full flex flex-col items-center justify-center font-bold text-[10px] shadow-xs'
                : 'text-[#5F7A6E] hover:text-[#143026] flex flex-col items-center justify-center py-1 px-2.5 text-[10px] font-semibold'
            }`}
          >
            <Utensils className={`w-4 h-4 mb-0.5 ${activeTab === 'home' ? 'text-[#1B5E4A]' : 'text-[#5F7A6E]'}`} />
            <span>Home</span>
          </button>

          {/* Tab 2: Dining */}
          <button
            onClick={() => setActiveTab('dining')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'dining'
                ? 'bg-[#D6E6DC] text-[#1B5E4A] px-4 py-1.5 rounded-full flex flex-col items-center justify-center font-bold text-[10px] shadow-xs'
                : 'text-[#5F7A6E] hover:text-[#143026] flex flex-col items-center justify-center py-1 px-2.5 text-[10px] font-semibold'
            }`}
          >
            <BurgerIcon className={`w-4 h-4 mb-0.5 ${activeTab === 'dining' ? 'text-[#1B5E4A]' : 'text-[#5F7A6E]'}`} />
            <span>Dining</span>
          </button>

          {/* Tab 3: Today's Plan */}
          <button
            onClick={() => setActiveTab('log')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'log'
                ? 'bg-[#D6E6DC] text-[#1B5E4A] px-4 py-1.5 rounded-full flex flex-col items-center justify-center font-bold text-[10px] shadow-xs'
                : 'text-[#5F7A6E] hover:text-[#143026] flex flex-col items-center justify-center py-1 px-2.5 text-[10px] font-semibold'
            }`}
          >
            <PlusCircle className={`w-4 h-4 mb-0.5 ${activeTab === 'log' ? 'text-[#1B5E4A]' : 'text-[#5F7A6E]'}`} />
            <span>Plan</span>
          </button>

          {/* Tab 4: Monthly */}
          <button
            onClick={() => setActiveTab('monthly')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-[#D6E6DC] text-[#1B5E4A] px-4 py-1.5 rounded-full flex flex-col items-center justify-center font-bold text-[10px] shadow-xs'
                : 'text-[#5F7A6E] hover:text-[#143026] flex flex-col items-center justify-center py-1 px-2.5 text-[10px] font-semibold'
            }`}
          >
            <Calendar className={`w-4 h-4 mb-0.5 ${activeTab === 'monthly' ? 'text-[#1B5E4A]' : 'text-[#5F7A6E]'}`} />
            <span>Weekly</span>
          </button>

          {/* Tab 5: Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#D6E6DC] text-[#1B5E4A] px-4 py-1.5 rounded-full flex flex-col items-center justify-center font-bold text-[10px] shadow-xs'
                : 'text-[#5F7A6E] hover:text-[#143026] flex flex-col items-center justify-center py-1 px-2.5 text-[10px] font-semibold'
            }`}
          >
            <User className={`w-4 h-4 mb-0.5 ${activeTab === 'profile' ? 'text-[#1B5E4A]' : 'text-[#5F7A6E]'}`} />
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
