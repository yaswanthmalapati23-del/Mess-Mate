import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';
const supabase = createClient(url, key);

async function testEmail(email: string) {
  console.log('--- Testing email:', email);
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true }
  });
  console.log('Error:', error ? { message: error.message, status: error.status, name: error.name } : 'None (SUCCESS)');
}

async function run() {
  await testEmail('student@vit.ac.in');
  await testEmail('student@gmail.com');
  await testEmail('student@vitap.ac.in');
  await testEmail('student.21bce0001@vitapstudent.ac.in');
  await testEmail('yaswanthmalapati23@gmail.com');
}

run();
