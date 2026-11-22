import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

async function checkRpc() {
  const client = createClient(url, key);

  console.log('Testing RPC or functions:');
  const { data, error } = await client.rpc('add_college_domain', {
    new_domain: 'vitapstudent.ac.in',
  });
  console.log('add_college_domain result:', { data, error });
}

checkRpc();
