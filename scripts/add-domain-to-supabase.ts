import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

async function updateDomain() {
  const client = createClient(url, key);
  console.log('Attempting to insert/update vitapstudent.ac.in in allowed_college_domains...');

  const { data, error } = await client.from('allowed_college_domains').upsert([
    {
      id: 'vitapstudent',
      college_name: 'VIT-AP Student Portal',
      domain: 'vitapstudent.ac.in',
      is_active: true,
    },
  ]);

  if (error) {
    console.log('Notice: Could not insert via publishable key (RLS restricted):', error.message);
    console.log('SQL to run in Supabase SQL editor:');
    console.log(`INSERT INTO public.allowed_college_domains (id, college_name, domain, is_active)
VALUES ('vitapstudent', 'VIT-AP Student Email', 'vitapstudent.ac.in', true)
ON CONFLICT (domain) DO UPDATE SET is_active = true;`);
  } else {
    console.log('✅ Successfully added vitapstudent.ac.in to live Supabase allowed_college_domains table!');
  }
}

updateDomain();
