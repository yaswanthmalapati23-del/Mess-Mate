import crypto from 'crypto';

interface StoredOtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// In-memory server-side OTP store
// In a serverless/edge environment, this persists within the container instance.
const globalOtpMap: Map<string, StoredOtpEntry> = new Map();

/**
 * Generates a secure 6-digit OTP and stores it server-side for 10 minutes.
 */
export function generateServerOtp(email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  const code = crypto.randomInt(100000, 1000000).toString();

  globalOtpMap.set(cleanEmail, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  });

  return code;
}

/**
 * Validates the entered OTP code against the server store.
 */
export function verifyServerOtp(email: string, code: string): { valid: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  const entry = globalOtpMap.get(cleanEmail);

  if (!entry) {
    return {
      valid: false,
      error: 'No verification code found for this email. Please request a new code.',
    };
  }

  if (Date.now() > entry.expiresAt) {
    globalOtpMap.delete(cleanEmail);
    return {
      valid: false,
      error: 'Verification code has expired. Please request a new code.',
    };
  }

  if (entry.attempts >= 5) {
    globalOtpMap.delete(cleanEmail);
    return {
      valid: false,
      error: 'Too many incorrect attempts. Please request a new verification code.',
    };
  }

  if (entry.code !== cleanCode) {
    entry.attempts++;
    return {
      valid: false,
      error: 'Incorrect verification code. Please check your email and try again.',
    };
  }

  // Code verified successfully! Consume the OTP so it cannot be reused
  globalOtpMap.delete(cleanEmail);
  return { valid: true };
}
