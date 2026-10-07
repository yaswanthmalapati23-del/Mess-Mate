import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

async function check() {
  const client = createClient(url, key);

  console.log('Querying allowed_college_domains:');
  const { data, error } = await client.from('allowed_college_domains').select('*');
  console.log('Domains:', data);
}

check();
