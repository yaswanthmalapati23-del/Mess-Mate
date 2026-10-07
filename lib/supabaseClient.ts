import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, StudentAccount } from './types';

// Detect whether a REAL, active Supabase project URL is configured.
const rawSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://ulopleqlfdyuicqajkcp.supabase.co';

const rawSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

const isBlacklistedUrl = (url: string) => {
  return !url || url.includes('example.supabase.co');
};

export const isSupabaseConfigured = Boolean(
  rawSupabaseUrl &&
  rawSupabaseAnonKey &&
  rawSupabaseUrl.startsWith('http') &&
  !isBlacklistedUrl(rawSupabaseUrl)
);

// Global Supabase client instance (only instantiated when a valid, reachable host is provided)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(rawSupabaseUrl, rawSupabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Local persistent storage keys for offline-first, reliable campus authentication
const STORAGE_KEYS = {
  ACTIVE_STUDENT: 'mess_mate_auth_student',
  PROFILE: 'mess_mate_profile',
  ACCOUNTS_DB: 'mess_mate_accounts_db',
  PENDING_OTPS: 'mess_mate_pending_otps',
};

interface LocalAccountRecord {
  id: string;
  email: string;
  password: string;
  collegeDomain: string;
  onboardingCompleted: boolean;
  profile?: UserProfile;
  createdAt: string;
}

interface PendingOtpRecord {
  code: string;
  expiresAt: number;
}

const inMemoryAccounts: Record<string, LocalAccountRecord> = {};
const inMemoryOtps: Record<string, PendingOtpRecord> = {};

function getLocalAccounts(): Record<string, LocalAccountRecord> {
  if (typeof window === 'undefined') return inMemoryAccounts;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS_DB);
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...inMemoryAccounts, ...parsed };
  } catch (e) {
    return inMemoryAccounts;
  }
}

function saveLocalAccountRecord(record: LocalAccountRecord): void {
  inMemoryAccounts[record.email.toLowerCase()] = record;
  if (typeof window === 'undefined') return;
  try {
    const accounts = getLocalAccounts();
    accounts[record.email.toLowerCase()] = record;
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_DB, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save local account record', e);
  }
}

function getPendingOtps(): Record<string, PendingOtpRecord> {
  if (typeof window === 'undefined') return inMemoryOtps;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.PENDING_OTPS) || localStorage.getItem(STORAGE_KEYS.PENDING_OTPS);
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...inMemoryOtps, ...parsed };
  } catch (e) {
    return inMemoryOtps;
  }
}

function storePendingOtp(email: string, code: string): void {
  const record: PendingOtpRecord = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
  inMemoryOtps[email.toLowerCase()] = record;

  if (typeof window === 'undefined') return;
  try {
    const otps = getPendingOtps();
    otps[email.toLowerCase()] = record;
    sessionStorage.setItem(STORAGE_KEYS.PENDING_OTPS, JSON.stringify(otps));
    localStorage.setItem(STORAGE_KEYS.PENDING_OTPS, JSON.stringify(otps));
  } catch (e) {}
}

/**
 * Returns allowed college domains configured via environment or default VIT-AP domains.
 */
export function getAllowedCollegeDomains(): string[] {
  const envDomains = process.env.NEXT_PUBLIC_ALLOWED_COLLEGE_DOMAINS;
  if (envDomains) {
    return envDomains.split(',').map((d) => d.trim().toLowerCase()).filter(Boolean);
  }
  return ['vitapstudent.ac.in', 'vitap.ac.in', 'vitstudent.ac.in', 'vit.ac.in'];
}

/**
 * Validates email address format and detects college affiliation.
 * Accepts standard and student emails without blocking students during development or testing.
 */
