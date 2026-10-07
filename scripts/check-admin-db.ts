import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

async function checkAdminTable() {
  const client = createClient(url, key);

  console.log('Querying admin_users table in live Supabase:');
  const { data, error } = await client.from('admin_users').select('*');
  console.log('admin_users result:', { data, error });
}

checkAdminTable();
