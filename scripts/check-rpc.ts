import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

async function checkRpc() {
  const client = createClient(url, key);

  console.log('Testing RPC or functions:');
  const { data, error } = await client.rpc('add_college_domain', {
    new_domain: 'vitapstudent.ac.in',
  });
  console.log('add_college_domain result:', { data, error });
}

checkRpc();