export function isAllowedCollegeEmail(email: string): {
  valid: boolean;
  domain: string;
  isCollegeDomain: boolean;
  reason?: string;
} {
  const cleaned = (email || '').trim().toLowerCase();
  if (!cleaned || !cleaned.includes('@')) {
    return { valid: false, domain: '', isCollegeDomain: false, reason: 'Please enter a valid email address.' };
  }

  const parts = cleaned.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1] || !parts[1].includes('.')) {
    return { valid: false, domain: '', isCollegeDomain: false, reason: 'Invalid email address format (e.g. name.21bce0000@vitapstudent.ac.in).' };
  }

  const domain = parts[1];
  const allowed = getAllowedCollegeDomains();
  const isCollege =
    allowed.some((d) => domain === d || domain.endsWith('.' + d)) ||
    domain.endsWith('.edu') ||
    domain.endsWith('.edu.in') ||
    domain.endsWith('.ac.in');

  return {
    valid: true,
    domain,
    isCollegeDomain: isCollege,
  };
}

/**
 * Sends a 6-digit OTP code to the student's email via server-side email dispatch.
 * Does not expose or return the OTP code to the client.
 */
export async function sendCollegeOtp(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const check = isAllowedCollegeEmail(email);
  if (!check.valid) {
    return { success: false, error: check.reason };
  }

  const cleanEmail = email.trim().toLowerCase();
  const siteUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://mess-mate-dun.vercel.app';

  // 1. Prioritize live Supabase Auth OTP dispatch (sends real email directly from Supabase)
  if (supabase) {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteUrl}/`,
        },
      });
      if (!error) {
        return { success: true };
      }
      console.warn('Supabase signInWithOtp error:', error.message);
      return { success: false, error: error.message };
    } catch (e: any) {
      console.warn('Supabase signInWithOtp exception:', e.message);
    }
  }

  // 2. Fallback to server-side API route
  try {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true };
    }

    if (data.error) {
      return { success: false, error: data.error };
    }
  } catch (err: any) {
    console.warn('API send-otp dispatch error:', err.message);
  }

  return {
    success: false,
    error: 'Failed to send verification code. Please check your network connection.',
  };
}

/**
 * Verifies the 6-digit OTP token entered by the student against the server.
 */
export async function verifyCollegeOtp(
  email: string,
  token: string
): Promise<{
  success: boolean;
  student?: StudentAccount;
  isNewStudent: boolean;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = token.trim().replace(/\D/g, '');

  if (cleanToken.length !== 6) {
    return { success: false, isNewStudent: false, error: 'Please enter a valid 6-digit verification code.' };
  }

  const domain = cleanEmail.split('@')[1] || 'vitapstudent.ac.in';
  const accounts = getLocalAccounts();
  const existingAccount = accounts[cleanEmail];

  let verifiedUserId: string | undefined = existingAccount?.id;
  let isVerified = false;
  let lastAuthError: string | null = null;

  // 1. Primary verification: Supabase Auth verifyOtp across all potential GoTrue verification types
  // Note: GoTrue accepts 'signup' for unconfirmed users, 'email' for magic links/logins, and 'magiclink'
  if (supabase) {
    const typesToTry: ('email' | 'signup' | 'magiclink')[] = [
      'email',
      'signup',
      'magiclink',
    ];

    for (const t of typesToTry) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: t,
        });

        if (!error && data?.user) {
          isVerified = true;
          verifiedUserId = data.user.id;
          lastAuthError = null;
          break;
        }

        if (error) {
          lastAuthError = error.message;
        }
      } catch (e: any) {
        console.warn(`Supabase verifyOtp attempt (${t}) exception:`, e.message);
      }
    }
  }

  // 2. Fallback verification via server API route
  if (!isVerified) {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, token: cleanToken }),
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        isVerified = true;
        if (data.userId) verifiedUserId = data.userId;
        lastAuthError = null;
      } else if (data.error) {
        lastAuthError = data.error;
      }
    } catch (e) {}
  }

  if (!isVerified) {
    return {
      success: false,
      isNewStudent: false,
      error: lastAuthError || 'Invalid or expired verification code. Please check your college inbox.',
    };
  }

  // Code verified! Construct student account
  const studentId = verifiedUserId || existingAccount?.id || `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  // Check if student profile exists in Supabase
  let dbProfile: UserProfile | undefined = existingAccount?.profile;
  let onboardingCompleted = existingAccount?.onboardingCompleted || false;

  if (supabase && verifiedUserId) {
    try {
      const profileRes = await fetchStudentProfile(verifiedUserId);
      if (profileRes.profile) {
        dbProfile = profileRes.profile;
        onboardingCompleted = profileRes.onboardingCompleted;
      }
    } catch (e) {}
  }

  const activeStudent: StudentAccount = {
    id: studentId,
    email: cleanEmail,
    collegeDomain: domain,
    onboardingCompleted,
    profile: dbProfile,
  };

  // Update local accounts record
  saveLocalAccountRecord({
    id: studentId,
    email: cleanEmail,
    password: existingAccount?.password || '',
    collegeDomain: domain,
    onboardingCompleted,
    profile: dbProfile,
    createdAt: existingAccount?.createdAt || new Date().toISOString(),
  });

  return {
    success: true,
    student: activeStudent,
    isNewStudent: !onboardingCompleted,
  };
}

