import * as fs from 'fs';
import * as path from 'path';
import { MESS_DISHES } from '../lib/data/messDishes';
import { FOOD_COURT_SHOPS, RAW_FOOD_COURT_ITEMS } from '../lib/data/foodCourtItems';
import { MONTHLY_MESS_MENU } from '../lib/data/monthlyMenuData';
import { IFCT_INGREDIENTS } from '../lib/data/ifctIngredients';

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function generateSeed() {
  let sql = `-- =========================================================\n`;
  sql += `-- MESS MATE: SEED DATA FOR SUPABASE\n`;
  sql += `-- Auto-generated from campus database\n`;
  sql += `-- =========================================================\n\n`;

  // 1. Ingredients
  sql += `-- 1. IFCT 2017 Ingredients\n`;
  for (const ing of IFCT_INGREDIENTS) {
    const allergens = ing.allergens ? `ARRAY[${ing.allergens.map((a) => `'${escapeSql(a)}'`).join(',')}]` : `'{}'`;
    sql += `INSERT INTO public.ingredients (id, code, name, category, calories, protein, carbs, fat, fiber, allergens) VALUES ('${ing.id}', '${ing.code}', '${escapeSql(ing.name)}', '${ing.category}', ${ing.calories}, ${ing.protein}, ${ing.carbs}, ${ing.fat}, ${ing.fiber}, ${allergens}) ON CONFLICT (id) DO NOTHING;\n`;
  }

  // 2. Dishes
  sql += `\n-- 2. Calibrated Mess Dishes\n`;
  for (const d of MESS_DISHES) {
    const slots = `ARRAY[${d.mealSlots.map((s) => `'${s}'`).join(',')}]`;
    const allergens = d.allergens.length > 0 ? `ARRAY[${d.allergens.map((a) => `'${escapeSql(a)}'`).join(',')}]` : `'{}'`;
    sql += `INSERT INTO public.dishes (id, name, category, meal_slots, portion_description, portion_size_grams, portion_status, calories, protein, carbs, fat, fiber, allergens, description) VALUES ('${d.id}', '${escapeSql(d.name)}', '${d.category}', ${slots}, '${escapeSql(d.portionDescription)}', ${d.portionSizeGrams}, '${d.portionStatus}', ${d.calories}, ${d.protein}, ${d.carbs}, ${d.fat}, ${d.fiber}, ${allergens}, '${escapeSql(d.description || '')}') ON CONFLICT (id) DO NOTHING;\n`;
  }

  // 3. Food Court Shops
  sql += `\n-- 3. Campus Food Court Vendors\n`;
  for (const s of FOOD_COURT_SHOPS) {
    sql += `INSERT INTO public.food_court_shops (id, name, tagline, icon, price_range, popular_item_name) VALUES ('${s.id}', '${escapeSql(s.name)}', '${escapeSql(s.tagline)}', '${escapeSql(s.icon)}', '${escapeSql(s.priceRange)}', '${escapeSql(s.popularItemName)}') ON CONFLICT (id) DO NOTHING;\n`;
  }

  // 4. Food Court Items
  sql += `\n-- 4. Food Court Items with Student Pricing\n`;
  for (const item of RAW_FOOD_COURT_ITEMS) {
    const allergens = item.allergens.length > 0 ? `ARRAY[${item.allergens.map((a) => `'${escapeSql(a)}'`).join(',')}]` : `'{}'`;
    sql += `INSERT INTO public.food_court_items (id, shop_id, shop_name, name, price, category, calories, protein, carbs, fat, fiber, allergens, portion_description, is_popular) VALUES ('${item.id}', '${item.shopId}', '${escapeSql(item.shopName)}', '${escapeSql(item.name)}', ${item.price}, '${item.category}', ${item.calories}, ${item.protein}, ${item.carbs}, ${item.fat}, ${item.fiber}, ${allergens}, '${escapeSql(item.portionDescription)}', ${item.isPopular ? 'true' : 'false'}) ON CONFLICT (id) DO NOTHING;\n`;
  }

  // 5. Monthly Menu
  sql += `\n-- 5. 30-Day Mess Rotation Menu\n`;
  for (const day of MONTHLY_MESS_MENU) {
    for (const [slot, dishIds] of Object.entries(day.slots)) {
      if (dishIds.length > 0) {
        const idsArr = `ARRAY[${dishIds.map((id) => `'${id}'`).join(',')}]`;
        sql += `INSERT INTO public.monthly_menu (day_number, day_of_week, meal_slot, dish_ids) VALUES (${day.dayNumber}, '${day.dayOfWeek}', '${slot}', ${idsArr}) ON CONFLICT (day_number, meal_slot) DO NOTHING;\n`;
      }
    }
  }

  const outputPath = path.resolve(__dirname, '../supabase/seed.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');
  console.log('✅ Generated supabase/seed.sql successfully! Total bytes:', fs.statSync(outputPath).size);
}

generateSeed();
