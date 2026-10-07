import { FoodCourtItem, FoodCourtShop, GoalType } from '../types';

export const FOOD_COURT_SHOPS: FoodCourtShop[] = [
  {
    id: 'shop_rolls',
    name: 'Rolls Nation / Kathi Junction',
    tagline: 'Kathi rolls, double egg wraps & spiced paneer tikka',
    icon: '🌯',
    priceRange: '₹60 – ₹130',
    popularItemName: 'Double Egg Chicken Roll',
  },
  {
    id: 'shop_south_indian',
    name: 'Annapurna South Indian',
    tagline: 'Crispy butter dosas, fluffy idlis & hot sambhar',
    icon: '🥞',
    priceRange: '₹50 – ₹110',
    popularItemName: 'Crispy Butter Masala Dosa',
  },
  {
    id: 'shop_tapri',
    name: 'Campus Nescafe / Tapri',
    tagline: 'Hostel late-night Maggi, grilled sandwiches & chai',
    icon: '🥪',
    priceRange: '₹35 – ₹110',
    popularItemName: 'Cheese Veggie Masala Maggi',
  },
  {
    id: 'shop_juices',
    name: 'Juice Junction & Shakes',
    tagline: 'Fresh fruit juices, banana shakes & thick cold coffee',
    icon: '🥤',
    priceRange: '₹40 – ₹90',
    popularItemName: 'Thick Iced Cold Coffee',
  },
  {
    id: 'shop_momos',
    name: 'Tibetan Momo Stall',
    tagline: 'Steamed chicken & veg dumplings with fiery red chutney',
    icon: '🥟',
    priceRange: '₹70 – ₹110',
    popularItemName: 'Steamed Chicken Momos (6 pcs)',
  },
];

