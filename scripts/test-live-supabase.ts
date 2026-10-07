import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

async function testConnection() {
  console.log('Testing live connection to Supabase project:', url);
  const client = createClient(url, key);
  try {
    const { data, error } = await client.auth.getSession();
    if (error) {
      console.error('❌ Supabase Auth error:', error.message);
    } else {
      console.log('✅ Supabase Auth connection successfully verified! Session endpoint is reachable.');
    }
  } catch (err: any) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
