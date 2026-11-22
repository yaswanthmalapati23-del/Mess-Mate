import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

async function testOtp() {
  console.log('Sending OTP via Supabase Auth to test student...');
  const { data, error } = await supabase.auth.signInWithOtp({
    email: 'test.student@vitapstudent.ac.in',
    options: {
      shouldCreateUser: true,
    },
  });

  console.log('Result:', { data, error });
}

testOtp();
