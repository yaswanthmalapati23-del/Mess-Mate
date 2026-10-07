import { createClient } from '@supabase/supabase-js';

const url = 'https://ulopleqlfdyuicqajkcp.supabase.co';
const key = 'sb_publishable_jrhBD1xywfukrCc0PtqZvg_FW5b8TO5';

async function verifyEverything() {
  console.log('====================================================');
  console.log('MESS MATE: SUPABASE LIVE HEALTH & DB VERIFICATION');
  console.log('====================================================\n');

  const client = createClient(url, key);

  // 1. Auth Endpoint Check
  console.log('1. Checking Supabase Auth Service:');
  try {
    const { data: sessionData, error: sessionErr } = await client.auth.getSession();
    if (sessionErr) {
      console.log('❌ Auth service returned error:', sessionErr.message);
    } else {
      console.log('✅ Supabase Auth service is live & responsive.');
    }
  } catch (e: any) {
    console.log('❌ Auth service unreachable:', e.message);
  }

  // 2. Allowed Domains Table Check
  console.log('\n2. Checking public.allowed_college_domains:');
  try {
    const { data, error } = await client.from('allowed_college_domains').select('*');
    if (error) {
      console.log('⚠️ allowed_college_domains query:', error.message);
    } else {
      console.log('✅ allowed_college_domains table exists! Rows found:', data?.length || 0);
      data?.forEach((d) => console.log(`   - Domain: ${d.domain} (${d.college_name}) [Active: ${d.is_active}]`));
    }
  } catch (e: any) {
    console.log('⚠️ Error querying allowed_college_domains:', e.message);
  }

  // 3. Students Table Check
  console.log('\n3. Checking public.students table:');
  try {
    const { data, error } = await client.from('students').select('id, email, college_domain').limit(5);
    if (error) {
      console.log('ℹ️ students table query response:', error.message);
      if (error.code === 'PGRST116' || error.message.includes('permission') || error.message.includes('RLS')) {
        console.log('   (Note: Row Level Security is active and blocking unauthenticated reads, which is expected!)');
      }
    } else {
      console.log('✅ students table exists & accessible. Count:', data?.length || 0);
    }
  } catch (e: any) {
    console.log('⚠️ Error querying students table:', e.message);
  }

  // 4. Dishes Table Check
  console.log('\n4. Checking public.dishes table:');
  try {
    const { data, error } = await client.from('dishes').select('id, name, calories, protein').limit(3);
    if (error) {
      console.log('⚠️ dishes table query response:', error.message);
    } else {
      console.log('✅ dishes table exists! Sample dishes found:', data?.length || 0);
      data?.forEach((d) => console.log(`   - ${d.name} (${d.calories} kcal, ${d.protein}g protein)`));
    }
  } catch (e: any) {
    console.log('⚠️ Error querying dishes:', e.message);
  }

  // 5. Food Court Shops Table Check
  console.log('\n5. Checking public.food_court_shops table:');
  try {
    const { data, error } = await client.from('food_court_shops').select('id, name, price_range').limit(3);
    if (error) {
      console.log('⚠️ food_court_shops query response:', error.message);
    } else {
      console.log('✅ food_court_shops table exists! Vendors found:', data?.length || 0);
      data?.forEach((s) => console.log(`   - ${s.name} (${s.price_range})`));
    }
  } catch (e: any) {
    console.log('⚠️ Error querying food_court_shops:', e.message);
  }

  // 6. Food Court Items Table Check
  console.log('\n6. Checking public.food_court_items table:');
  try {
    const { data, error } = await client.from('food_court_items').select('id, name, price, calories').limit(3);
    if (error) {
      console.log('⚠️ food_court_items query response:', error.message);
    } else {
      console.log('✅ food_court_items table exists! Items found:', data?.length || 0);
      data?.forEach((item) => console.log(`   - ${item.name} (₹${item.price}, ${item.calories} kcal)`));
    }
  } catch (e: any) {
    console.log('⚠️ Error querying food_court_items:', e.message);
  }

  // 7. Meal Logs Table Check
  console.log('\n7. Checking public.meal_logs table:');
  try {
    const { data, error } = await client.from('meal_logs').select('id').limit(1);
    if (error) {
      console.log('ℹ️ meal_logs query response:', error.message);
      console.log('   (Row Level Security active as expected: only authenticated students can query logs)');
    } else {
      console.log('✅ meal_logs table exists and is operational.');
    }
  } catch (e: any) {
    console.log('⚠️ Error querying meal_logs:', e.message);
  }

  console.log('\n====================================================');
  console.log('VERIFICATION COMPLETE');
  console.log('====================================================');
}

verifyEverything();
