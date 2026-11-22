import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
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
  await testEmail('testuser@example.com');
}

run();
