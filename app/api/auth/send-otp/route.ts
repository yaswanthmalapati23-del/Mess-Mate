import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAllowedCollegeEmail } from '@/lib/supabaseClient';

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

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    const check = isAllowedCollegeEmail(email);
    if (!check.valid) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 400 });
    }

    // 1. Dispatch real OTP code via Supabase Auth directly to student's email inbox
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: 'https://mess-mate-dun.vercel.app/',
      },
    });

    if (error) {
      console.warn('Supabase Auth signInWithOtp error:', error.message);
      let userFriendly = error.message || 'Failed to dispatch verification code to your college email.';
      if (error.message.includes('Database error saving new user') || error.message.includes('not authorized')) {
        userFriendly = `Access Denied: The domain @${email.split('@')[1]} is not authorized in the campus database. Please enter your official @vitapstudent.ac.in or @vitap.ac.in college email.`;
      }
      return NextResponse.json(
        {
          success: false,
          error: userFriendly,
        },
        { status: 400 }
      );
    }

    // 2. Respond with success - NEVER return the OTP code in response!
    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code was sent to ${email}. Please check your inbox.`,
    });
  } catch (err: any) {
    console.error('Send OTP route error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error processing OTP request.' },
      { status: 500 }
    );
  }
}
