import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
