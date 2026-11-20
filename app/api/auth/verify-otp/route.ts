import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, getClientIp } from '@/lib/auth/rateLimit';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://ulopleqlfdyuicqajkcp.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body?.email || '').trim().toLowerCase();
    const token = (body?.token || '').trim();

    if (!email || !token) {
      return NextResponse.json(
        { success: false, error: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(token)) {
      return NextResponse.json(
        { success: false, error: 'Verification code must be 6 digits.' },
        { status: 400 }
      );
    }

    // Throttle verification attempts to prevent 6-digit OTP brute-forcing.
    const ip = getClientIp(req);
    const ipLimit = rateLimit(`verify-otp:ip:${ip}`, 20, 10 * 60 * 1000);
    const emailLimit = rateLimit(`verify-otp:email:${email}`, 10, 10 * 60 * 1000);
    if (!ipLimit.ok || !emailLimit.ok) {
      const retryAfter = Math.max(ipLimit.retryAfter, emailLimit.retryAfter);
      return NextResponse.json(
        { success: false, error: 'Too many verification attempts. Please wait and request a new code.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    // Verify token with Supabase Auth across email, signup, and magiclink
    const types: ('email' | 'signup' | 'magiclink')[] = ['email', 'signup', 'magiclink'];
    let verifiedUser = null;
    let lastError: any = null;

    for (const t of types) {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: t,
      });

      if (!error && data?.user) {
        verifiedUser = data.user;
        break;
      }
      if (error) {
        lastError = error;
      }
    }

    if (!verifiedUser) {
      return NextResponse.json(
        { success: false, error: lastError?.message || 'Invalid or expired verification code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      userId: verifiedUser.id,
      message: 'Code verified successfully.',
    });
  } catch (err: any) {
    console.error('Verify OTP route error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error verifying OTP.' },
      { status: 500 }
    );
  }
}
