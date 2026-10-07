'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  CheckCircle,
  GraduationCap,
  Eye,
  EyeOff,
  KeyRound,
  X,
} from 'lucide-react';
import { AuthStep, StudentAccount } from '@/lib/types';
import {
  isAllowedCollegeEmail,
  sendCollegeOtp,
  verifyCollegeOtp,
  signInStudentWithPassword,
  setStudentPassword,
  sendPasswordResetEmail,
  getAllowedCollegeDomains,
  supabase,
} from '@/lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  initialStep?: AuthStep;
  studentEmail?: string;
  onAuthSuccess: (student: StudentAccount, isNewStudent: boolean) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialStep,
  studentEmail,
  onAuthSuccess,
  onClose,
}) => {
  // Default to 'login' for returning students or requested initialStep
  const [step, setStep] = useState<AuthStep>(initialStep || 'login');
  const [email, setEmail] = useState(studentEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 8 digit slots to seamlessly handle both 6-digit and 8-digit Supabase OTPs
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Stored state during OTP-to-Password transition
  const [pendingStudent, setPendingStudent] = useState<{
    student: StudentAccount;
    isNewStudent: boolean;
  } | null>(null);

  const digitInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const autoVerifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const allowedDomains = getAllowedCollegeDomains();

  // Sync initialStep when changed from outside
  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    if (studentEmail && !email) {
      setEmail(studentEmail);
    }
  }, [studentEmail]);

  // 30-second resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Focus first OTP input when transitioning to 'signup_otp' screen
  useEffect(() => {
    if (step === 'signup_otp') {
      setTimeout(() => {
        digitInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen) return null;

  const trimmedEmail = email.trim().toLowerCase();
  const hasAt = trimmedEmail.includes('@');
  const validation = hasAt ? isAllowedCollegeEmail(trimmedEmail) : null;
  const isDomainInvalid = hasAt && validation && !validation.valid;

  // -------------------------------------------------------------
  // 1. Returning Student Login Handler (Email + Password)
  // -------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const check = isAllowedCollegeEmail(trimmedEmail);
    if (!check.valid) {
      setErrorMessage(check.reason || 'Please enter a valid college email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signInStudentWithPassword(trimmedEmail, password);
      if (!result.success || !result.student) {
        setErrorMessage(result.error || 'Invalid email or password.');
        setIsSubmitting(false);
        return;
      }

      onAuthSuccess(result.student, result.isNewStudent);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // 2. Sign-Up Send OTP Handler
  // -------------------------------------------------------------
  const handleSendSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const check = isAllowedCollegeEmail(trimmedEmail);
    if (!check.valid) {
      setErrorMessage(check.reason || 'Please enter a valid college email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendCollegeOtp(trimmedEmail);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to send verification code.');
        setIsSubmitting(false);
        return;
      }

      setStep('signup_otp');
      setResendCooldown(30);
      setOtpDigits(['', '', '', '', '', '', '', '']);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // 3. OTP Digit Entry & Verification (Supports 6 and 8 Digits)
  // -------------------------------------------------------------
  const handleDigitChange = (index: number, value: string) => {
    setErrorMessage(null);
    if (autoVerifyTimeoutRef.current) {
      clearTimeout(autoVerifyTimeoutRef.current);
    }

    // Support paste of entire 6-digit or 8-digit code
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 8).split('');
      if (cleanDigits.length >= 6) {
        const newDigits = ['', '', '', '', '', '', '', ''];
        cleanDigits.forEach((digit, i) => {
          if (i < 8) newDigits[i] = digit;
        });
        setOtpDigits(newDigits);

        const focusTarget = Math.min(cleanDigits.length, 7);
        digitInputsRef.current[focusTarget]?.focus();

        const fullCode = cleanDigits.join('');
        if (fullCode.length === 6 || fullCode.length === 8) {
          handleVerifySignupOtp(fullCode);
        }
        return;
      }
    }

    const singleDigit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = singleDigit;
    setOtpDigits(updated);

    if (singleDigit && index < 7) {
      digitInputsRef.current[index + 1]?.focus();
    }

    // Auto-verify when 8 digits filled
    const entered = updated.join('').trim();
    if (entered.length === 8) {
      handleVerifySignupOtp(entered);
    } else if (entered.length === 6 && index === 5) {
      // Auto-verify 6-digit code after 500ms debounce if no 7th digit typed
      autoVerifyTimeoutRef.current = setTimeout(() => {
        handleVerifySignupOtp(entered);
      }, 500);
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const code = otpDigits.join('').trim();
      if (code.length >= 6) {
        handleVerifySignupOtp(code);
      }
    }
  };

  const handleVerifySignupOtp = async (tokenString?: string) => {
    const code = (tokenString || otpDigits.join('')).trim();
    if (code.length < 6 || code.length > 8) {
      setErrorMessage('Please enter your 6 or 8-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await verifyCollegeOtp(trimmedEmail, code);
      if (!result.success || !result.student) {
        setErrorMessage(result.error || 'Invalid or expired code. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Keep active verified session and route to mandatory password creation
      setPendingStudent({
        student: result.student,
        isNewStudent: result.isNewStudent,
      });
      setPassword('');
      setConfirmPassword('');
      setStep('create_password');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await sendCollegeOtp(trimmedEmail);
      if (result.success) {
        setResendCooldown(30);
        setSuccessMessage('A new verification code has been sent to your college email!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(result.error || 'Failed to resend code.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error resending code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // 4. Create Password Handler (Immediate post-OTP step, non-skippable)
  // -------------------------------------------------------------
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    let activeStud = pendingStudent?.student;
    let isNew = pendingStudent?.isNewStudent ?? true;

    // Fallback: If session was restored via Supabase auth but password wasn't set yet
    if (!activeStud && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const domain = session.user.email?.split('@')[1] || 'vitapstudent.ac.in';
        activeStud = {
          id: session.user.id,
          email: session.user.email || trimmedEmail || email,
          collegeDomain: domain,
          onboardingCompleted: false,
        };
      }
    }

    if (!activeStud) {
      setErrorMessage('Session expired. Please enter your college email again.');
      setStep('signup_email');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await setStudentPassword(password);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to save password.');
        setIsSubmitting(false);
        return;
      }

      // Password successfully attached to verified account!
      onAuthSuccess(activeStud, isNew);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to attach password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // 5. Forgot Password Handler
  // -------------------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const check = isAllowedCollegeEmail(trimmedEmail);
    if (!check.valid) {
      setErrorMessage(check.reason || 'Please enter your registered college email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendPasswordResetEmail(trimmedEmail);
      if (result.success) {
        setSuccessMessage('Password reset link sent! Check your college inbox.');
      } else {
        setErrorMessage(result.error || 'Failed to send reset link.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error sending password reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const enteredOtpLength = otpDigits.join('').trim().length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-gray-900">
        {/* Ambient background accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-terracotta-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-saffron-500/15 blur-3xl pointer-events-none" />

        {/* Close button for guest browsing (not available during mandatory password creation) */}
        {onClose && step !== 'create_password' && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Browse as Guest"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-terracotta-500 to-saffron-500 text-white text-2xl shadow-glow-terracotta mb-3 select-none">
            🍲
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Mess Mate
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Campus Nutrition • Student Portal
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5 animate-shake">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Success Notice */}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-olive-900/50 border border-olive-500/30 text-olive-200 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-olive-400 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 1: RETURNING STUDENT LOGIN (DEFAULT) */}
        {/* ========================================================= */}
        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-saffron-400" />
                  <span>College Email</span>
                </label>
                <span className="text-[10px] font-bold text-terracotta-300 bg-terracotta-950/80 px-2 py-0.5 rounded-md border border-terracotta-800/60">
                  @{allowedDomains[0]}
                </span>
              </div>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 21bce1001@vitapstudent.ac.in"
                  required
                  autoFocus
                  disabled={isSubmitting}
                  className={`w-full bg-gray-50 border ${
                    isDomainInvalid
                      ? 'border-red-500/70 focus:ring-red-500/30'
                      : 'border-gray-200 focus:border-terracotta-500 focus:ring-terracotta-500/20'
                  } rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all`}
                />
                <div className="absolute right-3.5 top-3 text-gray-500 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
              </div>

              {isDomainInvalid && (
                <p className="mt-1.5 text-[11px] font-medium text-red-400">
                  ⚠️ Only college emails ending with @{allowedDomains.join(' or @')} are permitted.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-terracotta-400" />
                  <span>Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setStep('forgot_password');
                  }}
                  className="text-[11px] text-terracotta-400 hover:text-terracotta-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isDomainInvalid || !email.trim() || !password}
              className="w-full h-12 bg-terracotta-500 hover:bg-terracotta-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-terracotta"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch to Sign Up with OTP */}
            <div className="pt-2 text-center space-y-2.5 border-t border-gray-200 mt-5">
              <p className="text-xs text-gray-400">
                New student?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setStep('signup_email');
                  }}
                  className="text-terracotta-400 hover:text-terracotta-300 font-bold underline transition-colors"
                >
                  Sign up with College OTP →
                </button>
              </p>

              {onClose && (
                <div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-gray-400 hover:text-white underline font-medium transition-colors"
                  >
                    Skip for now & browse mess menu as guest
                  </button>
                </div>
              )}
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: SIGN-UP EMAIL (SEND OTP) */}
        {/* ========================================================= */}
        {step === 'signup_email' && (
          <form onSubmit={handleSendSignupOtp} className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('login');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <span className="text-[11px] font-bold text-saffron-400">Sign Up (Step 1 of 3)</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-saffron-400" />
                  <span>College Email Address</span>
                </label>
                <span className="text-[10px] font-bold text-terracotta-300 bg-terracotta-950/80 px-2 py-0.5 rounded-md border border-terracotta-800/60">
                  @{allowedDomains[0]}
                </span>
              </div>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 21bce1001@vitapstudent.ac.in"
                  required
                  autoFocus
                  disabled={isSubmitting}
                  className={`w-full bg-gray-50 border ${
                    isDomainInvalid
                      ? 'border-red-500/70 focus:ring-red-500/30'
                      : 'border-gray-200 focus:border-terracotta-500 focus:ring-terracotta-500/20'
                  } rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all`}
                />
                <div className="absolute right-3.5 top-3 text-gray-500 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
              </div>

              {isDomainInvalid && (
                <p className="mt-1.5 text-[11px] font-medium text-red-400">
                  ⚠️ Only college emails ending with @{allowedDomains.join(' or @')} are permitted.
                </p>
              )}

              {!hasAt && (
                <p className="mt-2 text-[11px] text-gray-400 leading-normal">
                  OTP is required once at sign-up. You'll set a password next for instant future logins.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isDomainInvalid || !email.trim()}
              className="w-full h-12 bg-terracotta-500 hover:bg-terracotta-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-terracotta"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setStep('login');
                  }}
                  className="text-terracotta-400 hover:text-terracotta-300 font-bold underline transition-colors"
                >
                  Sign in with password
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: SIGN-UP OTP VERIFICATION (SUPPORTS 6 & 8 DIGITS) */}
        {/* ========================================================= */}
        {step === 'signup_otp' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('signup_email');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change email</span>
              </button>
              <span className="text-[11px] font-bold text-saffron-400">Sign Up (Step 2 of 3)</span>
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">Enter Verification Code</h3>
              <p className="text-xs text-gray-400 mt-1">
                Sent to <span className="text-terracotta-300 font-semibold">{trimmedEmail}</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Type or paste your 6 or 8-digit OTP code below
              </p>
            </div>

            {/* 8 Discrete Digit Inputs (Accommodates both 6-digit & 8-digit codes) */}
            <div className="flex justify-center gap-1.5 sm:gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    digitInputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(index, e)}
                  disabled={isSubmitting}
                  className={`w-8 h-11 sm:w-10 sm:h-13 bg-gray-50 border ${
                    digit ? 'border-terracotta-500 ring-1 ring-terracotta-500/30' : 'border-white/15'
                  } focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30 rounded-xl text-center text-lg sm:text-xl font-mono font-black text-white focus:outline-none transition-all`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleVerifySignupOtp()}
              disabled={isSubmitting || enteredOtpLength < 6}
              className="w-full h-12 bg-terracotta-500 hover:bg-terracotta-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-terracotta"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verify Code ({enteredOtpLength} Digits) & Continue</span>
                </>
              )}
            </button>

            {/* Resend Code with 30s Cooldown */}
            <div className="text-center pt-1">
              {resendCooldown > 0 ? (
                <p className="text-xs text-gray-400">
                  Resend code in <span className="font-bold text-saffron-400">{resendCooldown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-xs text-terracotta-400 hover:text-terracotta-300 font-bold underline transition-colors"
                >
                  Didn't receive code? Resend
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: MANDATORY POST-OTP PASSWORD CREATION (NON-SKIPPABLE) */}
        {/* ========================================================= */}
        {step === 'create_password' && (
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-terracotta-500/20 text-terracotta-400 mb-2 border border-terracotta-500/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Create Your Password</h3>
              <p className="text-xs text-gray-400 mt-1">
                OTP verified! Set a password now so you can log in instantly next time without needing an email code.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                New Password (min 8 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="At least 8 characters"
                  required
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Re-enter password"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || password.length < 8 || password !== confirmPassword}
              className="w-full h-12 bg-terracotta-500 hover:bg-terracotta-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-terracotta mt-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Password...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Password & Enter Mess Mate</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-500 text-center">
              🔒 Non-skippable: Ensures seamless returning logins with email + password.
            </p>
          </form>
        )}

        {/* ========================================================= */}
        {/* SCREEN 5: FORGOT PASSWORD */}
        {/* ========================================================= */}
        {step === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('login');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <span className="text-[11px] font-bold text-terracotta-400">Password Recovery</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1">Reset Your Password</h3>
              <p className="text-xs text-gray-400 mb-3">
                Enter your registered college email and we'll send you a password reset link.
              </p>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 21bce1001@vitapstudent.ac.in"
                  required
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all"
                />
                <div className="absolute right-3.5 top-3 text-gray-500 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full h-12 bg-terracotta-500 hover:bg-terracotta-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-terracotta"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Password Reset Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
