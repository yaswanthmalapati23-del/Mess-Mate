import dns from 'dns';
import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

console.log('--- Testing Supabase project: ulopleqlfdyuicqajkcp ---');

dns.lookup('ulopleqlfdyuicqajkcp.supabase.co', async (err, address) => {
  if (err) {
    console.log('DNS lookup failed for ulopleqlfdyuicqajkcp.supabase.co:', err.code);
  } else {
    console.log('✅ DNS resolved successfully! IP:', address);
    
    const client = createClient(url, key);
    try {
      const { data, error } = await client.from('students').select('*').limit(1);
      console.log('Query result:', { data, error });
    } catch (e: any) {
      console.log('Query exception:', e.message);
    }
  }
});