export const RAW_FOOD_COURT_ITEMS: FoodCourtItem[] = [
  // 1. Rolls Nation / Kathi Junction
  {
    id: 'fc_single_egg_roll',
    shopId: 'shop_rolls',
    shopName: 'Rolls Nation / Kathi Junction',
    name: 'Single Egg Roll',
    price: 60,
    category: 'egg',
    calories: 340,
    protein: 12.5,
    carbs: 44.0,
    fat: 13.0,
    fiber: 1.8,
    allergens: ['gluten', 'eggs'],
    portionDescription: '1 standard egg roll with onions & chutney',
  },
  {
    id: 'fc_egg_roll',
    shopId: 'shop_rolls',
    shopName: 'Rolls Nation / Kathi Junction',
    name: 'Double Egg Chicken Roll',
    price: 110,
    category: 'non-veg',
    calories: 520,
    protein: 28.0,
    carbs: 48.0,
    fat: 24.0,
    fiber: 2.0,
    allergens: ['gluten', 'eggs'],
    portionDescription: '1 full roll with 2 eggs & spiced chicken',
    isPopular: true,
  },
  {
    id: 'fc_paneer_roll',
    shopId: 'shop_rolls',
    shopName: 'Rolls Nation / Kathi Junction',
    name: 'Double Paneer Tikka Roll',
    price: 100,
    category: 'veg',
    calories: 460,
    protein: 18.5,
    carbs: 52.0,
    fat: 20.0,
    fiber: 3.5,
    allergens: ['gluten', 'dairy'],
    portionDescription: '1 full flaky paratha roll',
    isPopular: true,
  },
  {
    id: 'fc_soya_chaap_roll',
    shopId: 'shop_rolls',
    shopName: 'Rolls Nation / Kathi Junction',
    name: 'Tandoori Soya Chaap Roll',
    price: 90,
    category: 'veg',
    calories: 410,
    protein: 22.0,
    carbs: 50.0,
    fat: 14.0,
    fiber: 4.5,
    allergens: ['gluten', 'soy'],
    portionDescription: '1 high-protein soy chaap paratha roll',
  },

  // 2. Annapurna South Indian
  {
    id: 'fc_idli_pair',
    shopId: 'shop_south_indian',
    shopName: 'Annapurna South Indian',
    name: 'Steamed Idli Pair with Sambhar',
    price: 50,
    category: 'veg',
    calories: 195,
    protein: 6.8,
    carbs: 40.0,
    fat: 1.1,
    fiber: 3.2,
    allergens: [],
    portionDescription: '2 fluffy steamed idlis with warm sambhar',
    isPopular: true,
  },
  {
    id: 'fc_masala_dosa',
    shopId: 'shop_south_indian',
    shopName: 'Annapurna South Indian',
    name: 'Crispy Butter Masala Dosa',
    price: 75,
    category: 'veg',
    calories: 390,
    protein: 7.2,
    carbs: 58.0,
    fat: 14.5,
    fiber: 4.1,
    allergens: ['dairy'],
    portionDescription: '1 large crisp dosa + potato masala + sambhar',
    isPopular: true,
  },
  {
    id: 'fc_plain_dosa',
    shopId: 'shop_south_indian',
    shopName: 'Annapurna South Indian',
    name: 'Plain Paper Roast Dosa',
    price: 60,
    category: 'veg',
    calories: 260,
    protein: 5.5,
    carbs: 46.0,
    fat: 6.0,
    fiber: 2.5,
    allergens: [],
    portionDescription: '1 plain roasted dosa + sambhar',
  },
  {
    id: 'fc_vada_pair',
    shopId: 'shop_south_indian',
    shopName: 'Annapurna South Indian',
    name: 'Crispy Medu Vada Pair',
    price: 60,
    category: 'veg',
    calories: 330,
    protein: 8.5,
    carbs: 38.0,
    fat: 16.0,
    fiber: 4.0,
    allergens: [],
    portionDescription: '2 crispy urad dal lentil donuts with sambhar',
  },

  // 3. Campus Nescafe / Tapri
  {
    id: 'fc_plain_maggi',
    shopId: 'shop_tapri',
    shopName: 'Campus Nescafe / Tapri',
    name: 'Classic Masala Maggi',
    price: 35,
    category: 'veg',
    calories: 310,
    protein: 6.0,
    carbs: 46.0,
    fat: 11.5,
    fiber: 2.0,
    allergens: ['gluten'],
    portionDescription: '1 single packet freshly prepared',
  },
  {
    id: 'fc_cheese_maggi',
    shopId: 'shop_tapri',
    shopName: 'Campus Nescafe / Tapri',
    name: 'Cheese Veggie Masala Maggi',
    price: 65,
    category: 'veg',
    calories: 420,
    protein: 9.5,
    carbs: 54.0,
    fat: 19.0,
    fiber: 3.0,
    allergens: ['gluten', 'dairy'],
    portionDescription: '1 double-cake bowl with veggies & melted cheese',
    isPopular: true,
  },
  {
    id: 'fc_paneer_sandwich',
    shopId: 'shop_tapri',
    shopName: 'Campus Nescafe / Tapri',
    name: 'Grilled Paneer Corn Sandwich',
    price: 70,
    category: 'veg',
    calories: 380,
    protein: 15.0,
    carbs: 42.0,
    fat: 16.5,
    fiber: 3.5,
    allergens: ['gluten', 'dairy'],
    portionDescription: '2 jumbo grilled triangle slices',
    isPopular: true,
  },
  {
    id: 'fc_chicken_sandwich',
    shopId: 'shop_tapri',
    shopName: 'Campus Nescafe / Tapri',
    name: 'Grilled Chicken Mayo Sandwich',
    price: 85,
    category: 'non-veg',
    calories: 440,
    protein: 24.0,
    carbs: 38.0,
    fat: 21.0,
    fiber: 2.0,
    allergens: ['gluten', 'dairy', 'eggs'],
    portionDescription: '2 jumbo grilled sandwich halves',
    isPopular: true,
  },
  {
    id: 'fc_egg_sandwich',
    shopId: 'shop_tapri',
    shopName: 'Campus Nescafe / Tapri',
    name: 'Double Boiled Egg Sandwich',
    price: 55,
    category: 'egg',
    calories: 320,
    protein: 16.5,
    carbs: 34.0,
    fat: 12.0,
    fiber: 2.2,
    allergens: ['gluten', 'eggs'],
    portionDescription: '2 grilled slices packed with 2 boiled eggs',
  },

  // 4. Juice Junction & Shakes
  {
    id: 'fc_banana_shake',
    shopId: 'shop_juices',
    shopName: 'Juice Junction & Shakes',
    name: 'Fresh Banana Milkshake',
    price: 50,
    category: 'veg',
    calories: 270,
    protein: 7.5,
    carbs: 48.0,
    fat: 6.0,
    fiber: 2.5,
    allergens: ['dairy'],
    portionDescription: '300ml chilled tall glass',
  },
  {
    id: 'fc_cold_coffee',
    shopId: 'shop_juices',
    shopName: 'Juice Junction & Shakes',
    name: 'Thick Iced Cold Coffee',
    price: 60,
    category: 'veg',
    calories: 240,
    protein: 5.5,
    carbs: 32.0,
    fat: 10.0,
    fiber: 0.0,
    allergens: ['dairy'],
    portionDescription: '300ml glass with milk & scoop of ice cream',
    isPopular: true,
  },
  {
    id: 'fc_mosambi_juice',
    shopId: 'shop_juices',
    shopName: 'Juice Junction & Shakes',
    name: 'Fresh Sweet Lime (Mosambi) Juice',
    price: 45,
    category: 'veg',
    calories: 110,
    protein: 1.2,
    carbs: 26.0,
    fat: 0.3,
    fiber: 1.0,
    allergens: [],
    portionDescription: '250ml freshly squeezed, light salt/sugar',
  },
  {
    id: 'fc_whey_protein_shake',
    shopId: 'shop_juices',
    shopName: 'Juice Junction & Shakes',
    name: 'Gym Whey Protein Milkshake',
    price: 90,
    category: 'veg',
    calories: 230,
    protein: 26.0,
    carbs: 18.0,
    fat: 3.5,
    fiber: 1.5,
    allergens: ['dairy'],
    portionDescription: '1 scoop whey + 250ml milk blended',
    isPopular: true,
  },

  // 5. Tibetan Momo Stall
  {
    id: 'fc_steamed_veg_momos',
    shopId: 'shop_momos',
    shopName: 'Tibetan Momo Stall',
    name: 'Steamed Veg Momos (6 pcs)',
    price: 70,
    category: 'veg',
    calories: 230,
    protein: 6.0,
    carbs: 42.0,
    fat: 4.5,
    fiber: 2.8,
    allergens: ['gluten', 'soy'],
    portionDescription: '6 steamed dumplings + fiery red chutney',
  },
  {
    id: 'fc_steamed_chicken_momos',
    shopId: 'shop_momos',
    shopName: 'Tibetan Momo Stall',
    name: 'Steamed Chicken Momos (6 pcs)',
    price: 90,
    category: 'non-veg',
    calories: 290,
    protein: 19.5,
    carbs: 36.0,
    fat: 7.8,
    fiber: 1.5,
    allergens: ['gluten', 'soy'],
    portionDescription: '6 steamed chicken dumplings + spicy red chutney',
    isPopular: true,
  },
  {
    id: 'fc_paneer_momos',
    shopId: 'shop_momos',
    shopName: 'Tibetan Momo Stall',
    name: 'Steamed Paneer Momos (6 pcs)',
    price: 80,
    category: 'veg',
    calories: 270,
    protein: 14.0,
    carbs: 35.0,
    fat: 8.5,
    fiber: 2.0,
    allergens: ['gluten', 'dairy'],
    portionDescription: '6 steamed cottage cheese dumplings + soup',
  },
];

