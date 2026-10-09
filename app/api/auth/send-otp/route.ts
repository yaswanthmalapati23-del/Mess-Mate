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
    const mode = (body?.mode || 'signin') as 'signin' | 'signup';

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    const check = isAllowedCollegeEmail(email);
    if (!check.valid) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 400 });
    }

    const siteUrl = 'https://mess-mate-dun.vercel.app/';

    // FLOW 1: SIGN-UP (Register new student)
    if (mode === 'signup') {
      // 1. Check if an account already exists using shouldCreateUser: false
      const checkRes = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      // If checkRes.error does NOT contain 'Signups not allowed for otp', the user already exists in auth!
      const userAlreadyExists = !checkRes.error || !checkRes.error.message.includes('Signups not allowed for otp');

      if (userAlreadyExists) {
        return NextResponse.json(
          {
            success: false,
            accountExists: true,
            error: 'Account already exists! An account with this college email is already registered. Please switch to Sign In.',
          },
          { status: 400 }
        );
      }

      // 2. Dispatch real OTP code for brand-new student
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: siteUrl,
        },
      });

      if (error) {
        console.warn('Supabase Auth signInWithOtp signup error:', error.message);
        let userFriendly = error.message || 'Failed to dispatch registration code to your college email.';
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

      return NextResponse.json({
        success: true,
        message: `A 6-digit registration code was sent to ${email}. Please check your college inbox.`,
      });
    }

    // FLOW 2: SIGN-IN (Existing student login via OTP)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: siteUrl,
      },
    });

    if (error) {
      // If user does not exist in Supabase
      if (error.message.includes('Signups not allowed for otp')) {
        return NextResponse.json(
          {
            success: false,
            accountNotFound: true,
            error: 'No account found with this email. Please switch to Sign Up to create your student account.',
          },
          { status: 400 }
        );
      }

      console.warn('Supabase Auth signInWithOtp signin error:', error.message);
      let userFriendly = error.message || 'Failed to dispatch login code to your college email.';
      if (error.message.includes('Database error saving new user') || error.message.includes('not authorized')) {
        userFriendly = `Access Denied: The domain @${email.split('@')[1]} is not authorized. Please enter your official @vitapstudent.ac.in college email.`;
      }
      return NextResponse.json(
        {
          success: false,
          error: userFriendly,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit login code was sent to ${email}. Please check your inbox.`,
    });
  } catch (err: any) {
    console.error('Send OTP route error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error processing OTP request.' },
      { status: 500 }
    );
  }
}