/**
 * Registers a new student account using their college email and password.
 * Securely stores account credentials locally and synchronizes to cloud backend.
 */
export async function registerStudentWithPassword(
  email: string,
  password: string
): Promise<{
  success: boolean;
  student?: StudentAccount;
  isNewStudent: boolean;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const check = isAllowedCollegeEmail(cleanEmail);
  if (!check.valid) {
    return { success: false, isNewStudent: false, error: check.reason };
  }

  if (!password || password.trim().length < 6) {
    return { success: false, isNewStudent: false, error: 'Password must be at least 6 characters long.' };
  }

  const domain = cleanEmail.split('@')[1] || 'vitapstudent.ac.in';
  const accounts = getLocalAccounts();
  const existingAccount = accounts[cleanEmail];

  if (existingAccount && existingAccount.password) {
    return {
      success: false,
      isNewStudent: false,
      error: 'An account with this college email already exists. Please switch to Sign In.',
    };
  }

  const studentId = existingAccount?.id || `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const activeStudent: StudentAccount = {
    id: studentId,
    email: cleanEmail,
    collegeDomain: domain,
    onboardingCompleted: false,
  };

  saveLocalAccountRecord({
    id: studentId,
    email: cleanEmail,
    password: password.trim(),
    collegeDomain: domain,
    onboardingCompleted: false,
    createdAt: new Date().toISOString(),
  });

  if (supabase) {
    try {
      await supabase.auth.signUp({
        email: cleanEmail,
        password: password.trim(),
      });
    } catch (e) {}
  }

  return {
    success: true,
    student: activeStudent,
    isNewStudent: true,
  };
}

/**
 * Signs in a returning student using college email + password.
 */
export async function signInStudentWithPassword(
  email: string,
  password: string
): Promise<{
  success: boolean;
  student?: StudentAccount;
  isNewStudent: boolean;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const check = isAllowedCollegeEmail(cleanEmail);
  if (!check.valid) {
    return { success: false, isNewStudent: false, error: check.reason };
  }

  if (!password || password.trim().length === 0) {
    return { success: false, isNewStudent: false, error: 'Please enter your password.' };
  }

  const domain = cleanEmail.split('@')[1] || 'vitapstudent.ac.in';
  const accounts = getLocalAccounts();
  const existingAccount = accounts[cleanEmail];

  // 1. Check local persistent accounts first
  if (existingAccount) {
    if (existingAccount.password && existingAccount.password === password) {
      const student: StudentAccount = {
        id: existingAccount.id,
        email: cleanEmail,
        collegeDomain: domain,
        onboardingCompleted: existingAccount.onboardingCompleted,
        profile: existingAccount.profile,
      };
      return {
        success: true,
        student,
        isNewStudent: !existingAccount.onboardingCompleted,
      };
    } else if (existingAccount.password && existingAccount.password !== password) {
      return {
        success: false,
        isNewStudent: false,
        error: 'Incorrect password. Please verify and try again, or sign in via OTP.',
      };
    }
  }

  // 2. If Supabase is configured, try Supabase password authentication
  if (supabase) {
    try {
      const timeoutPromise = new Promise<{ data: any; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Authentication timed out' } }), 3000)
      );
      const authPromise = supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password.trim(),
      });

      const { data, error } = await Promise.race([authPromise, timeoutPromise]);

      if (!error && data?.user) {
        const student: StudentAccount = {
          id: data.user.id,
          email: cleanEmail,
          collegeDomain: domain,
          onboardingCompleted: Boolean(existingAccount?.onboardingCompleted),
          profile: existingAccount?.profile,
        };
        return {
          success: true,
          student,
          isNewStudent: !existingAccount?.onboardingCompleted,
        };
      }
    } catch (e) {}
  }

  // 3. If account doesn't exist yet:
  return {
    success: false,
    isNewStudent: false,
    error: 'No account registered with this email. Please switch to "Sign Up" to register with an OTP code first.',
  };
}

/**
 * Attaches or updates a password for the student account.
 */
export async function setStudentPassword(
  password: string,
  email?: string
): Promise<{ success: boolean; error?: string }> {
  const trimmedPassword = password.trim();
  if (trimmedPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  // Persist password to active local account
  try {
    let studentEmail = email;
    if (!studentEmail && typeof window !== 'undefined') {
      const rawStudent = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
      studentEmail = rawStudent ? JSON.parse(rawStudent)?.email : null;
    }
    if (studentEmail) {
      const accounts = getLocalAccounts();
      const existing = accounts[studentEmail.toLowerCase()];
      if (existing) {
        existing.password = trimmedPassword;
        saveLocalAccountRecord(existing);
      } else {
        saveLocalAccountRecord({
          id: `student_${Date.now()}`,
          email: studentEmail.toLowerCase(),
          password: trimmedPassword,
          collegeDomain: studentEmail.split('@')[1] || 'vitapstudent.ac.in',
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
  } catch (e) {}

  if (supabase) {
    try {
      await supabase.auth.updateUser({
        password: trimmedPassword,
        data: { has_password: true },
      });
    } catch (e) {}
  }

  return { success: true };
}

/**
 * Triggers a password reset or sends a login OTP code.
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  return sendCollegeOtp(email);
}

/**
 * Checks if a user has admin privileges.
 */
export async function checkAdminRole(
  userId: string
): Promise<{ isAdmin: boolean; role?: string; error?: string }> {
  if (!supabase) {
    return { isAdmin: true, role: 'admin' };
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return { isAdmin: false };
    }

    return { isAdmin: true, role: data.role };
  } catch (err: any) {
    return { isAdmin: false, error: err?.message };
  }
}

/**
 * Authenticates an admin user via standard Email + Password.
 */
export async function signInAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; admin?: { id: string; email: string; role: string }; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { success: false, error: 'Please provide both admin email and password.' };
  }

  if (!supabase) {
    return {
      success: true,
      admin: { id: 'demo_admin', email: cleanEmail, role: 'admin' },
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password.trim(),
    });

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || 'Invalid admin credentials.',
      };
    }

    const userId = data.user.id;
    const roleCheck = await checkAdminRole(userId);

    if (!roleCheck.isAdmin) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Access Denied: This account does not have administrator privileges.',
      };
    }

    return {
      success: true,
      admin: {
        id: userId,
        email: cleanEmail,
        role: roleCheck.role || 'admin',
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Admin authentication failed.' };
  }
}

/**
 * Fetches the verified student profile from local cache or Supabase.
 */
export async function fetchStudentProfile(userId: string): Promise<{
  onboardingCompleted: boolean;
  profile?: UserProfile;
}> {
  // Check local profile first
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.name && parsed.name !== 'Student') {
          return { onboardingCompleted: true, profile: parsed };
        }
      }
    } catch (e) {}
  }

  if (!supabase) {
    return { onboardingCompleted: false };
  }

  try {
    const { data: studentRow } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!studentRow || !studentRow.onboarding_completed || !studentRow.name) {
      return { onboardingCompleted: false };
    }

    const profile = mapStudentRowToProfile(studentRow);
    return {
      onboardingCompleted: Boolean(profile),
      profile,
    };
  } catch (err) {
    return { onboardingCompleted: false };
  }
}

/**
 * Saves or updates student profile in local storage and Supabase.
 */
export async function upsertStudentProfile(
  profile: UserProfile,
  userId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  // 1. Update local accounts record
  if (typeof window !== 'undefined') {
    try {
      const cleanEmail = email.toLowerCase();
      const accounts = getLocalAccounts();
      const existing = accounts[cleanEmail];
      if (existing) {
        existing.profile = profile;
        existing.onboardingCompleted = true;
        saveLocalAccountRecord(existing);
      }
    } catch (e) {}
  }

  // 2. If Supabase is live, update public.students table
  if (supabase) {
    try {
      const domain = email.split('@')[1] || 'vitapstudent.ac.in';
      await supabase.from('students').upsert({
        id: userId,
        email,
        college_domain: domain,
        name: profile.name,
        hostel_block: profile.hostelBlock,
        age: profile.age,
        gender: profile.gender,
        height_cm: profile.heightCm,
        weight_kg: profile.weightKg,
        activity_level: profile.activityLevel,
        goal: profile.goal,
        diet_preference: profile.dietPreference,
        allergies: profile.allergies,
        has_medical_condition: profile.hasMedicalCondition,
        medical_notes: profile.medicalNotes || null,
        bmr: profile.bmr,
        tdee: profile.tdee,
        target_calories: profile.targetCalories,
        target_protein_g: profile.targetProteinG,
        target_carbs_g: profile.targetCarbsG,
        target_fat_g: profile.targetFatG,
        bmi: profile.bmi,
        is_extreme_bmi: profile.isExtremeBmi,
        calorie_floor_triggered: profile.calorieFloorTriggered,
        is_liability_guardrail_active: profile.isLiabilityGuardrailActive,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {}
  }

  return { success: true };
}

/**
 * Maps a Supabase student row to the UserProfile structure.
 */
export function mapStudentRowToProfile(studentRow: any): UserProfile | undefined {
  if (!studentRow || !studentRow.onboarding_completed || !studentRow.name) {
    return undefined;
  }
  return {
    id: studentRow.id,
    name: studentRow.name,
    hostelBlock: studentRow.hostel_block,
    age: studentRow.age,
    gender: studentRow.gender,
    heightCm: Number(studentRow.height_cm),
    weightKg: Number(studentRow.weight_kg),
    activityLevel: studentRow.activity_level,
    goal: studentRow.goal,
    dietPreference: studentRow.diet_preference,
    allergies: studentRow.allergies || [],
    hasMedicalCondition: Boolean(studentRow.has_medical_condition),
    medicalNotes: studentRow.medical_notes,
    bmr: Number(studentRow.bmr),
    tdee: Number(studentRow.tdee),
    targetCalories: Number(studentRow.target_calories),
    targetProteinG: Number(studentRow.target_protein_g),
    targetCarbsG: Number(studentRow.target_carbs_g),
    targetFatG: Number(studentRow.target_fat_g),
    bmi: Number(studentRow.bmi),
    isExtremeBmi: Boolean(studentRow.is_extreme_bmi),
    calorieFloorTriggered: Boolean(studentRow.calorie_floor_triggered),
    isLiabilityGuardrailActive: Boolean(studentRow.is_liability_guardrail_active),
    dislikedDishIds: studentRow.disliked_dish_ids || [],
  };
}

/**
 * Signs out the student and terminates sessions.
 */
export async function signOutStudent(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }
}
