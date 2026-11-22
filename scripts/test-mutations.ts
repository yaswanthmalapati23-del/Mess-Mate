import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

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
