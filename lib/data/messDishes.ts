import { Dish, DishIngredientComposition, PortionKind } from '../types';
import { INGREDIENT_LOOKUP } from './ifctIngredients';

function inferPortionKind(name: string, portionDescription: string): PortionKind {
  const text = `${name} ${portionDescription}`.toLowerCase();
  if (
    /(roti|chapati|phulka|paratha|poori|puri|egg|idli|dosa|vada|samosa|\bpc\b|piece|slice|pair)/.test(
      text
    )
  ) {
    return 'discrete';
  }
  return 'scalable';
}

function inferStandardUnits(portionDescription: string): number {
  const match = portionDescription.match(/(\d+)\s+(large|medium|toasted|whole|crispy|standard|regular)?/i);
  if (match) return Math.max(1, Number(match[1]));
  return 1;
}

function inferMaxUnits(name: string, kind: PortionKind, standardUnits: number): number {
  if (kind === 'scalable') return 1.5;
  const text = name.toLowerCase();
  if (/(roti|chapati|phulka|idli)/.test(text)) return Math.max(4, standardUnits);
  if (/(egg)/.test(text)) return Math.max(3, standardUnits);
  if (/(paratha|samosa|bread|dosa)/.test(text)) return Math.max(2, standardUnits);
  return Math.max(2, standardUnits);
}

function composeDish(
  id: string,
  name: string,
  mealSlots: Dish['mealSlots'],
  category: Dish['category'],
  portionDescription: string,
  portionSizeGrams: number,
  portionStatus: Dish['portionStatus'],
  ingredients: DishIngredientComposition[],
  description?: string
): Dish {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  const allergenSet = new Set<string>();

  for (const comp of ingredients) {
    const ing = INGREDIENT_LOOKUP.get(comp.ingredientId);
    if (!ing) continue;
    const ratio = comp.rawGrams / 100;
    calories += ing.calories * ratio;
    protein += ing.protein * ratio;
    carbs += ing.carbs * ratio;
    fat += ing.fat * ratio;
    fiber += ing.fiber * ratio;

    if (ing.allergens) {
      ing.allergens.forEach((a) => allergenSet.add(a));
    }
  }

  const portionKind = inferPortionKind(name, portionDescription);
  const standardUnits = inferStandardUnits(portionDescription);

  return {
    id,
    name,
    mealSlots,
    category,
    allergens: Array.from(allergenSet),
    portionDescription,
    portionSizeGrams,
    portionStatus,
    portionKind,
    standardUnits,
    maxUnits: inferMaxUnits(name, portionKind, standardUnits),
    ingredients,
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    fiber: Math.round(fiber * 10) / 10,
    description,
  };
}

export function createMessDish(
  id: string,
  name: string,
  mealSlots: Dish['mealSlots'],
  category: Dish['category'],
  portionDescription: string,
  portionSizeGrams: number,
  portionStatus: Dish['portionStatus'],
  macros: { calories: number; protein: number; carbs: number; fat: number; fiber: number },
  allergens: string[] = [],
  description?: string
): Dish {
  const portionKind = inferPortionKind(name, portionDescription);
  const standardUnits = inferStandardUnits(portionDescription);

  return {
    id,
    name,
    mealSlots,
    category,
    allergens,
    portionDescription,
    portionSizeGrams,
    portionStatus,
    portionKind,
    standardUnits,
    maxUnits: inferMaxUnits(name, portionKind, standardUnits),
    ingredients: [],
    calories: Math.round(macros.calories),
    protein: Math.round(macros.protein * 10) / 10,
    carbs: Math.round(macros.carbs * 10) / 10,
    fat: Math.round(macros.fat * 10) / 10,
    fiber: Math.round(macros.fiber * 10) / 10,
    description,
  };
}


