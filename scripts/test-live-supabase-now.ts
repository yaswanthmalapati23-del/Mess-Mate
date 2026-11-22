import dns from 'dns';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const host = url ? new URL(url).hostname : 'localhost';
console.log('--- Testing Supabase project host:', host, '---');

dns.lookup(host, async (err, address) => {
  if (err) {
    console.log(`DNS lookup failed for ${host}:`, err.code);
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
