import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

async function testMutations() {
  const client = createClient(url, key);

  console.log('Testing insert into allowed_college_domains:');
  const insertRes = await client.from('allowed_college_domains').insert([
    {
      id: 'vitapstudent',
      college_name: 'VIT-AP Student Email',
      domain: 'vitapstudent.ac.in',
      is_active: true,
    },
  ]);
  console.log('insertRes:', insertRes);

  console.log('\nTesting update on allowed_college_domains:');
  const updateRes = await client
    .from('allowed_college_domains')
    .update({ domain: 'vitapstudent.ac.in' })
    .eq('id', 'vitap_student');
  console.log('updateRes:', updateRes);
}

testMutations();
