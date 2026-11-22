import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

async function checkAdminTable() {
  const client = createClient(url, key);

  console.log('Querying admin_users table in live Supabase:');
  const { data, error } = await client.from('admin_users').select('*');
  console.log('admin_users result:', { data, error });
}

checkAdminTable();
