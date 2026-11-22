import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

console.log('Testing Supabase with URL:', url);
const supabase = createClient(url, key);

async function run() {
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: {
        apikey: key,
      },
    });
    console.log('Auth health status:', res.status, await res.text());
  } catch (err: any) {
    console.error('Fetch health failed:', err.message);
  }

  try {
    console.log('Attempting signInWithOtp...');
    const { data, error } = await supabase.auth.signInWithOtp({
      email: 'arjun.21bce7000@vitapstudent.ac.in',
      options: { shouldCreateUser: true }
    });
    console.log('signInWithOtp result:');
    console.log('Data:', data);
    console.log('Error:', error);
  } catch (err: any) {
    console.error('Exception in signInWithOtp:', err);
  }
}

run();
