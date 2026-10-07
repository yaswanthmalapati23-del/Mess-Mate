import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

const supabase = createClient(url, key);

async function testOtp() {
  console.log('Sending OTP via Supabase Auth to yaswanth.26bce7370@vitapstudent.ac.in...');
  const { data, error } = await supabase.auth.signInWithOtp({
    email: 'yaswanth.26bce7370@vitapstudent.ac.in',
    options: {
      shouldCreateUser: true,
    },
  });

  console.log('Result:', { data, error });
}

testOtp();