export const MESS_DISHES: Dish[] = [
  // ==================== BREAKFAST DISHES ====================
  composeDish(
    'dish_poha',
    'Indori Kanda Poha with Peanuts',
    ['breakfast', 'snacks'],
    'veg',
    '1 regular mess bowl (~150g cooked)',
    150,
    'measured',
    [
      { ingredientId: 'ing_poha', rawGrams: 50 },
      { ingredientId: 'ing_peanuts', rawGrams: 10 },
      { ingredientId: 'ing_onion', rawGrams: 20 },
      { ingredientId: 'ing_refined_oil', rawGrams: 6 },
    ],
    'Lightly spiced flattened rice tossed with onions, mustard seeds, and crunchy peanuts'
  ),

  composeDish(
    'dish_upma',
    'Vegetable Suji Upma',
    ['breakfast', 'snacks'],
    'veg',
    '1 regular mess bowl (~160g cooked)',
    160,
    'measured',
    [
      { ingredientId: 'ing_suji', rawGrams: 50 },
      { ingredientId: 'ing_carrot', rawGrams: 15 },
      { ingredientId: 'ing_green_peas', rawGrams: 15 },
      { ingredientId: 'ing_refined_oil', rawGrams: 7 },
    ],
    'Roasted semolina cooked with seasoned tempering and diced vegetables'
  ),

  composeDish(
    'dish_boiled_eggs',
    'Boiled Eggs (Pair)',
    ['breakfast', 'snacks', 'dinner'],
    'egg',
    '2 large whole boiled eggs',
    100,
    'measured',
    [{ ingredientId: 'ing_egg_whole', rawGrams: 100 }],
    'Pure bio-available protein source directly from the mess counter'
  ),

  composeDish(
    'dish_egg_bhurji',
    'Masala Egg Bhurji',
    ['breakfast', 'dinner'],
    'egg',
    '1 standard mess bowl (~120g)',
    120,
    'measured',
    [
      { ingredientId: 'ing_egg_whole', rawGrams: 100 },
      { ingredientId: 'ing_onion', rawGrams: 20 },
      { ingredientId: 'ing_tomato', rawGrams: 15 },
      { ingredientId: 'ing_refined_oil', rawGrams: 7 },
    ],
    'Scrambled eggs cooked with onions, green chillies, and Indian spices'
  ),

  composeDish(
    'dish_aloo_paratha',
    'Stuffed Aloo Paratha (with Butter)',
    ['breakfast'],
    'veg',
    '1 large paratha + 1 butter chiplet',
    140,
    'measured',
    [
      { ingredientId: 'ing_atta', rawGrams: 60 },
      { ingredientId: 'ing_potato', rawGrams: 50 },
      { ingredientId: 'ing_refined_oil', rawGrams: 8 },
      { ingredientId: 'ing_butter', rawGrams: 10 },
    ],
    'Whole wheat flatbread stuffed with spiced mashed potatoes, griddled with butter'
  ),

  composeDish(
    'dish_mess_chai',
    'Hostel Kadak Chai',
    ['breakfast', 'snacks'],
    'veg',
    '1 standard mess steel glass (~150ml)',
    150,
    'measured',
    [
      { ingredientId: 'ing_milk_toned', rawGrams: 90 },
      { ingredientId: 'ing_sugar', rawGrams: 8 },
    ],
    'Cardamom ginger milk tea'
  ),

  // ==================== BREADS & GRAINS (LUNCH & DINNER) ====================
  composeDish(
    'dish_tawa_roti_pair',
    'Fresh Tawa Roti (Pair / 2 Rotis)',
    ['lunch', 'dinner'],
    'veg',
    '2 medium plain phulkas (~60g)',
    60,
    'measured',
    [{ ingredientId: 'ing_atta', rawGrams: 60 }],
    '100% whole wheat tawa-cooked rotis with zero added oil'
  ),

  composeDish(
    'dish_steamed_rice',
    'Steamed White Rice',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess ladle (~150g cooked)',
    150,
    'measured',
    [{ ingredientId: 'ing_rice_raw', rawGrams: 50 }],
    'Steamed long grain white rice'
  ),

  composeDish(
    'dish_jeera_rice',
    'Tadka Jeera Rice',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess ladle (~160g cooked)',
    160,
    'estimated',
    [
      { ingredientId: 'ing_rice_raw', rawGrams: 50 },
      { ingredientId: 'ing_ghee', rawGrams: 4 },
    ],
    'Basmati rice tempered with roasted cumin seeds and desi ghee'
  ),

  // ==================== DALS & LEGUMES ====================
  composeDish(
    'dish_toor_dal_tadka',
    'Home-style Dal Tadka (Yellow Dal)',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess ladle (~150ml)',
    150,
    'measured',
    [
      { ingredientId: 'ing_toor_dal', rawGrams: 30 },
      { ingredientId: 'ing_onion', rawGrams: 12 },
      { ingredientId: 'ing_tomato', rawGrams: 15 },
      { ingredientId: 'ing_refined_oil', rawGrams: 5 },
    ],
    'Slow-simmered arhar dal tempered with garlic, cumin, and mustard seeds'
  ),

  composeDish(
    'dish_moong_dal_fry',
    'Moong Dal Fry',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess ladle (~150ml)',
    150,
    'measured',
    [
      { ingredientId: 'ing_moong_dal', rawGrams: 32 },
      { ingredientId: 'ing_tomato', rawGrams: 15 },
      { ingredientId: 'ing_refined_oil', rawGrams: 4 },
    ],
    'Easy to digest yellow moong dal, light on stomach and rich in clean protein'
  ),

  composeDish(
    'dish_rajma_masala',
    'Punjabi Rajma Masala',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess ladle (~160g)',
    160,
    'measured',
    [
      { ingredientId: 'ing_rajma', rawGrams: 40 },
      { ingredientId: 'ing_onion', rawGrams: 20 },
      { ingredientId: 'ing_tomato', rawGrams: 25 },
      { ingredientId: 'ing_refined_oil', rawGrams: 6 },
    ],
    'Red kidney beans slow cooked in rich onion-tomato gravy'
  ),

  composeDish(
    'dish_chana_masala',
    'Pindi Chana / Chole',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess ladle (~160g)',
    160,
    'measured',
    [
      { ingredientId: 'ing_kabuli_chana', rawGrams: 42 },
      { ingredientId: 'ing_onion', rawGrams: 20 },
      { ingredientId: 'ing_tomato', rawGrams: 20 },
      { ingredientId: 'ing_refined_oil', rawGrams: 7 },
    ],
    'Spiced kabuli chana curry with balanced fiber and slow-burning complex carbs'
  ),

  composeDish(
    'dish_dal_makhani',
    'Rich Dal Makhani',
    ['dinner'],
    'veg',
    '1 standard mess ladle (~150ml)',
    150,
    'estimated',
    [
      { ingredientId: 'ing_urad_dal', rawGrams: 35 },
      { ingredientId: 'ing_rajma', rawGrams: 10 },
      { ingredientId: 'ing_butter', rawGrams: 12 },
      { ingredientId: 'ing_tomato', rawGrams: 20 },
    ],
    'Black lentils and red kidney beans simmered overnight with butter and cream'
  ),

  composeDish(
    'dish_kadhi_pakora',
    'Besan Kadhi with Pakora',
    ['lunch'],
    'veg',
    '1 standard mess ladle (~150ml)',
    150,
    'estimated',
    [
      { ingredientId: 'ing_curd', rawGrams: 40 },
      { ingredientId: 'ing_besan', rawGrams: 25 },
      { ingredientId: 'ing_refined_oil', rawGrams: 8 },
    ],
    'Tangy yogurt-based gram flour curry with crispy onion pakoras'
  ),

  // ==================== HIGH PROTEIN MAINS ====================
  composeDish(
    'dish_paneer_bhurji',
    'Mess Paneer Bhurji / Matar Paneer',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess katori (~140g)',
    140,
    'measured',
    [
      { ingredientId: 'ing_paneer', rawGrams: 65 },
      { ingredientId: 'ing_green_peas', rawGrams: 20 },
      { ingredientId: 'ing_onion', rawGrams: 15 },
      { ingredientId: 'ing_tomato', rawGrams: 15 },
      { ingredientId: 'ing_refined_oil', rawGrams: 6 },
    ],
    'Crumbled cottage cheese sautéed with peas, onions, and garam masala'
  ),

  composeDish(
    'dish_soya_chunks_curry',
    'High-Protein Soya Badi Curry',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess bowl (~150g)',
    150,
    'measured',
    [
      { ingredientId: 'ing_soya_chunks', rawGrams: 40 },
      { ingredientId: 'ing_potato', rawGrams: 25 },
      { ingredientId: 'ing_onion', rawGrams: 15 },
      { ingredientId: 'ing_tomato', rawGrams: 15 },
      { ingredientId: 'ing_refined_oil', rawGrams: 6 },
    ],
    'Max-protein vegetarian power pick: 21g+ protein from textured soy chunks'
  ),

  composeDish(
    'dish_chicken_curry',
    'Home-style Chicken Curry (2 pcs)',
    ['lunch', 'dinner'],
    'non-veg',
    '2 pieces chicken + gravy (~180g)',
    180,
    'measured',
    [
      { ingredientId: 'ing_chicken_curry_cut', rawGrams: 90 },
      { ingredientId: 'ing_onion', rawGrams: 25 },
      { ingredientId: 'ing_tomato', rawGrams: 20 },
      { ingredientId: 'ing_refined_oil', rawGrams: 8 },
    ],
    'Mess special tender bone-in chicken braised in rustic onion tomato gravy'
  ),

  composeDish(
    'dish_egg_curry',
    'Dhaba-style Double Egg Curry',
    ['lunch', 'dinner'],
    'egg',
    '2 whole eggs in thick gravy (~170g)',
    170,
    'measured',
    [
      { ingredientId: 'ing_egg_whole', rawGrams: 100 },
      { ingredientId: 'ing_onion', rawGrams: 20 },
      { ingredientId: 'ing_tomato', rawGrams: 20 },
      { ingredientId: 'ing_refined_oil', rawGrams: 7 },
    ],
    'Two hard-boiled eggs pan-fried and simmered in aromatic masala gravy'
  ),

  // ==================== VEGETABLE SIDES (SUBZIS) ====================
  composeDish(
    'dish_aloo_gobi',
    'Aloo Phool Gobi Sukhi Subzi',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess katori (~120g)',
    120,
    'measured',
    [
      { ingredientId: 'ing_cauliflower', rawGrams: 60 },
      { ingredientId: 'ing_potato', rawGrams: 40 },
      { ingredientId: 'ing_refined_oil', rawGrams: 6 },
    ],
    'Homestyle dry curry of cauliflower florets and tender potato cubes'
  ),

  composeDish(
    'dish_bhindi_masala',
    'Crispy Bhindi Masala',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess katori (~110g)',
    110,
    'measured',
    [
      { ingredientId: 'ing_bhindi', rawGrams: 75 },
      { ingredientId: 'ing_onion', rawGrams: 20 },
      { ingredientId: 'ing_refined_oil', rawGrams: 7 },
    ],
    'Spiced okra stir fry with onions and dry mango powder'
  ),

  composeDish(
    'dish_lauki_chana_dal',
    'Lauki Chana Dal Subzi',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess katori (~140g)',
    140,
    'estimated',
    [
      { ingredientId: 'ing_lauki', rawGrams: 70 },
      { ingredientId: 'ing_chana_dal', rawGrams: 20 },
      { ingredientId: 'ing_refined_oil', rawGrams: 4 },
    ],
    'Low calorie, high fiber bottle gourd cooked with Bengal gram'
  ),

  composeDish(
    'dish_palak_paneer',
    'Green Palak Paneer Curry',
    ['lunch', 'dinner'],
    'veg',
    '1 standard mess bowl (~150g)',
    150,
    'measured',
    [
      { ingredientId: 'ing_spinach', rawGrams: 80 },
      { ingredientId: 'ing_paneer', rawGrams: 55 },
      { ingredientId: 'ing_refined_oil', rawGrams: 6 },
    ],
    'Vibrant spinach gravy loaded with iron and fresh cottage cheese cubes'
  ),

  composeDish(
    'dish_mess_curd',
    'Fresh Mess Curd / Dahi',
    ['lunch', 'dinner'],
    'veg',
    '1 standard steel katori (~100g)',
    100,
    'measured',
    [{ ingredientId: 'ing_curd', rawGrams: 100 }],
    'Probiotic rich fresh set dahi, aids digestion and cools the palate'
  ),

  // ==================== EVENING SNACKS ====================
  composeDish(
    'dish_samosa',
    'Mess Fried Aloo Samosa (1 pc)',
    ['snacks'],
    'veg',
    '1 large crispy samosa (~90g)',
    90,
    'estimated',
    [
      { ingredientId: 'ing_maida', rawGrams: 35 },
      { ingredientId: 'ing_potato', rawGrams: 40 },
      { ingredientId: 'ing_refined_oil', rawGrams: 15 },
    ],
    'Deep fried pastry filled with spiced potato and peas (high calorie snack)'
  ),

  composeDish(
    'dish_bread_butter',
    'Toasted Bread with Butter (Pair)',
    ['breakfast', 'snacks'],
    'veg',
    '2 toasted slices + butter chiplet',
    70,
    'measured',
    [
      { ingredientId: 'ing_maida', rawGrams: 50 },
      { ingredientId: 'ing_butter', rawGrams: 10 },
    ],
    'Hostel staple evening quick bite'
  ),

  // ==================== VIT-AP EXPANDED DISHES (VEG, NON-VEG & SPECIAL) ====================
  createMessDish(
    'dish_multigrain_dosa',
    "Multi Grain Dosa (2 Pcs Thin)",
    ["breakfast"],
    'veg',
    "2 thin dosas (~140g)",
    140,
    'measured',
    { calories: 230, protein: 6.2, carbs: 38.0, fat: 5.5, fiber: 4.8 },
    [],
    "Crispy thin multi-grain fermented crepe rich in dietary fiber and complex grains"
  ),
  createMessDish(
    'dish_pav_bhaji',
    "Mess Pav Bhaji (2 Pavs + Bhaji)",
    ["breakfast", "snacks"],
    'veg',
    "2 toasted pavs + 1 ladle bhaji (~220g)",
    220,
    'measured',
    { calories: 340, protein: 7.5, carbs: 52.0, fat: 11.0, fiber: 5.2 },
    ["dairy", "gluten"],
    "Spiced mashed mixed vegetable gravy served with lightly buttered pav rolls"
  ),
  createMessDish(
    'dish_coconut_chutney',
    "Fresh Coconut Chutney",
    ["breakfast", "lunch", "snacks", "dinner"],
    'veg',
    "1 small bowl (~40g)",
    40,
    'measured',
    { calories: 75, protein: 1.1, carbs: 2.8, fat: 6.8, fiber: 1.8 },
    [],
    "Freshly grated coconut tempered with mustard seeds, green chillies, and curry leaves"
  ),
  createMessDish(
    'dish_mint_chutney',
    "Green Mint & Coriander Chutney",
    ["breakfast", "snacks"],
    'veg',
    "2 tablespoons (~35g)",
    35,
    'measured',
    { calories: 25, protein: 0.8, carbs: 3.5, fat: 0.6, fiber: 1.2 },
    [],
    "Tangy refreshing mint-coriander dip with green chillies and lemon"
  ),
  createMessDish(
    'dish_tomato_chutney',
    "South Indian Tomato Chutney",
    ["breakfast", "snacks"],
    'veg',
    "2 tablespoons (~40g)",
    40,
    'measured',
    { calories: 38, protein: 0.9, carbs: 5.2, fat: 1.5, fiber: 1.1 },
    [],
    "Warm braised tomato relish with chana dal tempering"
  ),
  createMessDish(
    'dish_peanut_chutney',
    "Andhra Groundnut / Peanut Chutney",
    ["breakfast", "snacks"],
    'veg',
    "2 tablespoons (~45g)",
    45,
    'measured',
    { calories: 120, protein: 4.8, carbs: 4.2, fat: 9.5, fiber: 1.6 },
    ["nuts"],
    "Nutty, protein-dense roasted peanut chutney tempered with cumin and curry leaves"
  ),
  createMessDish(
    'dish_medu_vada',
    "Crispy Medu Vada (3 Pcs)",
    ["breakfast"],
    'veg',
    "3 medium vadas (~120g)",
    120,
    'measured',
    { calories: 290, protein: 9.2, carbs: 32.0, fat: 14.0, fiber: 4.0 },
    [],
    "Golden fried urad dal savory fritters crispy on the outside, fluffy inside"
  ),
  createMessDish(
    'dish_moong_dal_palak_thepla',
    "Moong Dal Palak Thepla (2 Pcs)",
    ["breakfast"],
    'veg',
    "2 medium theplas (~90g)",
    90,
    'measured',
    { calories: 210, protein: 6.5, carbs: 32.0, fat: 6.2, fiber: 3.8 },
    ["gluten"],
    "Handmade whole wheat thepla kneaded with spinach puree and yellow moong dal flour"
  ),
  createMessDish(
    'dish_poori_serving',
    "Golden Fried Poori (3 Pcs)",
    ["breakfast"],
    'veg',
    "3 hot pooris (~110g)",
    110,
    'measured',
    { calories: 310, protein: 5.8, carbs: 38.0, fat: 15.0, fiber: 2.2 },
    ["gluten"],
    "Deep-fried puffy whole wheat pooris, classic hostel breakfast treat"
  ),
  createMessDish(
    'dish_lemon_sevai',
    "Tangy Lemon Rice Sevai",
    ["breakfast"],
    'veg',
    "1 regular bowl (~150g)",
    150,
    'measured',
    { calories: 220, protein: 3.8, carbs: 42.0, fat: 4.2, fiber: 1.8 },
    ["nuts"],
    "Rice vermicelli tossed with fresh lemon juice, turmeric, crunchy peanuts, and mustard seeds"
  ),
  createMessDish(
    'dish_aloo_mutter_curry',
    "Aloo Mutter Curry",
    ["breakfast", "dinner"],
    'veg',
    "1 standard mess ladle (~140g)",
    140,
    'measured',
    { calories: 145, protein: 4.0, carbs: 22.0, fat: 4.8, fiber: 3.5 },
    [],
    "Tender potatoes and green peas simmered in a spiced onion tomato gravy"
  ),
  createMessDish(
    'dish_masala_onion_omelet',
    "Masala Onion Double Omelet",
    ["breakfast"],
    'egg',
    "2-egg fluffy omelet (~110g)",
    110,
    'measured',
    { calories: 185, protein: 13.0, carbs: 2.5, fat: 13.5, fiber: 0.5 },
    ["eggs"],
    "Whisked whole eggs cooked with diced onions, green chillies, and fresh coriander"
  ),
  createMessDish(
    'dish_scrambled_egg',
    "Mess Fresh Scrambled Egg",
    ["breakfast"],
    'egg',
    "1 portion (~90g)",
    90,
    'measured',
    { calories: 155, protein: 11.5, carbs: 1.5, fat: 11.5, fiber: 0 },
    ["eggs"],
    "Soft scrambled farm fresh eggs lightly seasoned with black pepper and salt"
  ),
  createMessDish(
    'dish_uggani_mirchi_bajji',
    "Rayalaseema Uggani + Mirchi Bajji",
    ["breakfast"],
    'veg',
    "1 plate uggani (~150g) + 1 mirchi bajji (~60g)",
    210,
    'measured',
    { calories: 360, protein: 8.5, carbs: 54.0, fat: 12.5, fiber: 4.2 },
    ["nuts"],
    "Authentic puffed rice upma with roasted gram powder, served with crispy stuffed chilli bajji"
  ),
  createMessDish(
    'dish_methi_roti_pair',
    "Fresh Methi Roti (Pair / 2 Pcs)",
    ["breakfast", "dinner"],
    'veg',
    "2 thin rotis (~70g)",
    70,
    'measured',
    { calories: 180, protein: 5.5, carbs: 32.0, fat: 3.5, fiber: 4.2 },
    ["gluten"],
    "Handmade whole wheat flatbreads folded with fresh fenugreek leaves and mild ajwain"
  ),
  createMessDish(
    'dish_green_peas_tomato_sabji',
    "Green Peas & Tomato Sabji",
    ["breakfast"],
    'veg',
    "1 standard mess ladle (~130g)",
    130,
    'measured',
    { calories: 125, protein: 4.8, carbs: 18.0, fat: 3.8, fiber: 4.2 },
    [],
    "Sweet green peas braised with juicy ripe tomatoes and aromatic ground spices"
  ),
  createMessDish(
    'dish_onion_carrot_uttapam',
    "Onion & Carrot Uttapam (2 Pcs)",
    ["breakfast"],
    'veg',
    "2 medium uttapams (~160g)",
    160,
    'measured',
    { calories: 245, protein: 6.2, carbs: 42.0, fat: 5.8, fiber: 3.2 },
    [],
    "Thick fermented rice-lentil pancake topped with diced red onions and grated carrots"
  ),
  createMessDish(
    'dish_vegetable_poha',
    "Vegetable Poha with Green Peas",
    ["breakfast"],
    'veg',
    "1 regular bowl (~150g)",
    150,
    'measured',
    { calories: 235, protein: 5.4, carbs: 42.0, fat: 5.2, fiber: 3.8 },
    ["nuts"],
    "Beaten rice flakes tossed with turmeric, mustard seeds, carrots, peas, and roasted peanuts"
  ),
  createMessDish(
    'dish_shavige_bath',
    "Karnataka Style Shavige Bath",
    ["breakfast"],
    'veg',
    "1 regular bowl (~150g)",
    150,
    'measured',
    { calories: 230, protein: 4.2, carbs: 44.0, fat: 4.2, fiber: 2.5 },
    ["nuts"],
    "Spiced roasted vermicelli cooked with crunchy vegetables, peanuts, and lemon twist"
  ),
  createMessDish(
    'dish_paneer_paratha_pair',
    "Stuffed Paneer Paratha (2 Pcs)",
    ["breakfast"],
    'veg',
    "2 thin parathas (~150g)",
    150,
    'measured',
    { calories: 330, protein: 13.5, carbs: 38.0, fat: 13.8, fiber: 4.0 },
    ["dairy", "gluten"],
    "Whole wheat flatbread generously stuffed with grated fresh cottage cheese, cumin, and coriander"
  ),
  createMessDish(
    'dish_carrot_idli',
    "Steamed Carrot Idli (3 Pcs)",
    ["breakfast"],
    'veg',
    "3 medium idlis (~140g)",
    140,
    'measured',
    { calories: 175, protein: 5.8, carbs: 34.0, fat: 1.2, fiber: 2.8 },
    [],
    "Fermented rice and urad dal steamed cakes infused with finely shredded juicy carrots"
  ),
  createMessDish(
    'dish_bhature_pair',
    "Crispy Puffy Bhature (2 Pcs)",
    ["breakfast"],
    'veg',
    "2 large bhaturas (~130g)",
    130,
    'measured',
    { calories: 370, protein: 7.2, carbs: 46.0, fat: 17.5, fiber: 1.8 },
    ["gluten", "dairy"],
    "Golden deep-fried leavened flatbreads, perfect accompaniment to spicy chole curry"
  ),
  createMessDish(
    'dish_onion_dosa',
    "Crisp Onion Dosa (2 Pcs)",
    ["breakfast"],
    'veg',
    "2 dosas (~140g)",
    140,
    'measured',
    { calories: 235, protein: 5.8, carbs: 40.0, fat: 5.8, fiber: 2.5 },
    [],
    "Crispy fermented rice and lentil crepe sprinkled with golden caramelized finely chopped onions"
  ),
  createMessDish(
    'dish_vada_pav',
    "Mumbai Vada Pav (1 Pc / 2 Pcs)",
    ["breakfast", "snacks"],
    'veg',
    "1 stuffed pav with batata vada (~120g)",
    120,
    'measured',
    { calories: 290, protein: 6.0, carbs: 42.0, fat: 11.0, fiber: 3.2 },
    ["gluten"],
    "Spiced golden potato fritter tucked into a soft bun with dry garlic chutney"
  ),
  createMessDish(
    'dish_onion_rava_bonda',
    "Crisp Onion Rava Bonda (3 Pcs)",
    ["breakfast"],
    'veg',
    "3 medium bondas (~120g)",
    120,
    'measured',
    { calories: 285, protein: 5.5, carbs: 36.0, fat: 13.5, fiber: 2.2 },
    ["gluten"],
    "Crunchy semolina dumplings studded with onions, green chillies, ginger, and curry leaves"
  ),
  createMessDish(
    'dish_cucumber_poha',
    "Refreshing Cucumber Poha",
    ["breakfast"],
    'veg',
    "1 regular bowl (~150g)",
    150,
    'measured',
    { calories: 215, protein: 4.2, carbs: 40.0, fat: 4.5, fiber: 2.8 },
    ["nuts"],
    "Light tempered flattened rice tossed with grated fresh cucumber, green chillies, and coconut"
  ),
  createMessDish(
    'dish_tomato_suji_upma',
    "Zesty Tomato Suji Upma",
    ["breakfast"],
    'veg',
    "1 regular bowl (~150g)",
    150,
    'measured',
    { calories: 210, protein: 4.6, carbs: 38.0, fat: 4.4, fiber: 2.5 },
    ["gluten", "nuts"],
    "Warm roasted semolina cooked with tangy tomatoes, onions, mustard seeds, and curry leaves"
  ),
  createMessDish(
    'dish_aloo_basin_chutney',
    "Aloo Besan Bombay Chutney",
    ["breakfast"],
    'veg',
    "1 ladle (~100g)",
    100,
    'measured',
    { calories: 95, protein: 3.2, carbs: 14.0, fat: 2.8, fiber: 1.8 },
    [],
    "Silky gram-flour and potato gravy with ginger and mustard, traditional accompaniment for poori"
  ),
  createMessDish(
    'dish_pudina_chapathi_pair',
    "Handmade Pudina Chapathi (Pair / 2 Pcs)",
    ["breakfast", "dinner"],
    'veg',
    "2 chapathis (~70g)",
    70,
    'measured',
    { calories: 175, protein: 5.2, carbs: 33.0, fat: 3.0, fiber: 4.0 },
    ["gluten"],
    "Aromatic whole wheat chapathis infused with fresh minced garden mint leaves"
  ),
  createMessDish(
    'dish_dal_chutney',
    "Roasted Gram Dal Chutney (Pappula Chutney)",
    ["breakfast", "dinner"],
    'veg',
    "2 tablespoons (~40g)",
    40,
    'measured',
    { calories: 85, protein: 3.8, carbs: 9.0, fat: 3.8, fiber: 2.0 },
    [],
    "Andhra-style roasted chana dal chutney blended with green chillies, garlic, and cumin"
  ),
  createMessDish(
    'dish_masala_ghee_roast_dosa',
    "Masala Ghee Roast Dosa (2 Pcs)",
    ["breakfast"],
    'veg',
    "2 dosas (~160g)",
    160,
    'measured',
    { calories: 285, protein: 6.2, carbs: 42.0, fat: 10.5, fiber: 3.0 },
    ["dairy"],
    "Crispy golden dosas roasted in fragrant desi ghee and stuffed with spiced potato masala"
  ),
  createMessDish(
    'dish_veg_moong_dal_khichdi',
    "Nutritious Vegetable Moong Dal Khichdi",
    ["breakfast"],
    'veg',
    "1 regular bowl (~180g)",
    180,
    'measured',
    { calories: 235, protein: 8.5, carbs: 40.0, fat: 4.5, fiber: 4.2 },
    [],
    "Comforting slow-cooked rice and yellow split lentils with carrots, beans, and ghee cumin tadka"
  ),
  createMessDish(
    'dish_coconut_sevai',
    "South Indian Coconut Sevai",
    ["breakfast"],
    'veg',
    "1 regular bowl (~150g)",
    150,
    'measured',
    { calories: 245, protein: 3.6, carbs: 42.0, fat: 7.2, fiber: 2.8 },
    [],
    "Delicate rice vermicelli tossed with freshly grated coconut, crunchy urad dal, and curry leaves"
  ),
  createMessDish(
    'dish_konaseema_pottikkalu',
    "Konaseema Pottikkalu / Spiced Idli Upma",
    ["breakfast"],
    'veg',
    "1 serving (~150g)",
    150,
    'measured',
    { calories: 210, protein: 6.0, carbs: 38.0, fat: 3.8, fiber: 3.2 },
    [],
    "Traditional Godavari jackfruit leaf steamed idlis or tempered crumbled idli upma"
  ),
  createMessDish(
    'dish_sprouts_cup',
    "Fresh Moong & Chana Sprouts (1 Cup)",
    ["breakfast"],
    'veg',
    "1 small mess cup (~60g)",
    60,
    'measured',
    { calories: 55, protein: 4.8, carbs: 8.5, fat: 0.4, fiber: 3.2 },
    [],
    "Crisp sprouted green gram and black chickpeas packed with living enzymes and lean protein"
  ),
  createMessDish(
    'dish_amaranthus_dal',
    "Thotakura Pappu (Amaranthus Leaves Dal)",
    ["lunch", "dinner"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 140, protein: 7.8, carbs: 19.5, fat: 3.5, fiber: 4.8 },
    [],
    "Toor dal simmered with iron-rich fresh amaranth leaves, garlic, and cumin tempering"
  ),
  createMessDish(
    'dish_gongura_dal',
    "Andhra Gongura Pappu (Sorrel Leaves Dal)",
    ["lunch"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 145, protein: 8.2, carbs: 20.0, fat: 3.6, fiber: 5.0 },
    [],
    "Signature tangy Andhra dal prepared with fresh sorrel leaves, green chillies, and garlic"
  ),
  createMessDish(
    'dish_ridge_gourd_dal',
    "Beerakaya Pappu (Ridge Gourd Dal)",
    ["lunch"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 130, protein: 7.2, carbs: 18.5, fat: 3.2, fiber: 4.2 },
    [],
    "Cooling tender ridge gourd cooked with yellow lentils, lightly spiced and easy on the gut"
  ),
  createMessDish(
    'dish_mudda_pappu',
    "Traditional Andhra Mudda Pappu",
    ["lunch"],
    'veg',
    "1 ladle thick cooked dal (~120g)",
    120,
    'measured',
    { calories: 160, protein: 10.5, carbs: 22.0, fat: 3.0, fiber: 5.5 },
    [],
    "Pure, thick-boiled toor dal seasoned with sea salt; authentic pairing for hot rice, ghee, and avakaya"
  ),
  createMessDish(
    'dish_palak_dal',
    "Palakura Pappu (Spinach Toor Dal)",
    ["lunch"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 135, protein: 7.9, carbs: 19.0, fat: 3.2, fiber: 4.5 },
    [],
    "Wholesome toor dal simmered with leafy green spinach, garlic cloves, and mustard seeds"
  ),
  createMessDish(
    'dish_mango_dal',
    "Mamidikaya Pappu (Raw Mango Dal)",
    ["dinner"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 140, protein: 7.4, carbs: 21.0, fat: 3.2, fiber: 4.2 },
    [],
    "Tangy raw mango chunks cooked into tender yellow lentils with mustard and curry leaves"
  ),
  createMessDish(
    'dish_pesara_pappu',
    "Pesara Pappu (Yellow Moong Dal)",
    ["dinner"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 125, protein: 8.4, carbs: 18.0, fat: 2.5, fiber: 4.5 },
    [],
    "Light, easily digestible yellow split moong dal cooked with gentle cumin and turmeric"
  ),
  createMessDish(
    'dish_tomato_dal',
    "Tomato Pappu (Homestyle Tomato Dal)",
    ["dinner"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 135, protein: 7.5, carbs: 20.0, fat: 3.0, fiber: 4.0 },
    [],
    "Comforting Andhra tomato dal tempered with red chillies, mustard, and fragrant hing"
  ),
  createMessDish(
    'dish_dal_maharani',
    "Royal Dal Maharani",
    ["dinner"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 195, protein: 8.5, carbs: 24.0, fat: 7.5, fiber: 5.5 },
    ["dairy"],
    "Rich slow-simmered blend of black urad, rajma, and chana dal finished with a touch of fresh cream"
  ),
  createMessDish(
    'dish_beetroot_tomato_rasam',
    "Beetroot Tomato Pepper Rasam",
    ["lunch", "dinner"],
    'veg',
    "1 katori / ladle (~120g)",
    120,
    'measured',
    { calories: 45, protein: 1.5, carbs: 8.5, fat: 0.8, fiber: 1.5 },
    [],
    "Ruby-red antioxidant rich broth brewed with fresh beet extract, ripe tomatoes, and crushed black pepper"
  ),
  createMessDish(
    'dish_mess_rasam',
    "Classic South Indian Charu / Rasam",
    ["lunch", "dinner"],
    'veg',
    "1 katori / ladle (~120g)",
    120,
    'measured',
    { calories: 35, protein: 1.2, carbs: 6.5, fat: 0.6, fiber: 1.0 },
    [],
    "Digestive soup infused with tamarind, crushed cumin, black pepper, garlic, and fresh coriander"
  ),
  createMessDish(
    'dish_pachi_pulusu',
    "Telangana Raw Tamarind Pachi Pulusu",
    ["lunch"],
    'veg',
    "1 katori (~100g)",
    100,
    'measured',
    { calories: 40, protein: 0.8, carbs: 8.2, fat: 0.8, fiber: 0.9 },
    [],
    "Uncooked seasoned tamarind stew with charred chillies, raw onions, and jaggery note"
  ),
  createMessDish(
    'dish_majiga_pulusu',
    "Andhra Majjiga Pulusu (Spiced Buttermilk Stew)",
    ["lunch"],
    'veg',
    "1 standard mess ladle (~140g)",
    140,
    'measured',
    { calories: 85, protein: 3.5, carbs: 7.2, fat: 4.8, fiber: 1.2 },
    ["dairy"],
    "Warm spiced sour curd curry simmered with bottle gourd/ash gourd and ginger-chilli paste"
  ),
  createMessDish(
    'dish_bachali_kura_pulusu',
    "Bachali Kura Pulusu (Malabar Spinach Stew)",
    ["dinner"],
    'veg',
    "1 standard mess ladle (~140g)",
    140,
    'measured',
    { calories: 90, protein: 3.2, carbs: 12.5, fat: 3.0, fiber: 3.5 },
    [],
    "Nutritious Malabar spinach simmered in tangy tamarind broth with fenugreek and mustard"
  ),
  createMessDish(
    'dish_mess_sambar',
    "Mess Vegetable Drumstick Sambar",
    ["breakfast", "lunch", "dinner"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 95, protein: 4.5, carbs: 14.5, fat: 2.2, fiber: 3.5 },
    [],
    "Aromatic lentil stew cooked with drumsticks, pumpkin, tomatoes, and freshly ground sambar masala"
  ),
  createMessDish(
    'dish_chicken_dum_biryani',
    "Hyderabadi Chicken Dum Biryani",
    ["lunch"],
    'non-veg',
    "1 plate biryani with 150g cooked chicken piece (~350g)",
    350,
    'measured',
    { calories: 540, protein: 32.5, carbs: 62.0, fat: 17.5, fiber: 3.8 },
    ["dairy"],
    "Fragrant long-grain basmati dum biryani layered with marinated chicken (150g) and saffron aroma"
  ),
  createMessDish(
    'dish_paneer_dum_biryani',
    "Shahi Paneer Dum Biryani (Veg)",
    ["lunch"],
    'veg',
    "1 plate biryani with 75g cottage cheese (~320g)",
    320,
    'measured',
    { calories: 480, protein: 18.5, carbs: 64.0, fat: 16.0, fiber: 4.2 },
    ["dairy"],
    "Rich basmati rice slow-cooked on dum with spiced golden paneer cubes, mint, and caramelized onions"
  ),
  createMessDish(
    'dish_andhra_chicken_fry',
    "Andhra Style Chicken Vepudu (150g)",
    ["lunch"],
    'non-veg',
    "1 serving (~150g cooked chicken)",
    150,
    'measured',
    { calories: 290, protein: 34.0, carbs: 6.0, fat: 14.5, fiber: 1.5 },
    [],
    "Spicy dry roast chicken tossed with curry leaves, crushed black pepper, and roasted garlic"
  ),
  createMessDish(
    'dish_masala_fish_fry',
    "Coastal Masala Fish Fry (120g)",
    ["lunch"],
    'non-veg',
    "1 fillet (~120g cooked fish)",
    120,
    'measured',
    { calories: 220, protein: 26.0, carbs: 4.5, fat: 10.5, fiber: 0.5 },
    ["fish"],
    "Tava fried marinated fish fillet coated with turmeric, red chilli, and carom seeds"
  ),
  createMessDish(
    'dish_kaju_tomato_paneer',
    "Kaju Tomato Paneer Boiled Fry",
    ["lunch"],
    'veg',
    "1 standard mess bowl (~150g)",
    150,
    'measured',
    { calories: 275, protein: 14.0, carbs: 11.5, fat: 19.5, fiber: 2.2 },
    ["dairy", "nuts"],
    "Cottage cheese and cashews saut\u00e9ed in a tangy spiced tomato base"
  ),
  createMessDish(
    'dish_stir_fry_chicken_masala',
    "Lean Boiled Stir Fry Chicken Masala (Dry, 150g)",
    ["lunch"],
    'non-veg',
    "1 portion (~150g cooked)",
    150,
    'measured',
    { calories: 260, protein: 35.5, carbs: 4.2, fat: 11.0, fiber: 1.2 },
    [],
    "High-protein lean chicken breast cubes boiled and flash-saut\u00e9ed with black pepper, capsicum, and herbs"
  ),
  createMessDish(
    'dish_stir_fry_paneer_masala',
    "Stir Fry Paneer Masala (Dry, 75g)",
    ["lunch"],
    'veg',
    "1 portion (~120g with veggies)",
    120,
    'measured',
    { calories: 240, protein: 15.2, carbs: 6.8, fat: 17.0, fiber: 1.8 },
    ["dairy"],
    "Fresh cottage cheese cubes saut\u00e9ed with crunchy capsicum, onions, and dry roasted spices"
  ),
  createMessDish(
    'dish_telangana_chicken_curry',
    "Telangana Country Chicken Curry (150g)",
    ["dinner"],
    'non-veg',
    "150g chicken in spiced gravy (~220g)",
    220,
    'measured',
    { calories: 310, protein: 33.0, carbs: 7.5, fat: 16.5, fiber: 2.0 },
    [],
    "Rustic spicy curry prepared with poppy seeds, dry coconut paste, and stone-ground spices"
  ),
  createMessDish(
    'dish_chettinad_chicken_curry',
    "Chettinad Pepper Chicken Curry (150g)",
    ["dinner"],
    'non-veg',
    "150g chicken in gravy (~220g)",
    220,
    'measured',
    { calories: 305, protein: 33.5, carbs: 8.0, fat: 15.5, fiber: 2.2 },
    [],
    "Aromatic South Indian chicken braised with kalpasi, star anise, black pepper, and roasted spices"
  ),
  createMessDish(
    'dish_kadai_chicken',
    "Dhaba Kadai Chicken (150g)",
    ["dinner"],
    'non-veg',
    "150g chicken with peppers (~220g)",
    220,
    'measured',
    { calories: 320, protein: 34.0, carbs: 8.5, fat: 16.8, fiber: 2.0 },
    ["dairy"],
    "Tender chicken simmered in a thick wok gravy of crushed coriander seeds, Kashmiri chillies, and bell peppers"
  ),
  createMessDish(
    'dish_kadai_paneer',
    "Kadai Paneer Gravy (75g Paneer)",
    ["dinner"],
    'veg',
    "1 standard mess bowl (~180g)",
    180,
    'measured',
    { calories: 270, protein: 14.5, carbs: 10.5, fat: 19.0, fiber: 2.8 },
    ["dairy"],
    "Fresh cottage cheese cubes tossed with crunchy bell peppers in a rich freshly ground kadai spice masala"
  ),
  createMessDish(
    'dish_paneer_butter_masala',
    "Restaurant Style Paneer Butter Masala",
    ["dinner"],
    'veg',
    "1 standard mess bowl (~180g)",
    180,
    'measured',
    { calories: 295, protein: 14.0, carbs: 12.0, fat: 21.5, fiber: 2.2 },
    ["dairy", "nuts"],
    "Soft paneer cubes simmered in a creamy, velvety makhani gravy enriched with cashew paste"
  ),
  createMessDish(
    'dish_achari_paneer',
    "Zesty Achari Paneer",
    ["dinner"],
    'veg',
    "1 standard mess bowl (~170g)",
    170,
    'measured',
    { calories: 260, protein: 14.2, carbs: 9.5, fat: 18.5, fiber: 2.5 },
    ["dairy"],
    "Paneer cubes tossed in pickled spices including fennel, nigella, fenugreek, and mustard"
  ),
  createMessDish(
    'dish_paneer_pepper_fry',
    "Chettinad Paneer Pepper Fry",
    ["dinner"],
    'veg',
    "1 portion (~150g)",
    150,
    'measured',
    { calories: 275, protein: 15.0, carbs: 8.5, fat: 20.0, fiber: 2.0 },
    ["dairy"],
    "Pan-roasted paneer saut\u00e9ed with freshly cracked tellicherry black pepper, curry leaves, and onions"
  ),
  createMessDish(
    'dish_mirchi_ka_salan',
    "Hyderabadi Mirchi Ka Salan / Thick Gravy",
    ["lunch"],
    'veg',
    "1 small bowl (~100g)",
    100,
    'measured',
    { calories: 115, protein: 2.8, carbs: 8.5, fat: 8.2, fiber: 2.5 },
    ["nuts"],
    "Traditional rich sesame and peanut gravy with long green chillies; biryani side"
  ),
  createMessDish(
    'dish_onion_raita',
    "Creamy Onion Mint Raita",
    ["lunch"],
    'veg',
    "1 standard mess katori (~100g)",
    100,
    'measured',
    { calories: 65, protein: 3.4, carbs: 5.2, fat: 3.2, fiber: 0.8 },
    ["dairy"],
    "Chilled whisked yogurt with finely diced onions, green chillies, and roasted cumin"
  ),
  createMessDish(
    'dish_guthi_vankaya_curry',
    "Andhra Gutti Vankaya Koora (Stuffed Brinjal)",
    ["lunch"],
    'veg',
    "1 ladle / 2 small stuffed brinjals (~150g)",
    150,
    'measured',
    { calories: 180, protein: 4.8, carbs: 16.0, fat: 11.5, fiber: 5.2 },
    ["nuts"],
    "Baby brinjals stuffed with roasted peanut, sesame, and coriander paste simmered in gravy"
  ),
  createMessDish(
    'dish_kakarakaya_fry',
    "Crispy Kakarakaya Vepudu (Bitter Gourd Fry)",
    ["lunch"],
    'veg',
    "1 small bowl (~80g)",
    80,
    'measured',
    { calories: 120, protein: 2.8, carbs: 12.0, fat: 6.8, fiber: 4.2 },
    [],
    "Thinly sliced bitter gourd crisp-fried with onions, garlic, and roasted gram podi"
  ),
  createMessDish(
    'dish_dondakaya_stir_fry',
    "Dondakaya Vepudu (Ivy Gourd Stir Fry)",
    ["lunch", "dinner"],
    'veg',
    "1 standard bowl (~110g)",
    110,
    'measured',
    { calories: 115, protein: 2.6, carbs: 11.0, fat: 6.8, fiber: 3.8 },
    ["nuts"],
    "Tender tindora sliced and pan-fried with garlic and crushed peanut masala"
  ),
  createMessDish(
    'dish_raw_banana_fry',
    "Aratikaya Vepudu (Raw Banana Stir Fry)",
    ["lunch"],
    'veg',
    "1 standard bowl (~110g)",
    110,
    'measured',
    { calories: 140, protein: 2.2, carbs: 24.0, fat: 4.5, fiber: 3.6 },
    [],
    "Plantain cubes gently tempered with mustard, red chillies, and curry leaves"
  ),
  createMessDish(
    'dish_chole_soya_curry',
    "Chole Soya Chunks Masala Curry",
    ["lunch"],
    'veg',
    "1 standard mess ladle (~160g)",
    160,
    'measured',
    { calories: 195, protein: 14.5, carbs: 24.0, fat: 4.8, fiber: 6.8 },
    ["soy"],
    "High-protein combo of chickpeas and textured soya chunks simmered in spiced tomato gravy"
  ),
  createMessDish(
    'dish_kala_chana_masala',
    "Desi Kala Chana Masala Curry",
    ["lunch"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 185, protein: 9.8, carbs: 26.0, fat: 4.8, fiber: 7.2 },
    [],
    "Fiber and iron powerhouse black chickpeas cooked with cumin, ginger, and amchur"
  ),
  createMessDish(
    'dish_lobia_masala',
    "Lobia Masala (Cowpeas Curry)",
    ["lunch"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 175, protein: 10.2, carbs: 25.0, fat: 4.0, fiber: 6.5 },
    [],
    "Black-eyed peas braised in homestyle onion tomato masala"
  ),
  createMessDish(
    'dish_cluster_beans_masala',
    "Goruchikkudu Masala (Cluster Beans)",
    ["lunch"],
    'veg',
    "1 standard bowl (~120g)",
    120,
    'measured',
    { calories: 105, protein: 3.8, carbs: 12.0, fat: 4.8, fiber: 5.5 },
    [],
    "Tender fiber-dense cluster beans tempered with mustard and turmeric"
  ),
  createMessDish(
    'dish_pesara_punugulu_curry',
    "Pesara Punugula Pulusu (Andhra Special)",
    ["lunch"],
    'veg',
    "1 ladle with dumplings (~150g)",
    150,
    'measured',
    { calories: 195, protein: 8.8, carbs: 22.0, fat: 8.5, fiber: 4.0 },
    [],
    "Crispy green moong dal fritters simmered in authentic Andhra tangy tamarind curry"
  ),
  createMessDish(
    'dish_drumstick_tomato_masala',
    "Munakkaya Tomato Koora (Drumstick Curry)",
    ["lunch"],
    'veg',
    "1 standard ladle (~140g)",
    140,
    'measured',
    { calories: 110, protein: 3.2, carbs: 16.0, fat: 3.8, fiber: 4.8 },
    [],
    "Tender drumstick pods simmered in juicy spiced tomato onion reduction"
  ),
  createMessDish(
    'dish_andhra_potato_fry',
    "Bangaala Dumpa Vepudu (Andhra Potato Fry)",
    ["lunch"],
    'veg',
    "1 standard bowl (~110g)",
    110,
    'measured',
    { calories: 170, protein: 2.8, carbs: 26.0, fat: 6.5, fiber: 3.0 },
    [],
    "Golden crispy potato cubes roasted with garlic, chilli powder, and curry leaves"
  ),
  createMessDish(
    'dish_vegetable_jalfrezi',
    "Colourful Vegetable Jalfrezi",
    ["lunch"],
    'veg',
    "1 standard bowl (~140g)",
    140,
    'measured',
    { calories: 125, protein: 3.5, carbs: 16.0, fat: 5.2, fiber: 4.2 },
    [],
    "Stir-fried bell peppers, carrots, beans, and baby corn in a tangy spiced tomato base"
  ),
  createMessDish(
    'dish_cauliflower_fry',
    "Crisp Cauliflower Roast / Fry",
    ["lunch"],
    'veg',
    "1 standard bowl (~110g)",
    110,
    'measured',
    { calories: 130, protein: 3.6, carbs: 14.0, fat: 6.8, fiber: 3.8 },
    [],
    "Golden spiced cauliflower florets pan-roasted with curry leaves and ginger garlic"
  ),
  createMessDish(
    'dish_snake_gourd_poriyal',
    "Potlakaya Poriyal (Snake Gourd with Coconut)",
    ["dinner"],
    'veg',
    "1 standard bowl (~110g)",
    110,
    'measured',
    { calories: 85, protein: 2.2, carbs: 8.5, fat: 4.8, fiber: 3.2 },
    [],
    "Hydrating snake gourd gently steamed and tossed with grated coconut and mustard seeds"
  ),
  createMessDish(
    'dish_carrot_beans_poriyal',
    "South Indian Carrot Beans Poriyal",
    ["dinner"],
    'veg',
    "1 standard bowl (~110g)",
    110,
    'measured',
    { calories: 90, protein: 2.8, carbs: 11.0, fat: 4.0, fiber: 4.0 },
    [],
    "Finely diced crunchy carrots and green beans saut\u00e9ed with coconut and green chillies"
  ),
  createMessDish(
    'dish_cabbage_beans_poriyal',
    "Cabbage & Beans Poriyal",
    ["dinner"],
    'veg',
    "1 standard bowl (~110g)",
    110,
    'measured',
    { calories: 80, protein: 2.5, carbs: 9.5, fat: 3.8, fiber: 3.5 },
    [],
    "Shredded crisp cabbage and French beans tossed with urad dal and grated fresh coconut"
  ),
  createMessDish(
    'dish_tomato_baingan_masala',
    "Tomato Baingan Masala (Vankaya Tomato)",
    ["dinner"],
    'veg',
    "1 standard ladle (~140g)",
    140,
    'measured',
    { calories: 120, protein: 2.5, carbs: 15.0, fat: 5.8, fiber: 4.5 },
    [],
    "Melt-in-mouth eggplant braised with tangy tomatoes, onions, and Andhra curry powder"
  ),
  createMessDish(
    'dish_tomato_peas_capsicum',
    "Tomato Peas & Capsicum Masala",
    ["dinner"],
    'veg',
    "1 standard ladle (~140g)",
    140,
    'measured',
    { calories: 125, protein: 3.8, carbs: 16.0, fat: 5.2, fiber: 4.0 },
    [],
    "Crunchy bell peppers and sweet green peas braised in a fragrant rich tomato gravy"
  ),
  createMessDish(
    'dish_arbi_gravy',
    "Arbi Masala Gravy (Colocasia)",
    ["dinner"],
    'veg',
    "1 standard ladle (~140g)",
    140,
    'measured',
    { calories: 155, protein: 2.5, carbs: 24.0, fat: 5.5, fiber: 4.5 },
    [],
    "Tender taro root simmered with carom seeds (ajwain), dry mango, and roasted spices"
  ),
  createMessDish(
    'dish_vegetable_kurma',
    "South Indian Vegetable Kurma",
    ["dinner"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 145, protein: 3.8, carbs: 16.0, fat: 7.5, fiber: 4.0 },
    ["nuts"],
    "Mixed vegetables stewed in a mildly spiced coconut, poppy seed, and fennel paste gravy"
  ),
  createMessDish(
    'dish_vegetable_kolhapuri',
    "Spicy Veg Kolhapuri",
    ["dinner"],
    'veg',
    "1 standard mess ladle (~150g)",
    150,
    'measured',
    { calories: 160, protein: 4.2, carbs: 18.0, fat: 8.2, fiber: 4.5 },
    ["nuts"],
    "Fiery Maharashtrian curry made with mixed veggies and authentic toasted sesame dry-coconut masala"
  ),
  createMessDish(
    'dish_veg_manchuria_noodles',
    "Indo-Chinese Veg Manchurian with Hakka Noodles",
    ["dinner"],
    'veg',
    "1 bowl noodles + 3 manchurian balls (~250g)",
    250,
    'measured',
    { calories: 380, protein: 8.5, carbs: 58.0, fat: 13.0, fiber: 4.0 },
    ["gluten", "soy"],
    "Hostel special Indo-Chinese night: crispy vegetable balls in tangy sauce paired with stir-fry noodles"
  ),
  createMessDish(
    'dish_gobhi_manchuria_noodles',
    "Gobi Manchurian with Hakka Noodles",
    ["dinner"],
    'veg',
    "1 bowl noodles + gobi manchurian (~250g)",
    250,
    'measured',
    { calories: 370, protein: 7.8, carbs: 56.0, fat: 13.5, fiber: 3.8 },
    ["gluten", "soy"],
    "Crispy batter-fried cauliflower in garlic soy sauce served with street-style tossed noodles"
  ),
  createMessDish(
    'dish_bisbele_bath',
    "Karnataka Bisi Bele Bath",
    ["lunch"],
    'veg',
    "1 regular bowl (~200g)",
    200,
    'measured',
    { calories: 270, protein: 7.5, carbs: 48.0, fat: 5.8, fiber: 5.0 },
    ["nuts"],
    "Nutritious Karnataka hot-lentil-rice dish cooked with mixed vegetables, tamarind, and ghee spice paste"
  ),
  createMessDish(
    'dish_vegetable_dum_pulao',
    "Fragrant Vegetable Dum Pulao",
    ["lunch"],
    'veg',
    "1 regular bowl (~180g)",
    180,
    'measured',
    { calories: 240, protein: 5.2, carbs: 46.0, fat: 4.5, fiber: 3.2 },
    [],
    "Basmati rice cooked with whole spices, cinnamon, cardamom, green peas, and fresh herbs"
  ),
  createMessDish(
    'dish_pudina_rice',
    "Aromatic Mint (Pudina) Rice",
    ["lunch"],
    'veg',
    "1 regular bowl (~180g)",
    180,
    'measured',
    { calories: 235, protein: 4.8, carbs: 45.0, fat: 4.2, fiber: 2.8 },
    [],
    "Short-grain rice cooked with pureed fresh garden mint, green chillies, and fried onions"
  ),
  createMessDish(
    'dish_pulihora',
    "Temple Style Andhra Pulihora (Tamarind Rice)",
    ["lunch"],
    'veg',
    "1 regular bowl (~180g)",
    180,
    'measured',
    { calories: 260, protein: 5.5, carbs: 48.0, fat: 5.8, fiber: 3.0 },
    ["nuts"],
    "Classic tangy rice tossed with boiled tamarind pulp, mustard, curry leaves, and crunchy peanuts"
  ),
  createMessDish(
    'dish_tomato_rice',
    "South Indian Spiced Tomato Rice",
    ["lunch"],
    'veg',
    "1 regular bowl (~180g)",
    180,
    'measured',
    { calories: 230, protein: 4.5, carbs: 44.0, fat: 4.2, fiber: 2.5 },
    [],
    "Rice infused with saut\u00e9ed ripe tomatoes, onions, bay leaf, and fresh coriander"
  ),
  createMessDish(
    'dish_bhagara_rice',
    "Hyderabadi Bagara Rice",
    ["dinner"],
    'veg',
    "1 regular bowl (~180g)",
    180,
    'measured',
    { calories: 245, protein: 4.6, carbs: 46.0, fat: 5.0, fiber: 2.2 },
    [],
    "Celebrated Telangana seasoned rice tempered with shahi jeera, caramelized onions, and mint"
  ),
  createMessDish(
    'dish_mushroom_biryani',
    "Dindigul Mushroom Biryani",
    ["dinner"],
    'veg',
    "1 regular bowl (~220g)",
    220,
    'measured',
    { calories: 290, protein: 7.8, carbs: 52.0, fat: 6.2, fiber: 4.2 },
    [],
    "Succulent button mushrooms cooked into fragrant spiced rice with mint and whole garam masala"
  ),
  createMessDish(
    'dish_special_rice',
    "Hostel Special Flavoured Rice",
    ["lunch"],
    'veg',
    "1 regular bowl (~180g)",
    180,
    'measured',
    { calories: 235, protein: 4.8, carbs: 45.0, fat: 4.2, fiber: 2.5 },
    [],
    "Seasoned pulao rice with subtle whole spices and fresh herbs"
  ),
  createMessDish(
    'dish_corn_vada',
    "Crispy Sweet Corn Vada (2 Pcs)",
    ["snacks"],
    'veg',
    "2 vadas (~90g)",
    90,
    'measured',
    { calories: 220, protein: 5.5, carbs: 28.0, fat: 10.0, fiber: 3.2 },
    [],
    "Crushed sweet corn and chana dal fritters spiced with green chillies and fresh ginger"
  ),
  createMessDish(
    'dish_poha_cutlet',
    "Crisp Poha Vegetable Cutlet (2 Pcs)",
    ["snacks"],
    'veg',
    "2 cutlets (~100g)",
    100,
    'measured',
    { calories: 210, protein: 4.8, carbs: 32.0, fat: 7.5, fiber: 3.5 },
    [],
    "Pan-crisped patties made from flattened rice, boiled potatoes, peas, and chaat masala"
  ),
  createMessDish(
    'dish_raw_banana_bajji',
    "Aratikaya Bajji (Raw Banana Fritters, 2 Pcs)",
    ["snacks"],
    'veg',
    "2 bajjis (~100g)",
    100,
    'measured',
    { calories: 230, protein: 4.2, carbs: 30.0, fat: 10.5, fiber: 3.0 },
    [],
    "Crisp besan batter fried raw banana slices sprinkled with chaat powder"
  ),
  createMessDish(
    'dish_punugulu',
    "Andhra Street Punugulu (10 Pcs)",
    ["snacks"],
    'veg',
    "10 small crisp bondas (~130g)",
    130,
    'measured',
    { calories: 310, protein: 6.8, carbs: 44.0, fat: 12.0, fiber: 2.8 },
    [],
    "Addictive crispy golden fritters made from fermented dosa batter and onions"
  ),
  createMessDish(
    'dish_dahi_puri',
    "Chaat Special Dahi Puri (8 Pcs)",
    ["snacks"],
    'veg',
    "8 stuffed puris with spiced curd (~220g)",
    220,
    'measured',
    { calories: 320, protein: 7.5, carbs: 46.0, fat: 12.0, fiber: 3.5 },
    ["dairy", "gluten"],
    "Crisp puris filled with boiled potatoes, chilled sweetened yogurt, tamarind chutney, and sev"
  ),
  createMessDish(
    'dish_pani_puri',
    "Gol Gappa / Pani Puri (8 Pcs)",
    ["snacks"],
    'veg',
    "8 puris + spiced mint pani + aloo (~220g)",
    220,
    'measured',
    { calories: 195, protein: 4.2, carbs: 38.0, fat: 3.2, fiber: 2.8 },
    ["gluten"],
    "Crisp hollow puris stuffed with spiced chickpea-potato mash and filled with tangy jaljeera water"
  ),
  createMessDish(
    'dish_dry_maggi',
    "Hostel Masala Maggi",
    ["snacks"],
    'veg',
    "1 single bowl (~140g cooked)",
    140,
    'measured',
    { calories: 290, protein: 6.0, carbs: 42.0, fat: 11.0, fiber: 2.0 },
    ["gluten"],
    "Classic spiced instant 2-minute hostel noodles with saut\u00e9ed onions and peas"
  ),
  createMessDish(
    'dish_kachori',
    "Khasta Dal Kachori (1 Big Pc)",
    ["snacks"],
    'veg',
    "1 large crispy kachori (~90g)",
    90,
    'measured',
    { calories: 310, protein: 6.5, carbs: 35.0, fat: 16.5, fiber: 3.0 },
    ["gluten"],
    "Flaky, deep-fried pastry stuffed with spiced moong dal paste and asafoetida"
  ),
  createMessDish(
    'dish_onion_soft_pakoda',
    "Andhra Onion Soft Pakoda",
    ["snacks"],
    'veg',
    "1 plate (~100g)",
    100,
    'measured',
    { calories: 275, protein: 5.8, carbs: 28.0, fat: 15.5, fiber: 3.2 },
    [],
    "Tender, melt-in-the-mouth chickpea flour and sliced onion fritters seasoned with fennel and curry leaves"
  ),
  createMessDish(
    'dish_sambar_vada',
    "Hot Sambar Dip Vada (2 Pcs)",
    ["snacks"],
    'veg',
    "2 medu vadas immersed in sambar (~240g)",
    240,
    'measured',
    { calories: 280, protein: 10.5, carbs: 36.0, fat: 10.5, fiber: 5.5 },
    [],
    "Medu vadas soaked in piping hot vegetable drumstick sambar garnished with raw onions and coriander"
  ),
  createMessDish(
    'dish_mysore_bonda',
    "Mysore Bonda / Goli Baje (2 Pcs)",
    ["snacks"],
    'veg',
    "2 standard bondas (~110g)",
    110,
    'measured',
    { calories: 270, protein: 5.8, carbs: 36.0, fat: 11.8, fiber: 2.0 },
    ["gluten", "dairy"],
    "Fluffy, golden spherical bondas prepared with curd, crushed ginger, cumin, and coconut bits"
  ),
  createMessDish(
    'dish_sweet_corn_masala',
    "Buttered Sweet Corn Chaat",
    ["snacks"],
    'veg',
    "1 cup (~120g)",
    120,
    'measured',
    { calories: 155, protein: 4.2, carbs: 28.0, fat: 3.5, fiber: 3.8 },
    ["dairy"],
    "Steamed juicy sweet corn tossed with butter, chaat masala, lemon, and a dash of pepper"
  ),
  createMessDish(
    'dish_tomato_sauce',
    "Tomato Dipping Sauce",
    ["snacks"],
    'veg',
    "2 tablespoons (~30g)",
    30,
    'measured',
    { calories: 35, protein: 0.4, carbs: 8.5, fat: 0.1, fiber: 0.3 },
    [],
    "Classic sweet and tangy tomato dip for evening snacks"
  ),
  createMessDish(
    'dish_ragi_dosa',
    "Nutritious Ragi (Finger Millet) Dosa",
    ["dinner"],
    'veg',
    "2 dosas (~140g)",
    140,
    'measured',
    { calories: 215, protein: 5.8, carbs: 38.0, fat: 4.8, fiber: 5.5 },
    [],
    "Calcium-rich finger millet fermented crepe, low-GI and exceptionally rich in natural iron"
  ),
  createMessDish(
    'dish_ragi_rava_upma',
    "Ragi Rava Vegetable Upma",
    ["dinner"],
    'veg',
    "1 regular bowl (~150g)",
    150,
    'measured',
    { calories: 205, protein: 5.2, carbs: 36.0, fat: 4.2, fiber: 4.8 },
    ["gluten"],
    "Finger millet and coarse semolina cooked with ginger, mustard seeds, and garden vegetables"
  ),
  createMessDish(
    'dish_set_dosa',
    "Sponge Set Dosa (2 Pcs)",
    ["dinner"],
    'veg',
    "2 fluffy dosas (~150g)",
    150,
    'measured',
    { calories: 225, protein: 5.6, carbs: 42.0, fat: 4.2, fiber: 2.8 },
    [],
    "Ultra-soft, thick spongy rice pancakes cooked on one side without excessive oil"
  ),
  createMessDish(
    'dish_podi_onion_dosa',
    "Guntur Karampodi Onion Dosa (2 Pcs)",
    ["dinner"],
    'veg',
    "2 dosas (~150g)",
    150,
    'measured',
    { calories: 265, protein: 6.8, carbs: 42.0, fat: 8.0, fiber: 3.8 },
    [],
    "Crispy dosas layered with fiery roasted lentil gun-powder (karampodi), ghee, and diced onions"
  ),
  createMessDish(
    'dish_sooji_upma_dinner',
    "Homestyle Sooji Upma",
    ["dinner"],
    'veg',
    "1 regular bowl (~150g)",
    150,
    'measured',
    { calories: 200, protein: 4.5, carbs: 36.0, fat: 4.5, fiber: 2.2 },
    ["gluten", "nuts"],
    "Classic roasted semolina upma with curry leaves, ginger, and crunchy peanuts"
  ),
  createMessDish(
    'dish_broken_wheat_upma',
    "Dalia (Broken Wheat) Upma",
    ["dinner"],
    'veg',
    "1 regular bowl (~160g)",
    160,
    'measured',
    { calories: 195, protein: 6.2, carbs: 36.0, fat: 3.5, fiber: 5.5 },
    ["gluten", "nuts"],
    "Fiber-dense broken cracked wheat upma cooked with carrots, green peas, and mild spices"
  ),
  createMessDish(
    'dish_lacha_paratha',
    "Flaky Lacha Paratha (1 Pc)",
    ["dinner"],
    'veg',
    "1 layered paratha (~80g)",
    80,
    'measured',
    { calories: 240, protein: 5.0, carbs: 32.0, fat: 10.5, fiber: 3.0 },
    ["gluten", "dairy"],
    "Multi-layered crispy whole wheat flatbread rolled with ghee and baked on high heat tawa"
  ),
  createMessDish(
    'dish_missi_roti',
    "Rajasthani Missi Roti (Besan Flatbread)",
    ["dinner"],
    'veg',
    "1 large roti (~75g)",
    75,
    'measured',
    { calories: 190, protein: 7.2, carbs: 28.0, fat: 5.5, fiber: 4.5 },
    ["gluten"],
    "Protein-packed flatbread made of chickpea flour and wheat, spiced with ajwain, kasuri methi, and onions"
  ),
  createMessDish(
    'dish_palak_roti',
    "Fresh Palak (Spinach) Roti (Pair)",
    ["lunch"],
    'veg',
    "2 rotis (~70g)",
    70,
    'measured',
    { calories: 175, protein: 5.6, carbs: 32.0, fat: 3.0, fiber: 4.2 },
    ["gluten"],
    "Handmade whole wheat flatbread kneaded with fresh pureed spinach leaves"
  ),
  createMessDish(
    'dish_carrot_cucumber_salad',
    "Fresh Sliced Carrot & Cucumber Salad",
    ["lunch"],
    'veg',
    "1 bowl (~80g)",
    80,
    'measured',
    { calories: 25, protein: 0.8, carbs: 5.2, fat: 0.2, fiber: 2.2 },
    [],
    "Hydrating raw carrot and English cucumber batons dressed with a squeeze of fresh lemon"
  ),
  createMessDish(
    'dish_beetroot_cucumber_salad',
    "Crunchy Beetroot & Cucumber Salad",
    ["lunch"],
    'veg',
    "1 bowl (~80g)",
    80,
    'measured',
    { calories: 28, protein: 1.0, carbs: 5.8, fat: 0.2, fiber: 2.0 },
    [],
    "Rich in nitrates and minerals; sliced fresh beetroot and crisp cucumber slices"
  ),
  createMessDish(
    'dish_beetroot_carrot_salad',
    "Grated Beetroot & Carrot Salad",
    ["dinner"],
    'veg',
    "1 bowl (~80g)",
    80,
    'measured',
    { calories: 30, protein: 1.1, carbs: 6.4, fat: 0.2, fiber: 2.4 },
    [],
    "Fresh salad with grated carrots and raw beetroot rich in beta-carotene"
  ),
  createMessDish(
    'dish_onions_lemon_salad',
    "Sliced Red Onions with Lemon & Green Chilli",
    ["lunch", "dinner"],
    'veg',
    "1 small bowl (~50g)",
    50,
    'measured',
    { calories: 20, protein: 0.6, carbs: 4.5, fat: 0.1, fiber: 1.0 },
    [],
    "Crisp sliced red onions seasoned with lemon juice and a pinch of black salt"
  ),
  createMessDish(
    'dish_butter_milk',
    "Spiced Chilled Chaas / Buttermilk",
    ["lunch"],
    'veg',
    "1 glass (~200ml)",
    200,
    'measured',
    { calories: 45, protein: 3.2, carbs: 4.5, fat: 1.5, fiber: 0 },
    ["dairy"],
    "Cooling probiotic curd churned with water, ginger, curry leaves, and roasted cumin"
  ),
  createMessDish(
    'dish_sweet_lassi',
    "Creamy Sweet Lassi",
    ["lunch"],
    'veg',
    "1 glass (~200ml)",
    200,
    'measured',
    { calories: 160, protein: 5.5, carbs: 24.0, fat: 5.0, fiber: 0 },
    ["dairy"],
    "Thick refreshing Punjabi yogurt beverage sweetened with a touch of cardamom"
  ),
  createMessDish(
    'dish_lemon_sabja_water',
    "Cooling Nimbu Pani with Basil (Sabja) Seeds",
    ["lunch"],
    'veg',
    "1 glass (~200ml)",
    200,
    'measured',
    { calories: 40, protein: 0.8, carbs: 9.0, fat: 0.2, fiber: 1.5 },
    [],
    "Fresh lemon water infused with soaked basil seeds that aid digestive cooling"
  ),
  createMessDish(
    'dish_nannari_sharbath',
    "Sarsaparilla (Nannari) Herbal Sharbath",
    ["lunch"],
    'veg',
    "1 glass (~200ml)",
    200,
    'measured',
    { calories: 85, protein: 0.2, carbs: 21.0, fat: 0.1, fiber: 0.2 },
    [],
    "Traditional Ayurvedic cooling root syrup mixed with cold water and lemon juice"
  ),
  createMessDish(
    'dish_ghee_podi',
    "Pure Desi Ghee with Kandi Podi",
    ["lunch"],
    'veg',
    "1 spoon podi + ghee (~15g)",
    15,
    'measured',
    { calories: 95, protein: 2.2, carbs: 3.5, fat: 8.2, fiber: 1.0 },
    ["dairy"],
    "Warm golden desi ghee paired with spicy roasted toor dal podi for steaming rice"
  ),
  createMessDish(
    'dish_mess_fryums_papad',
    "Crunchy Mess Fryums / Papad / Chips",
    ["lunch"],
    'veg',
    "1 serving (~25g)",
    25,
    'measured',
    { calories: 95, protein: 2.2, carbs: 14.5, fat: 3.5, fiber: 0.8 },
    [],
    "Crispy mess side accompaniment: roasted lentil papad or light fryums"
  ),
  createMessDish(
    'dish_dahi_vada',
    "Dahi Vada with Sweet Tamarind & Cumin (1 Pc)",
    ["lunch"],
    'veg',
    "1 soft vada in yogurt (~110g)",
    110,
    'measured',
    { calories: 175, protein: 6.8, carbs: 21.0, fat: 7.2, fiber: 2.5 },
    ["dairy"],
    "Urad dal dumpling soaked in whipped curd and topped with cumin and chutneys"
  ),
  createMessDish(
    'dish_hot_milk_coffee',
    "Warm Mess Milk with Coffee Powder",
    ["dinner"],
    'veg',
    "1 cup (~180ml)",
    180,
    'measured',
    { calories: 120, protein: 5.8, carbs: 9.5, fat: 6.2, fiber: 0 },
    ["dairy"],
    "Piping hot toned milk served with fresh instant coffee powder at night"
  ),
  createMessDish(
    'dish_gulab_jamun',
    "Hot Gulab Jamun (1 Big Pc)",
    ["lunch"],
    'veg',
    "1 piece in syrup (~60g)",
    60,
    'measured',
    { calories: 180, protein: 3.2, carbs: 28.0, fat: 6.5, fiber: 0.2 },
    ["dairy", "gluten"],
    "Deep fried mawa dumplings soaked in fragrant cardamom rose sugar syrup"
  ),
  createMessDish(
    'dish_jilebi',
    "Crisp Golden Jalebi (2 Pcs)",
    ["lunch"],
    'veg',
    "2 crispy spirals (~60g)",
    60,
    'measured',
    { calories: 210, protein: 2.0, carbs: 38.0, fat: 6.2, fiber: 0.2 },
    ["gluten"],
    "Crispy deep-fried fermented flour spirals soaked in hot saffron sugar syrup"
  ),
  createMessDish(
    'dish_badusha',
    "Flaky Andhra Badusha (Balushahi, 1 Pc)",
    ["lunch"],
    'veg',
    "1 pc (~60g)",
    60,
    'measured',
    { calories: 235, protein: 2.8, carbs: 32.0, fat: 11.0, fiber: 0.4 },
    ["gluten", "dairy"],
    "Traditional flaky, layered sweet made of refined flour and ghee, glazed in sugar syrup"
  ),
  createMessDish(
    'dish_poornalu',
    "Traditional Andhra Poornalu (1 Pc)",
    ["lunch"],
    'veg',
    "1 sweet dumpling (~65g)",
    65,
    'measured',
    { calories: 195, protein: 4.2, carbs: 32.0, fat: 6.0, fiber: 2.0 },
    [],
    "Celebrated festive Andhra sweet: chana dal and jaggery ball encased in crispy rice-urad batter"
  ),
  createMessDish(
    'dish_semiya_payasam',
    "Rich Semiya Payasam (Kheer)",
    ["lunch"],
    'veg',
    "1 small bowl (~120g)",
    120,
    'measured',
    { calories: 170, protein: 4.2, carbs: 26.0, fat: 5.8, fiber: 0.5 },
    ["dairy", "nuts", "gluten"],
    "Roasted vermicelli simmered in sweetened milk with cardamom, cashews, and raisins"
  ),
  createMessDish(
    'dish_sweet_boondi',
    "Tirupati Style Sweet Boondi",
    ["lunch"],
    'veg',
    "1 small cup (~60g)",
    60,
    'measured',
    { calories: 215, protein: 3.5, carbs: 36.0, fat: 6.8, fiber: 0.8 },
    ["nuts"],
    "Golden fried chickpea pearls coated in sugar syrup with cardamom and edible camphor hint"
  ),
  createMessDish(
    'dish_vanilla_ice_cream',
    "Real Dairy Vanilla Ice Cream Cup",
    ["lunch"],
    'veg',
    "1 cup (~80g)",
    80,
    'measured',
    { calories: 145, protein: 2.8, carbs: 18.0, fat: 7.2, fiber: 0 },
    ["dairy"],
    "Pure dairy creamy vanilla ice cream cup (VIT-AP certified: not frozen dessert)"
  ),
  createMessDish(
    'dish_kulfi',
    "Traditional Malai Matka Kulfi",
    ["lunch"],
    'veg',
    "1 kulfi (~70g)",
    70,
    'measured',
    { calories: 165, protein: 4.2, carbs: 19.0, fat: 8.5, fiber: 0 },
    ["dairy", "nuts"],
    "Slow-reduced caramelized milk frozen dessert loaded with pistachios and green cardamom"
  ),
  createMessDish(
    'dish_fruit_custard',
    "Chilled Vanilla Fruit Custard",
    ["dinner"],
    'veg',
    "1 bowl (~140g)",
    140,
    'measured',
    { calories: 140, protein: 3.5, carbs: 24.0, fat: 3.5, fiber: 1.5 },
    ["dairy"],
    "Creamy chilled vanilla custard packed with diced pineapples, apples, and seasonal fruits"
  ),
  createMessDish(
    'dish_fresh_cut_fruits',
    "Fresh Cut Fruits (Watermelon + Muskmelon + Papaya)",
    ["dinner"],
    'veg',
    "1 generous bowl (~150g)",
    150,
    'measured',
    { calories: 55, protein: 1.1, carbs: 13.0, fat: 0.3, fiber: 2.2 },
    [],
    "Hydrating fresh seasonal fruits: crisp watermelon, sweet musk melon, and ripe papaya"
  ),
  createMessDish(
    'dish_guava_fruit',
    "Fresh Guava (1 Whole Fruit)",
    ["dinner"],
    'veg',
    "1 medium guava (~120g)",
    120,
    'measured',
    { calories: 60, protein: 2.5, carbs: 12.0, fat: 0.8, fiber: 6.5 },
    [],
    "Vitamin C powerhouse fresh Allahabad guava packed with dietary fiber"
  ),
  createMessDish(
    'dish_fresh_banana',
    "Fresh Yelakki / Robust Banana (1 Pc)",
    ["dinner"],
    'veg',
    "1 banana (~100g)",
    100,
    'measured',
    { calories: 90, protein: 1.2, carbs: 23.0, fat: 0.3, fiber: 2.6 },
    [],
    "Natural energy booster ripe banana rich in potassium and quick carbs"
  ),
  createMessDish(
    'dish_mess_pickle',
    "Mess Andhra Pickle (Avakaya / Tomato / Ginger)",
    ["lunch", "dinner"],
    'veg',
    "1 tablespoon (~15g)",
    15,
    'measured',
    { calories: 25, protein: 0.3, carbs: 2.0, fat: 1.8, fiber: 0.5 },
    [],
    "Piquant traditional Andhra oil pickle crafted with mustard, fenugreek, and fiery chilli"
  ),
  createMessDish(
    'dish_dosakaya_chutney',
    "Dosakaya Tomato Andhra Chutney",
    ["lunch"],
    'veg',
    "2 tablespoons (~40g)",
    40,
    'measured',
    { calories: 35, protein: 0.9, carbs: 5.0, fat: 1.2, fiber: 1.6 },
    [],
    "Yellow cucumber and juicy tomato chutney tempered with mustard and cumin"
  ),
  createMessDish(
    'dish_beerakaya_chutney',
    "Beerakaya Thokku Chutney",
    ["lunch"],
    'veg',
    "2 tablespoons (~40g)",
    40,
    'measured',
    { calories: 32, protein: 0.8, carbs: 4.5, fat: 1.2, fiber: 1.8 },
    [],
    "Fiber-rich ridge gourd peel chutney ground with roasted green chillies and tamarind"
  ),
  createMessDish(
    'dish_potlakaya_perugu_chutney',
    "Potlakaya Perugu Pachadi (Snake Gourd Curd Relish)",
    ["lunch"],
    'veg',
    "2 tablespoons (~45g)",
    45,
    'measured',
    { calories: 42, protein: 1.8, carbs: 3.8, fat: 2.2, fiber: 1.2 },
    ["dairy"],
    "Steamed snake gourd blended into fresh seasoned yogurt with mustard tempering"
  ),
  createMessDish(
    'dish_sorakaya_perugu_chutney',
    "Sorakaya Perugu Pachadi (Bottle Gourd Curd Relish)",
    ["lunch"],
    'veg',
    "2 tablespoons (~45g)",
    45,
    'measured',
    { calories: 40, protein: 1.6, carbs: 3.5, fat: 2.2, fiber: 1.2 },
    ["dairy"],
    "Tender bottle gourd mixed with seasoned probiotic curd and curry leaves"
  ),
  createMessDish(
    'dish_gongura_chutney',
    "Fresh Andhra Gongura Pachadi",
    ["lunch"],
    'veg',
    "2 tablespoons (~35g)",
    35,
    'measured',
    { calories: 38, protein: 1.2, carbs: 4.0, fat: 2.0, fiber: 1.8 },
    [],
    "Authentic spicy and sour sorrel leaves paste tempered with crushed garlic and red chillies"
  ),
  createMessDish(
    'dish_coriander_tomato_chutney',
    "Coriander Tomato Mess Chutney",
    ["lunch"],
    'veg',
    "2 tablespoons (~40g)",
    40,
    'measured',
    { calories: 32, protein: 0.9, carbs: 4.8, fat: 1.1, fiber: 1.4 },
    [],
    "Fresh garden coriander leaves saut\u00e9ed with ripe tomatoes and green chillies"
  ),
  createMessDish(
    'dish_onion_tomato_chutney',
    "Spiced Onion Tomato Chutney",
    ["breakfast", "snacks"],
    'veg',
    "2 tablespoons (~40g)",
    40,
    'measured',
    { calories: 40, protein: 1.0, carbs: 6.2, fat: 1.2, fiber: 1.4 },
    [],
    "Slow cooked caramelized onions and tangy tomatoes ground with dry red chillies"
  ),
  createMessDish(
    'dish_pomegranate_juice',
    "Pomegranate Fresh Juice (250ml)",
    ["breakfast"],
    'veg',
    "1 tall glass (~250ml)",
    250,
    'measured',
    { calories: 130, protein: 1.5, carbs: 32.0, fat: 0.5, fiber: 0.5 },
    [],
    "Freshly extracted antioxidant-rich ruby pomegranate juice"
  ),
  createMessDish(
    'dish_pineapple_juice',
    "Pineapple Fresh Juice (250ml)",
    ["breakfast"],
    'veg',
    "1 tall glass (~250ml)",
    250,
    'measured',
    { calories: 120, protein: 1.2, carbs: 30.0, fat: 0.3, fiber: 0.5 },
    [],
    "Pure cold-pressed pineapple juice rich in bromelain digestive enzyme"
  ),
  createMessDish(
    'dish_orange_juice',
    "Orange Fresh Juice (250ml)",
    ["breakfast"],
    'veg',
    "1 tall glass (~250ml)",
    250,
    'measured',
    { calories: 110, protein: 1.8, carbs: 26.0, fat: 0.4, fiber: 0.5 },
    [],
    "Vitamin C powerhouse fresh orange juice prepared with zero added water"
  ),
  createMessDish(
    'dish_papaya_juice',
    "Papaya Fresh Juice (250ml)",
    ["breakfast"],
    'veg',
    "1 tall glass (~250ml)",
    250,
    'measured',
    { calories: 105, protein: 1.2, carbs: 25.0, fat: 0.3, fiber: 1.5 },
    [],
    "Digestive soothing fresh papaya juice packed with vitamin A"
  ),
  createMessDish(
    'dish_grapes_juice',
    "Black Grape Fresh Juice (250ml)",
    ["breakfast"],
    'veg',
    "1 tall glass (~250ml)",
    250,
    'measured',
    { calories: 140, protein: 1.0, carbs: 35.0, fat: 0.4, fiber: 0.5 },
    [],
    "Sweet black grape juice packed with resveratrol antioxidants"
  ),
  createMessDish(
    'dish_apple_pomegranate_juice',
    "Apple & Pomegranate Juice (250ml)",
    ["breakfast"],
    'veg',
    "1 tall glass (~250ml)",
    250,
    'measured',
    { calories: 135, protein: 1.2, carbs: 33.0, fat: 0.4, fiber: 0.8 },
    [],
    "Hydrating blend of fresh crisp apples and pomegranate pearls"
  ),
  createMessDish(
    'dish_banana_milkshake',
    "Fresh Banana Milkshake (250ml)",
    ["breakfast"],
    'veg',
    "1 tall glass (~250ml)",
    250,
    'measured',
    { calories: 210, protein: 6.8, carbs: 38.0, fat: 4.5, fiber: 1.8 },
    ["dairy"],
    "Rich potassium energy shake blended with ripe bananas and toned milk"
  ),
  createMessDish(
    'dish_cold_badam_milk',
    "Chilled Kesar Badam Milk (250ml)",
    ["breakfast"],
    'veg',
    "1 glass (~250ml)",
    250,
    'measured',
    { calories: 195, protein: 7.2, carbs: 24.0, fat: 8.0, fiber: 1.0 },
    ["dairy", "nuts"],
    "Chilled royal milk infused with almond paste, saffron strands, and cardamom"
  ),
  createMessDish(
    'dish_museli_milk',
    "Swiss Muesli with Warm Milk",
    ["breakfast"],
    'veg',
    "1 regular cereal bowl (~200g)",
    200,
    'measured',
    { calories: 260, protein: 9.5, carbs: 42.0, fat: 6.8, fiber: 4.5 },
    ["dairy", "gluten", "nuts"],
    "Whole grain rolled oats, raisins, seeds, and toasted nuts with milk"
  ),
  createMessDish(
    'dish_chocos_milk',
    "Kellogg's Chocos with Warm Milk",
    ["breakfast"],
    'veg',
    "1 regular cereal bowl (~180g)",
    180,
    'measured',
    { calories: 230, protein: 6.5, carbs: 46.0, fat: 3.5, fiber: 2.2 },
    ["dairy", "gluten"],
    "Crunchy chocolate wheat scoops served with warm toned milk"
  ),
  createMessDish(
    'dish_cornflakes_milk',
    "Crisp Cornflakes with Milk",
    ["breakfast"],
    'veg',
    "1 regular cereal bowl (~180g)",
    180,
    'measured',
    { calories: 220, protein: 6.2, carbs: 44.0, fat: 3.2, fiber: 1.5 },
    ["dairy"],
    "Crispy toasted corn flakes served with chilled or warm milk"
  ),
  createMessDish(
    'dish_ragi_malt',
    "Hot Sweet Ragi Malt",
    ["breakfast"],
    'veg',
    "1 cup (~180ml)",
    180,
    'measured',
    { calories: 140, protein: 3.8, carbs: 28.0, fat: 1.5, fiber: 3.2 },
    [],
    "Traditional finger millet malt cooked with milk and jaggery"
  ),
  createMessDish(
    'dish_brown_bread_peanut_butter',
    "Brown Bread with Peanut Butter & Jam",
    ["breakfast"],
    'veg',
    "2 slices with peanut butter (~90g)",
    90,
    'measured',
    { calories: 260, protein: 9.2, carbs: 34.0, fat: 10.5, fiber: 3.8 },
    ["gluten", "nuts"],
    "High-protein toasted brown bread paired with creamy peanut butter"
  ),
  createMessDish(
    'dish_boiled_soya_bean_salad',
    "Boiled Soya Bean Salad",
    ["breakfast"],
    'veg',
    "1 bowl (~100g)",
    100,
    'measured',
    { calories: 160, protein: 14.5, carbs: 11.0, fat: 7.2, fiber: 5.5 },
    ["soy"],
    "High-protein steamed soybeans tossed with onions, green chillies, and chaat masala"
  ),
  createMessDish(
    'dish_boiled_peanut_sundal',
    "South Indian Boiled Peanut Sundal",
    ["breakfast"],
    'veg',
    "1 bowl (~100g)",
    100,
    'measured',
    { calories: 180, protein: 7.8, carbs: 12.0, fat: 11.5, fiber: 3.5 },
    ["nuts"],
    "Boiled groundnuts tempered with mustard, curry leaves, and fresh coconut"
  ),
  createMessDish(
    'dish_greek_yogurt_salad',
    "Greek Yogurt Cucumber Salad",
    ["breakfast"],
    'veg',
    "1 bowl (~120g)",
    120,
    'measured',
    { calories: 130, protein: 11.0, carbs: 8.5, fat: 4.5, fiber: 1.5 },
    ["dairy"],
    "Thick protein-rich strained curd with diced cucumber and cracked pepper"
  ),
  createMessDish(
    'dish_boiled_chickpeas_salad',
    "Boiled Chickpeas (Kabuli Chana) Salad",
    ["breakfast"],
    'veg',
    "1 bowl (~110g)",
    110,
    'measured',
    { calories: 165, protein: 8.8, carbs: 26.0, fat: 3.2, fiber: 6.2 },
    [],
    "Tender boiled white chickpeas tossed with lemon juice, cumin, and fresh herbs"
  ),
  createMessDish(
    'dish_boiled_paneer_salad',
    "Boiled Herb Tossed Paneer Salad",
    ["breakfast"],
    'veg',
    "1 bowl (~100g)",
    100,
    'measured',
    { calories: 190, protein: 13.5, carbs: 4.5, fat: 13.5, fiber: 1.2 },
    ["dairy"],
    "Soft fresh paneer cubes gently seasoned with mint, lemon, and chaat spices"
  ),
  createMessDish(
    'dish_broccoli_soup',
    "Creamy Broccoli Almond Soup",
    ["dinner"],
    'veg',
    "1 bowl (~150ml)",
    150,
    'measured',
    { calories: 95, protein: 3.8, carbs: 9.5, fat: 4.8, fiber: 2.8 },
    ["nuts"],
    "Velvety pur\u00e9ed fresh broccoli soup garnished with toasted almond flakes"
  ),
  createMessDish(
    'dish_tomato_crouton_soup',
    "Roasted Tomato Soup with Croutons",
    ["dinner"],
    'veg',
    "1 bowl (~150ml)",
    150,
    'measured',
    { calories: 110, protein: 2.5, carbs: 18.0, fat: 3.5, fiber: 2.0 },
    ["gluten"],
    "Slow-roasted tomato broth served with crispy baked garlic bread croutons"
  ),
  createMessDish(
    'dish_creamy_mushroom_soup',
    "Creamy Button Mushroom Soup",
    ["dinner"],
    'veg',
    "1 bowl (~150ml)",
    150,
    'measured',
    { calories: 105, protein: 3.2, carbs: 10.0, fat: 6.0, fiber: 1.8 },
    ["dairy"],
    "Earthy white button mushrooms saut\u00e9ed in garlic and simmered in light cream"
  ),
  createMessDish(
    'dish_mix_veg_ragi_soup',
    "Mix Veg Ragi Soup",
    ["dinner"],
    'veg',
    "1 bowl (~150ml)",
    150,
    'measured',
    { calories: 85, protein: 2.5, carbs: 15.0, fat: 1.8, fiber: 3.2 },
    [],
    "Wholesome finger-millet soup enriched with finely chopped garden vegetables"
  ),
  createMessDish(
    'dish_red_lentil_soup',
    "Spiced Red Lentil Soup",
    ["dinner"],
    'veg',
    "1 bowl (~150ml)",
    150,
    'measured',
    { calories: 115, protein: 6.5, carbs: 18.0, fat: 2.2, fiber: 3.8 },
    [],
    "Hearty masoor dal broth simmered with roasted cumin, turmeric, and garlic"
  ),
  createMessDish(
    'dish_lemon_coriander_soup',
    "Clear Lemon Coriander Soup",
    ["dinner"],
    'veg',
    "1 bowl (~150ml)",
    150,
    'measured',
    { calories: 45, protein: 1.2, carbs: 8.0, fat: 0.8, fiber: 1.2 },
    [],
    "Refreshing digestive clear broth with tangy lemon and vibrant fresh coriander"
  ),
  createMessDish(
    'dish_sweet_corn_soup',
    "Indo-Chinese Sweet Corn Veg Soup",
    ["dinner"],
    'veg',
    "1 bowl (~150ml)",
    150,
    'measured',
    { calories: 90, protein: 2.2, carbs: 16.5, fat: 2.0, fiber: 1.8 },
    [],
    "Comforting sweet corn broth with tender kernels, carrots, and spring onions"
  ),
  createMessDish(
    'dish_veg_manchow_soup',
    "Crispy Noodle Veg Manchow Soup",
    ["dinner"],
    'veg',
    "1 bowl (~150ml)",
    150,
    'measured',
    { calories: 115, protein: 2.8, carbs: 18.0, fat: 4.0, fiber: 2.0 },
    ["gluten", "soy"],
    "Spicy Indo-Chinese dark broth topped with crunchy deep-fried noodles"
  ),
  createMessDish(
    'dish_rasamalai',
    "Royal Kesar Rasamalai (1 Pc)",
    ["lunch"],
    'veg',
    "1 piece in saffron milk (~80g)",
    80,
    'measured',
    { calories: 210, protein: 6.2, carbs: 26.0, fat: 9.5, fiber: 0.2 },
    ["dairy", "nuts"],
    "Soft cottage cheese disc soaked in thickened cardamom saffron clotted milk"
  ),
  createMessDish(
    'dish_kalakand',
    "Rich Alwar Kalakand (1 Pc)",
    ["lunch"],
    'veg',
    "1 square (~60g)",
    60,
    'measured',
    { calories: 190, protein: 5.5, carbs: 22.0, fat: 9.2, fiber: 0 },
    ["dairy"],
    "Granular slow-cooked condensed milk fudge spiced with fresh green cardamom"
  ),
  createMessDish(
    'dish_carrot_halwa',
    "Desi Ghee Gajar Ka Halwa",
    ["lunch"],
    'veg',
    "1 small bowl (~80g)",
    80,
    'measured',
    { calories: 230, protein: 4.0, carbs: 32.0, fat: 10.5, fiber: 2.8 },
    ["dairy", "nuts"],
    "Fresh grated red carrots simmered in milk and ghee, studded with cashews"
  ),
  createMessDish(
    'dish_puran_poli',
    "Maharashtrian Puran Poli with Ghee",
    ["lunch"],
    'veg',
    "1 flatbread (~90g)",
    90,
    'measured',
    { calories: 240, protein: 5.8, carbs: 42.0, fat: 6.5, fiber: 3.5 },
    ["gluten", "dairy"],
    "Whole wheat flatbread stuffed with sweet chana dal jaggery puran"
  ),
  createMessDish(
    'dish_motichoor_laddu',
    "Pure Ghee Motichoor Laddu",
    ["lunch"],
    'veg',
    "1 laddu (~50g)",
    50,
    'measured',
    { calories: 185, protein: 2.8, carbs: 26.0, fat: 8.0, fiber: 0.8 },
    ["nuts"],
    "Tiny gram flour pearls fried in ghee and bound into sweet scented laddus"
  ),
  createMessDish(
    'dish_eggless_chocolate_cake',
    "Eggless Rich Chocolate Pastry",
    ["lunch"],
    'veg',
    "1 slice (~80g)",
    80,
    'measured',
    { calories: 260, protein: 4.2, carbs: 36.0, fat: 11.5, fiber: 2.0 },
    ["gluten", "dairy"],
    "Decadent dark cocoa sponge cake frosted with chocolate ganache"
  ),
  createMessDish(
    'dish_chicken_65',
    "Chicken 65 Starter",
    ["dinner"],
    'non-veg',
    "4-5 pcs (~100g)",
    100,
    'measured',
    { calories: 230, protein: 22.0, carbs: 6.0, fat: 13.0, fiber: 1.0 },
    [],
    "Crisp deep-fried boneless chicken cubes tossed with curry leaves and South Indian red chili spices"
  ),
  createMessDish(
    'dish_paneer_65',
    "Paneer 65 Starter",
    ["dinner"],
    'veg',
    "4-5 pcs (~80g)",
    80,
    'measured',
    { calories: 240, protein: 12.5, carbs: 8.0, fat: 18.0, fiber: 1.0 },
    ["dairy"],
    "Crispy paneer cubes tossed in tempered yogurt, curry leaves, and spicy red masala"
  ),
  createMessDish(
    'dish_chilli_chicken',
    "Indo-Chinese Chilli Chicken",
    ["dinner"],
    'non-veg',
    "1 katori (~120g)",
    120,
    'measured',
    { calories: 245, protein: 23.5, carbs: 7.5, fat: 13.5, fiber: 1.2 },
    ["soy"],
    "Tender chicken chunks sautéed with green chilies, bell peppers, onions, and dark soya sauce"
  ),
  createMessDish(
    'dish_chilli_paneer',
    "Indo-Chinese Chilli Paneer",
    ["dinner"],
    'veg',
    "1 katori (~110g)",
    110,
    'measured',
    { calories: 260, protein: 13.0, carbs: 10.0, fat: 19.0, fiber: 1.2 },
    ["dairy", "soy"],
    "Fried cottage cheese cubes tossed with capsicum, scallions, green chilies, and tangy chili garlic sauce"
  ),
  createMessDish(
    'dish_sweet_potato_salad',
    "Boiled Sweet Potato Salad with Chaat Masala",
    ["breakfast"],
    'veg',
    "1 small bowl (~100g)",
    100,
    'measured',
    { calories: 95, protein: 1.6, carbs: 21.0, fat: 0.2, fiber: 3.2 },
    [],
    "Tender steamed sweet potato chunks seasoned with roasted cumin, chaat masala, and lemon juice"
  ),
  createMessDish(
    'dish_chicken_thick_gravy',
    "Chicken Thick Gravy (Biryani Sherva)",
    ["lunch"],
    'non-veg',
    "1 katori (~100ml)",
    100,
    'measured',
    { calories: 120, protein: 8.5, carbs: 4.2, fat: 7.5, fiber: 0.8 },
    [],
    "Rich spiced aromatic chicken gravy simmered with bone marrow stock, onions, and ground whole spices"
  ),
];

export const DISH_LOOKUP = new Map<string, Dish>(
  MESS_DISHES.map((d) => [d.id, d])
);