/**
 * Computes Protein-per-₹ ratio for every item,
 * and identifies the "Best Value" item within each shop for the student's goal.
 */
export function enrichFoodCourtItems(
  items: FoodCourtItem[] = RAW_FOOD_COURT_ITEMS,
  goal: GoalType = 'fitness'
): FoodCourtItem[] {
  // Group items by shopId
  const itemsByShop = new Map<string, FoodCourtItem[]>();
  for (const item of items) {
    const list = itemsByShop.get(item.shopId) || [];
    list.push({ ...item });
    itemsByShop.set(item.shopId, list);
  }

  const enrichedList: FoodCourtItem[] = [];

  itemsByShop.forEach((shopItems) => {
    // Compute protein per rupee
    for (const item of shopItems) {
      const pPerRupee = item.price > 0 ? item.protein / item.price : 0;
      item.proteinPerRupee = Math.round(pPerRupee * 1000) / 1000;
    }

    // Determine best value item for this shop:
    // For fitness & gain: highest protein per rupee
    // For lose: highest protein per rupee with calories under 450
    let bestItem: FoodCourtItem | null = null;
    let bestScore = -1;

    for (const item of shopItems) {
      let score = item.proteinPerRupee || 0;
      if (goal === 'lose' && item.calories > 450) {
        score *= 0.7; // slight penalty for high-calorie items in a deficit
      }
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }

    for (const item of shopItems) {
      item.isBestValue = bestItem !== null && item.id === bestItem.id;
      enrichedList.push(item);
    }
  });

  return enrichedList;
}

export const FOOD_COURT_ITEMS = enrichFoodCourtItems();

export const FOOD_COURT_LOOKUP = new Map<string, FoodCourtItem>(
  FOOD_COURT_ITEMS.map((item) => [item.id, item])
);
