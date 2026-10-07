import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

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
