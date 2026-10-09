'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Leaf,
  Clock,
  Check,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { StudentAccount } from '@/lib/types';
import {
  isAllowedCollegeEmail,
  sendCollegeOtp,
  verifyCollegeOtp,
  signInStudentWithPassword,
  getAllowedCollegeDomains,
} from '@/lib/supabaseClient';

interface AuthPageViewProps {
  onAuthSuccess: (student: StudentAccount, isNewStudent: boolean) => void;
}

type MainAuthTab = 'signin' | 'signup';
type SignInMethod = 'otp' | 'password';
type OtpStep = 'email' | 'otp';

export const AuthPageView: React.FC<AuthPageViewProps> = ({ onAuthSuccess }) => {
  const [mainTab, setMainTab] = useState<MainAuthTab>('signin');
  const [signInMethod, setSignInMethod] = useState<SignInMethod>('otp');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);

  // OTP flow step
  const [otpStep, setOtpStep] = useState<OtpStep>('email');

  // Status and feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [accountExistsAlert, setAccountExistsAlert] = useState(false);
  const [accountNotFoundAlert, setAccountNotFoundAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0);

  const allowedDomains = getAllowedCollegeDomains();
  const trimmedEmail = email.trim().toLowerCase();
  const emailValidation = isAllowedCollegeEmail(trimmedEmail);

  // Countdown timer effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setAccountExistsAlert(false);
    setAccountNotFoundAlert(false);
  };

  const handleTabSwitch = (tab: MainAuthTab) => {
    setMainTab(tab);
    setOtpStep('email');
    setOtpDigits(['', '', '', '', '', '']);
    resetMessages();
  };

  // OTP digit handling
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto focus next
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // 1. Send OTP (Sign Up or Sign In)
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    resetMessages();

    if (!trimmedEmail) {
      setErrorMessage('Please enter your student email address.');
      return;
    }

    if (!emailValidation.valid) {
      setErrorMessage(emailValidation.reason || 'Please enter an official college email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const mode = mainTab === 'signup' ? 'signup' : 'signin';
      const result = await sendCollegeOtp(trimmedEmail, mode);

      if (result.accountExists) {
        setAccountExistsAlert(true);
        setErrorMessage(result.error || 'Account already exists! An account with this college email is already registered. Please switch to Sign In.');
        return;
      }

      if (result.accountNotFound) {
        setAccountNotFoundAlert(true);
        setErrorMessage(result.error || 'No account found with this email. Please switch to Sign Up to create your account.');
        return;
      }

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to send verification code. Please try again.');
        return;
      }

      setOtpStep('otp');
      setResendCooldown(60);
      setSuccessMessage(`A 6-digit verification code was sent to ${trimmedEmail}.`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    resetMessages();

    const fullCode = otpDigits.join('').trim();
    if (fullCode.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await verifyCollegeOtp(trimmedEmail, fullCode);
      if (!result.success || !result.student) {
        setErrorMessage(result.error || 'Invalid verification code. Please check and re-enter.');
        return;
      }

      const verified = result.student;
      const isNew = mainTab === 'signup' || !verified.onboardingCompleted;

      try {
        localStorage.setItem('mess_mate_auth_student', JSON.stringify(verified));
      } catch (e) {}

      setSuccessMessage('Email verified successfully! Welcome to Mess Mate.');
      onAuthSuccess(verified, isNew);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!trimmedEmail) {
      setErrorMessage('Please enter your college email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signInStudentWithPassword(trimmedEmail, password);
      if (!result.success || !result.student) {
        if (result.error && result.error.includes('No account registered')) {
          setAccountNotFoundAlert(true);
        }
        setErrorMessage(result.error || 'Incorrect email or password. Please try again.');
        return;
      }

      const loggedInStudent = result.student;
      try {
        localStorage.setItem('mess_mate_auth_student', JSON.stringify(loggedInStudent));
      } catch (e) {}

      onAuthSuccess(loggedInStudent, !loggedInStudent.onboardingCompleted);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fast Guest Login for Instant Demo Testing
  const handleGuestLogin = () => {
    const guestStudent: StudentAccount = {
      id: 'guest_student_demo',
      email: 'aditi.22bce8921@vitapstudent.ac.in',
      collegeDomain: 'vitapstudent.ac.in',
      onboardingCompleted: true,
      profile: {
        id: 'guest_student_demo',
        name: 'Aditi Rao',
        hostelBlock: 'Block-B',
        age: 20,
        gender: 'female',
        heightCm: 165,
        weightKg: 58,
        activityLevel: 'moderately_active',
        goal: 'fitness',
        dietPreference: 'non-veg',
        messType: 'non-veg',
        allergies: [],
        dislikedDishIds: [],
        hasMedicalCondition: false,
        bmr: 1380,
        tdee: 2139,
        targetCalories: 2100,
        targetProteinG: 110,
        targetCarbsG: 240,
        targetFatG: 65,
        bmi: 21.3,
        isExtremeBmi: false,
        calorieFloorTriggered: false,
        isLiabilityGuardrailActive: false,
      },
    };
    try {
      localStorage.setItem('mess_mate_auth_student', JSON.stringify(guestStudent));
    } catch (e) {}
    onAuthSuccess(guestStudent, false);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#143026] flex flex-col justify-start items-center font-sans">
      <div className="w-full max-w-md flex flex-col">
        {/* ========================================================= */}
        {/* 1. TOP ARCHITECTURAL CANOPY HEADER                        */}
        {/* ========================================================= */}
        <div className="w-full bg-[#1B5E4A] rounded-b-[36px] pt-8 pb-10 px-6 flex flex-col items-center text-center shadow-md relative overflow-hidden">
          {/* Subtle organic background embellishment */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#004534] opacity-40 pointer-events-none" />
          <div className="absolute -bottom-16 -left-12 w-44 h-44 rounded-full bg-[#284237] opacity-30 pointer-events-none" />

          {/* Campus Wellness Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6E6DC] text-[#1B5E4A] mb-3 shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-[#1B5E4A]" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#1B5E4A]">
              VIT-AP Campus Nutrition
            </span>
          </div>

          {/* Prominent App Logo Showcase */}
          <div className="relative my-2 flex flex-col items-center group">
            <div className="relative w-56 sm:w-64 max-w-[280px] bg-white rounded-3xl p-3 shadow-xl border-2 border-white/90 ring-4 ring-[#AEF0D6]/20 transition-all duration-300 hover:scale-[1.03]">
              <img
                src="/logo.png"
                alt="Mess Mate Logo"
                className="w-full h-auto object-contain drop-shadow-sm select-none"
              />
            </div>
            {/* Subtle glow underneath */}
            <div className="absolute -inset-1 bg-emerald-400/25 blur-xl rounded-full -z-10" />
          </div>

          {/* Watch Starting Animation Action Pill */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('replay_starting_animation'))}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Watch the starting animation for this logo"
          >
            <span className="animate-pulse">✨</span>
            <span>Watch Starting Animation</span>
          </button>

          {/* Brand Titles */}
          <h1 className="text-2xl font-black text-white tracking-tight mt-3 mb-1">
            Mess Mate
          </h1>
          <p className="text-xs text-[#AEF0D6] max-w-[270px] leading-relaxed font-medium">
            Eat smart at your university mess &amp; food court
          </p>
        </div>

        {/* ========================================================= */}
        {/* 2. MAIN BODY CARD FLOATING INSET                          */}
        {/* ========================================================= */}
        <div className="px-4 -mt-5 z-10 w-full flex flex-col gap-4">
          <div className="w-full bg-white rounded-3xl shadow-[0_8px_24px_rgba(20,48,38,0.08)] p-6 flex flex-col border border-[#A9BFB5]/25">
            {/* Primary Segmented Switch: Sign In vs Sign Up */}
            <div className="w-full bg-[#F5F3EE] p-1 rounded-full flex items-center mb-5 border border-[#A9BFB5]/20">
              <button
                type="button"
                onClick={() => handleTabSwitch('signin')}
                className={`flex-1 py-2 rounded-full text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mainTab === 'signin'
                    ? 'bg-[#1B5E4A] text-white shadow-xs'
                    : 'text-[#5F7A6E] hover:text-[#143026]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('signup')}
                className={`flex-1 py-2 rounded-full text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mainTab === 'signup'
                    ? 'bg-[#1B5E4A] text-white shadow-xs'
                    : 'text-[#5F7A6E] hover:text-[#143026]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Account Already Exists Banner Action */}
            {accountExistsAlert && (
              <div className="p-3.5 mb-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex flex-col gap-2 shadow-xs">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    An account with this college email already exists. Please switch to Sign In.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('signin')}
                  className="self-start text-[11px] font-bold bg-[#1B5E4A] text-white px-3 py-1.5 rounded-full hover:bg-[#004534] transition-all cursor-pointer"
                >
                  Switch to Sign In →
                </button>
              </div>
            )}

            {/* Account Not Found Banner Action */}
            {accountNotFoundAlert && (
              <div className="p-3.5 mb-4 rounded-2xl bg-blue-50 border border-blue-300 text-blue-900 text-xs font-semibold flex flex-col gap-2 shadow-xs">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    No student account found for this email. Please create your account first.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('signup')}
                  className="self-start text-[11px] font-bold bg-[#1B5E4A] text-white px-3 py-1.5 rounded-full hover:bg-[#004534] transition-all cursor-pointer"
                >
                  Switch to Sign Up →
                </button>
              </div>
            )}

            {/* Standard Error / Success Alerts */}
            {errorMessage && !accountExistsAlert && !accountNotFoundAlert && (
              <div className="p-3 mb-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 mb-4 rounded-2xl bg-[#D8E8DE] border border-[#1B5E4A]/30 text-[#1B5E4A] text-xs font-semibold flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#1B5E4A] shrink-0 mt-0.5" />
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            {/* =================================================== */}
            {/* VIEW A: SIGN IN (RETURNING STUDENT)                */}
            {/* =================================================== */}
            {mainTab === 'signin' && (
              <div className="flex flex-col gap-4">
                {/* Method Switcher inside Sign In */}
                <div className="flex items-center justify-between text-xs pb-1 border-b border-gray-100 mb-1">
                  <span className="font-bold text-[#143026]">Sign In Method:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSignInMethod('otp');
                        setOtpStep('email');
                        resetMessages();
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        signInMethod === 'otp'
                          ? 'bg-[#D6E6DC] text-[#1B5E4A]'
                          : 'text-[#5F7A6E] hover:text-[#143026]'
                      }`}
                    >
                      Email OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInMethod('password');
                        resetMessages();
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        signInMethod === 'password'
                          ? 'bg-[#D6E6DC] text-[#1B5E4A]'
                          : 'text-[#5F7A6E] hover:text-[#143026]'
                      }`}
                    >
                      Password
                    </button>
                  </div>
                </div>

                {signInMethod === 'otp' ? (
                  otpStep === 'email' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#143026]">
                          Student College Email
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-4 text-[#1B5E4A] w-4 h-4 pointer-events-none" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student.22bce0000@vitapstudent.ac.in"
                            className="w-full h-[50px] pl-11 pr-4 bg-[#F5F3EE] text-[#143026] rounded-full text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B5E4A] transition-all border border-[#A9BFB5]/20"
                            required
                          />
                        </div>
                        <p className="text-[11px] text-[#5F7A6E] px-2">
                          We will send a 6-digit login code to your university inbox.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-[50px] rounded-full bg-[#1B5E4A] hover:bg-[#004534] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                      >
                        <span>{isSubmitting ? 'Sending Code...' : 'Send Sign-In Code'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#143026]">
                            Enter 6-Digit Code
                          </span>
                          <span className="text-[10px] font-bold text-[#1B5E4A]">
                            Sent to inbox
                          </span>
                        </div>

                        {/* 6-Box Numeric OTP Input */}
                        <div className="grid grid-cols-6 gap-2 w-full">
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-input-${idx}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-full h-12 rounded-xl bg-[#F5F3EE] text-center font-bold text-base text-[#1B5E4A] focus:bg-[#D6E6DC] focus:outline-none shadow-xs transition-all border border-[#A9BFB5]/20"
                            />
                          ))}
                        </div>

                        {/* Resend Countdown */}
                        <div className="flex items-center justify-between pt-1 px-1">
                          <div className="flex items-center gap-1 text-[#5F7A6E]">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[11px]">
                              {resendCooldown > 0 ? (
                                <>Resend in <strong className="text-[#143026] font-bold">00:{resendCooldown.toString().padStart(2, '0')}</strong></>
                              ) : (
                                'Code expired'
                              )}
                            </span>
                          </div>
                          <button
                            type="button"
                            disabled={resendCooldown > 0}
                            onClick={() => handleSendOtp()}
                            className={`text-xs font-bold transition-all cursor-pointer ${
                              resendCooldown > 0 ? 'text-[#5F7A6E] opacity-50' : 'text-[#1B5E4A] hover:underline'
                            }`}
                          >
                            Resend Code
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-[50px] rounded-full bg-[#1B5E4A] hover:bg-[#004534] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                      >
                        <span>{isSubmitting ? 'Signing In...' : 'Verify & Enter Campus Mess'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )
                ) : (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#143026]">
                        College Email
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 text-[#1B5E4A] w-4 h-4 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student.22bce0000@vitapstudent.ac.in"
                          className="w-full h-[50px] pl-11 pr-4 bg-[#F5F3EE] text-[#143026] rounded-full text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B5E4A] transition-all border border-[#A9BFB5]/20"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#143026]">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 text-[#1B5E4A] w-4 h-4 pointer-events-none" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full h-[50px] pl-11 pr-4 bg-[#F5F3EE] text-[#143026] rounded-full text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B5E4A] transition-all border border-[#A9BFB5]/20"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[50px] rounded-full bg-[#1B5E4A] hover:bg-[#004534] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                    >
                      <span>{isSubmitting ? 'Signing In...' : 'Sign In with Password'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center text-xs text-[#5F7A6E]">
                  New to Mess Mate?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('signup')}
                    className="font-bold text-[#1B5E4A] hover:underline cursor-pointer"
                  >
                    Create student account →
                  </button>
                </div>
              </div>
            )}

            {/* =================================================== */}
            {/* VIEW B: SIGN UP (NEW STUDENT REGISTRATION)         */}
            {/* =================================================== */}
            {mainTab === 'signup' && (
              <div className="flex flex-col gap-4">
                <div className="text-left pb-1 border-b border-gray-100">
                  <h2 className="text-xs font-extrabold text-[#143026]">
                    New Student Registration
                  </h2>
                  <p className="text-[11px] text-[#5F7A6E]">
                    Verify your official email. In the next step, you will set up your name, hostel, and mess contract.
                  </p>
                </div>

                {otpStep === 'email' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#143026]">
                          Student College Email
                        </label>
                        <span className="inline-flex items-center gap-1 text-[#1B5E4A] text-[10px] font-bold">
                          <Check className="w-3 h-3 text-[#1B5E4A]" /> VIT-AP Required
                        </span>
                      </div>

                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 text-[#1B5E4A] w-4 h-4 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student.22bce0000@vitapstudent.ac.in"
                          className="w-full h-[50px] pl-11 pr-4 bg-[#F5F3EE] text-[#143026] rounded-full text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B5E4A] transition-all border border-[#A9BFB5]/20"
                          required
                        />
                      </div>
                      <p className="text-[11px] text-[#5F7A6E] px-2">
                        Enter your official <span className="font-bold text-[#143026]">@vitapstudent.ac.in</span> address
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[50px] rounded-full bg-[#1B5E4A] hover:bg-[#004534] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                    >
                      <span>{isSubmitting ? 'Checking & Sending...' : 'Send Registration Code'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#143026]">
                          Enter 6-Digit Registration Code
                        </span>
                        <span className="text-[10px] font-bold text-[#1B5E4A] uppercase tracking-wider">
                          Step 1 of 2
                        </span>
                      </div>

                      {/* 6-Box Numeric OTP Input */}
                      <div className="grid grid-cols-6 gap-2 w-full">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-full h-12 rounded-xl bg-[#F5F3EE] text-center font-bold text-base text-[#1B5E4A] focus:bg-[#D6E6DC] focus:outline-none shadow-xs transition-all border border-[#A9BFB5]/20"
                          />
                        ))}
                      </div>

                      {/* Resend Countdown */}
                      <div className="flex items-center justify-between pt-1 px-1">
                        <div className="flex items-center gap-1 text-[#5F7A6E]">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[11px]">
                            {resendCooldown > 0 ? (
                              <>Resend in <strong className="text-[#143026] font-bold">00:{resendCooldown.toString().padStart(2, '0')}</strong></>
                            ) : (
                              'Code expired'
                            )}
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={resendCooldown > 0}
                          onClick={() => handleSendOtp()}
                          className={`text-xs font-bold transition-all cursor-pointer ${
                            resendCooldown > 0 ? 'text-[#5F7A6E] opacity-50' : 'text-[#1B5E4A] hover:underline'
                          }`}
                        >
                          Resend Code
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[50px] rounded-full bg-[#1B5E4A] hover:bg-[#004534] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                    >
                      <span>{isSubmitting ? 'Verifying...' : 'Verify & Set Up Profile →'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center text-xs text-[#5F7A6E]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('signin')}
                    className="font-bold text-[#1B5E4A] hover:underline cursor-pointer"
                  >
                    Sign in here →
                  </button>
                </div>
              </div>
            )}

            {/* Quick Demo Access Button */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[#5F7A6E]">Instant Preview:</span>
              <button
                type="button"
                onClick={handleGuestLogin}
                className="text-xs font-bold text-[#1B5E4A] hover:underline cursor-pointer"
              >
                Continue as Aditi (Demo) →
              </button>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="text-center pt-1 px-4 flex flex-col items-center gap-1">
            <p className="text-[11px] text-[#5F7A6E] leading-snug">
              By continuing, you agree to the <br />
              <span className="text-[#1B5E4A] font-semibold">VIT-AP Student Dining Portal Terms</span>
            </p>
            <span className="text-[10px] text-[#5F7A6E]">Version 2.4.2 (Campus Live)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
