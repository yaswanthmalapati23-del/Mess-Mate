import { IFCTIngredient } from '../types';

/**
 * IFCT 2017: Indian Food Composition Tables (ICMR - National Institute of Nutrition, Hyderabad)
 * Verified nutritional values per 100g raw edible portion.
 */
export const IFCT_INGREDIENTS: IFCTIngredient[] = [
  // Cereals and Millets
  {
    id: 'ing_atta',
    code: 'A001',
    name: 'Whole Wheat Flour (Atta)',
    category: 'Cereals',
    calories: 320,
    protein: 10.6,
    carbs: 64.9,
    fat: 1.7,
    fiber: 11.2,
    allergens: ['gluten'],
    commonMeasureNote: '1 standard roti rolled from ~30g raw dough'
  },
  {
    id: 'ing_rice_raw',
    code: 'A002',
    name: 'Rice, Raw Milled (White Rice)',
    category: 'Cereals',
    calories: 356,
    protein: 7.9,
    carbs: 78.2,
    fat: 0.5,
    fiber: 2.8,
    allergens: [],
    commonMeasureNote: '1 ladle cooked rice is ~45g raw rice'
  },
  {
    id: 'ing_poha',
    code: 'A003',
    name: 'Rice Flakes (Poha / Aval)',
    category: 'Cereals',
    calories: 346,
    protein: 6.8,
    carbs: 77.3,
    fat: 1.1,
    fiber: 3.1,
    allergens: [],
    commonMeasureNote: '1 bowl cooked poha uses ~50g raw poha'
  },
  {
    id: 'ing_suji',
    code: 'A004',
    name: 'Semolina (Suji / Rava)',
    category: 'Cereals',
    calories: 334,
    protein: 10.2,
    carbs: 70.8,
    fat: 0.8,
    fiber: 4.1,
    allergens: ['gluten'],
    commonMeasureNote: 'Used for Upma, Halwa, Idli batter'
  },
  {
    id: 'ing_maida',
    code: 'A005',
    name: 'Refined Wheat Flour (Maida)',
    category: 'Cereals',
    calories: 352,
    protein: 10.3,
    carbs: 73.9,
    fat: 0.9,
    fiber: 2.7,
    allergens: ['gluten'],
    commonMeasureNote: 'Used for Puri, Naan, Bhatura'
  },
  {
    id: 'ing_besan',
    code: 'A006',
    name: 'Chickpea Flour (Besan)',
    category: 'Cereals',
    calories: 372,
    protein: 21.8,
    carbs: 57.8,
    fat: 5.6,
    fiber: 10.8,
    allergens: [],
    commonMeasureNote: 'Used for Kadhi, Chilla, Pakoras'
  },

  // Pulses and Legumes
  {
    id: 'ing_toor_dal',
    code: 'B001',
    name: 'Red Gram Dal (Toor / Arhar Dal)',
    category: 'Pulses & Legumes',
    calories: 333,
    protein: 22.3,
    carbs: 57.6,
    fat: 1.5,
    fiber: 9.1,
    allergens: [],
    commonMeasureNote: 'Core mess dal staple'
  },
  {
    id: 'ing_moong_dal',
    code: 'B002',
    name: 'Green Gram Dal (Moong Dal Yellow Split)',
    category: 'Pulses & Legumes',
    calories: 326,
    protein: 23.9,
    carbs: 56.8,
    fat: 1.2,
    fiber: 8.2,
    allergens: [],
    commonMeasureNote: 'Light, high bioavailability'
  },
  {
    id: 'ing_chana_dal',
    code: 'B003',
    name: 'Bengal Gram Dal (Chana Dal)',
    category: 'Pulses & Legumes',
    calories: 330,
    protein: 20.8,
    carbs: 57.0,
    fat: 4.6,
    fiber: 15.3,
    allergens: [],
    commonMeasureNote: 'High fiber, low GI pulse'
  },
  {
    id: 'ing_kabuli_chana',
    code: 'B004',
    name: 'Chickpeas (Kabuli Chana / Chole)',
    category: 'Pulses & Legumes',
    calories: 345,
    protein: 19.3,
    carbs: 60.5,
    fat: 5.3,
    fiber: 17.4,
    allergens: [],
    commonMeasureNote: 'Used for Chole Bhature, Chana Masala'
  },
  {
    id: 'ing_rajma',
    code: 'B005',
    name: 'Kidney Beans (Rajma)',
    category: 'Pulses & Legumes',
    calories: 329,
    protein: 22.9,
    carbs: 60.6,
    fat: 1.3,
    fiber: 16.2,
    allergens: [],
    commonMeasureNote: 'Hostel favorite Sunday special'
  },
  {
    id: 'ing_urad_dal',
    code: 'B006',
    name: 'Black Gram Dal (Urad Dal / Dal Makhani base)',
    category: 'Pulses & Legumes',
    calories: 334,
    protein: 24.0,
    carbs: 58.9,
    fat: 1.4,
    fiber: 18.3,
    allergens: [],
    commonMeasureNote: 'Idli, Dosa, and Dal Makhani staple'
  },
  {
    id: 'ing_soya_chunks',
    code: 'B007',
    name: 'Textured Soy Chunks (Soya Badi)',
    category: 'Pulses & Legumes',
    calories: 345,
    protein: 52.0,
    carbs: 33.0,
    fat: 0.5,
    fiber: 13.0,
    allergens: ['soy'],
    commonMeasureNote: 'Highest plant protein density (52% protein)'
  },
  {
    id: 'ing_masoor_dal',
    code: 'B008',
    name: 'Lentil, Whole Red/Brown (Masoor Dal)',
    category: 'Pulses & Legumes',
    calories: 314,
    protein: 24.3,
    carbs: 56.4,
    fat: 0.7,
    fiber: 10.7,
    allergens: [],
    commonMeasureNote: 'Quick cooking mess dal'
  },

  // Dairy Products
  {
    id: 'ing_milk_toned',
    code: 'D001',
    name: 'Toned Cow Milk (3% fat)',
    category: 'Dairy',
    calories: 58,
    protein: 3.1,
    carbs: 4.7,
    fat: 3.0,
    fiber: 0.0,
    allergens: ['dairy'],
    commonMeasureNote: '1 standard mess tea glass is ~150ml'
  },
  {
    id: 'ing_paneer',
    code: 'D002',
    name: 'Paneer (Indian Cottage Cheese)',
    category: 'Dairy',
    calories: 257,
    protein: 18.3,
    carbs: 2.1,
    fat: 20.8,
    fiber: 0.0,
    allergens: ['dairy'],
    commonMeasureNote: 'Standard mess portion is 4-5 cubes (~60g)'
  },
  {
    id: 'ing_curd',
    code: 'D003',
    name: 'Curd / Dahi (Plain Whole Milk)',
    category: 'Dairy',
    calories: 60,
    protein: 3.1,
    carbs: 4.4,
    fat: 3.5,
    fiber: 0.0,
    allergens: ['dairy'],
    commonMeasureNote: '1 standard mess katori is ~100g'
  },
  {
    id: 'ing_ghee',
    code: 'D004',
    name: 'Desi Ghee (Clarified Butter)',
    category: 'Oils & Fats',
    calories: 897,
    protein: 0.0,
    carbs: 0.0,
    fat: 99.7,
    fiber: 0.0,
    allergens: ['dairy'],
    commonMeasureNote: '1 tsp brushed on 2 rotis is ~5g'
  },
  {
    id: 'ing_butter',
    code: 'D005',
    name: 'Table Butter',
    category: 'Dairy',
    calories: 717,
    protein: 0.8,
    carbs: 0.5,
    fat: 81.0,
    fiber: 0.0,
    allergens: ['dairy'],
    commonMeasureNote: '1 single-serve chiplet is 10g'
  },

  // Eggs and Poultry / Meat
  {
    id: 'ing_egg_whole',
    code: 'E001',
    name: 'Egg, Whole Hen (Boiled/Raw)',
    category: 'Eggs',
    calories: 143,
    protein: 12.6,
    carbs: 0.7,
    fat: 9.9,
    fiber: 0.0,
    allergens: ['eggs'],
    commonMeasureNote: '1 standard large egg is ~50g (6.3g protein)'
  },
  {
    id: 'ing_egg_white',
    code: 'E002',
    name: 'Egg White Only',
    category: 'Eggs',
    calories: 52,
    protein: 10.9,
    carbs: 0.7,
    fat: 0.2,
    fiber: 0.0,
    allergens: ['eggs'],
    commonMeasureNote: 'White of 1 egg is ~33g (3.6g protein, 0 fat)'
  },
  {
    id: 'ing_chicken_curry_cut',
    code: 'M001',
    name: 'Chicken, Curry Cut (Skinless)',
    category: 'Meat & Poultry',
    calories: 139,
    protein: 21.8,
    carbs: 0.0,
    fat: 4.8,
    fiber: 0.0,
    allergens: [],
    commonMeasureNote: 'Standard mess chicken portion is 2 pcs (~80g bone-in raw)'
  },

  // Oils and Cooking Fats
  {
    id: 'ing_refined_oil',
    code: 'F001',
    name: 'Refined Soybean / Sunflower Oil (Mess Cooking Oil)',
    category: 'Oils & Fats',
    calories: 900,
    protein: 0.0,
    carbs: 0.0,
    fat: 100.0,
    fiber: 0.0,
    allergens: [],
    commonMeasureNote: 'Bulk cooking oil used across mess gravies & tadkas'
  },
  {
    id: 'ing_mustard_oil',
    code: 'F002',
    name: 'Mustard Oil (Sarson ka Tel)',
    category: 'Oils & Fats',
    calories: 884,
    protein: 0.0,
    carbs: 0.0,
    fat: 100.0,
    fiber: 0.0,
    allergens: [],
    commonMeasureNote: 'Used in North & East Indian mess subzis'
  },

  // Vegetables
  {
    id: 'ing_potato',
    code: 'V001',
    name: 'Potato (Aloo)',
    category: 'Vegetables',
    calories: 70,
    protein: 1.6,
    carbs: 15.7,
    fat: 0.1,
    fiber: 1.7,
    allergens: [],
    commonMeasureNote: 'Omnipresent in mess subzis (Aloo Matar, Aloo Gobi)'
  },
  {
    id: 'ing_onion',
    code: 'V002',
    name: 'Onion (Pyaz)',
    category: 'Vegetables',
    calories: 40,
    protein: 1.1,
    carbs: 9.3,
    fat: 0.1,
    fiber: 1.7,
    allergens: [],
    commonMeasureNote: 'Aromatic base for all curries & gravies'
  },
  {
    id: 'ing_tomato',
    code: 'V003',
    name: 'Tomato (Tamatar)',
    category: 'Vegetables',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    allergens: [],
    commonMeasureNote: 'Acid base for gravies'
  },
  {
    id: 'ing_cauliflower',
    code: 'V004',
    name: 'Cauliflower (Phool Gobi)',
    category: 'Vegetables',
    calories: 25,
    protein: 1.9,
    carbs: 5.0,
    fat: 0.3,
    fiber: 2.0,
    allergens: [],
    commonMeasureNote: 'Low calorie high volume seasonal subzi'
  },
  {
    id: 'ing_cabbage',
    code: 'V005',
    name: 'Cabbage (Patta Gobi)',
    category: 'Vegetables',
    calories: 25,
    protein: 1.3,
    carbs: 5.8,
    fat: 0.1,
    fiber: 2.5,
    allergens: [],
    commonMeasureNote: 'Cheap staple for hostel dinners'
  },
  {
    id: 'ing_green_peas',
    code: 'V006',
    name: 'Green Peas, Fresh (Matar)',
    category: 'Vegetables',
    calories: 81,
    protein: 5.4,
    carbs: 14.5,
    fat: 0.4,
    fiber: 5.7,
    allergens: [],
    commonMeasureNote: 'Adds moderate plant protein to curries'
  },
  {
    id: 'ing_spinach',
    code: 'V007',
    name: 'Spinach (Palak)',
    category: 'Vegetables',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    allergens: [],
    commonMeasureNote: 'Used in Palak Paneer, Aloo Palak'
  },
  {
    id: 'ing_bhindi',
    code: 'V008',
    name: 'Lady Finger / Okra (Bhindi)',
    category: 'Vegetables',
    calories: 33,
    protein: 1.9,
    carbs: 7.0,
    fat: 0.2,
    fiber: 3.2,
    allergens: [],
    commonMeasureNote: 'Stir fried bhindi masala'
  },
  {
    id: 'ing_lauki',
    code: 'V009',
    name: 'Bottle Gourd (Lauki / Dudhi)',
    category: 'Vegetables',
    calories: 14,
    protein: 0.6,
    carbs: 3.4,
    fat: 0.1,
    fiber: 1.2,
    allergens: [],
    commonMeasureNote: 'Hydrating, low calorie staple'
  },
  {
    id: 'ing_carrot',
    code: 'V010',
    name: 'Carrot (Gajar)',
    category: 'Vegetables',
    calories: 41,
    protein: 0.9,
    carbs: 9.6,
    fat: 0.2,
    fiber: 2.8,
    allergens: [],
    commonMeasureNote: 'Mix veg and salad ingredient'
  },

  // Nuts, Seeds & Condiments
  {
    id: 'ing_peanuts',
    code: 'N001',
    name: 'Peanuts / Groundnuts (Moongphali)',
    category: 'Nuts & Seeds',
    calories: 567,
    protein: 25.8,
    carbs: 16.1,
    fat: 49.2,
    fiber: 8.5,
    allergens: ['nuts'],
    commonMeasureNote: 'Used in Poha and Upma tempering'
  },
  {
    id: 'ing_sugar',
    code: 'S001',
    name: 'Refined Sugar',
    category: 'Cereals',
    calories: 387,
    protein: 0.0,
    carbs: 100.0,
    fat: 0.0,
    fiber: 0.0,
    allergens: [],
    commonMeasureNote: 'Tea, coffee, desserts (Halwa, Kheer)'
  }
];

export const INGREDIENT_LOOKUP = new Map<string, IFCTIngredient>(
  IFCT_INGREDIENTS.map((ing) => [ing.id, ing])
);
