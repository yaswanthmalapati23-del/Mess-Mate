import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

async function check() {
  const client = createClient(url, key);

  console.log('Querying allowed_college_domains:');
  const { data, error } = await client.from('allowed_college_domains').select('*');
  console.log('Domains:', data);
}

check();
