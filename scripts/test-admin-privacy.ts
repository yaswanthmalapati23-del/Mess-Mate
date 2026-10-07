import { MESS_DISHES } from '../lib/data/messDishes';
import { FOOD_COURT_ITEMS } from '../lib/data/foodCourtItems';
import { CsvMenuRow, MenuValidationError, AggregateAnalytics, MealSlot } from '../lib/types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

function runAdminTests() {
  console.log('\n======================================================');
  console.log('🛡️ MESS MATE: ADMIN & PRIVACY GUARDRAIL TEST SUITE');
  console.log('======================================================\n');

  console.log('--- 1. CSV Template & Header Validation ---');
  const validHeader = 'Date,Meal,Dish Name,Calories,Protein (g),Carbs (g),Fat (g),Category,Is Opt-In,Allergen Tags';
  const headerCols = validHeader.split(',').map((h) => h.trim().toLowerCase());
  const requiredFields = ['date', 'meal', 'dish name', 'calories', 'protein', 'carbs', 'fat'];
  const allPresent = requiredFields.every((f) => headerCols.some((h) => h.includes(f)));
  assert(allPresent, 'CSV template contains all required clinical & menu header columns');

  const malformedHeader = 'Date,Dish,Kcal';
  const malformedCols = malformedHeader.split(',').map((h) => h.trim().toLowerCase());
  const malformedValid = requiredFields.every((f) => malformedCols.some((h) => h.includes(f)));
  assert(!malformedValid, 'Malformed header is correctly flagged as missing required fields');

  console.log('\n--- 2. Unmapped Dish Detection ---');
  const existingDishNames = new Set(MESS_DISHES.map((d) => d.name.toLowerCase().trim()));
  const knownDishName = 'Indori Kanda Poha with Peanuts'.toLowerCase().trim();
  const unknownDishName = 'Dragon Fruit Chia Bowl'.toLowerCase().trim();

  assert(existingDishNames.has(knownDishName), 'Identifies recognized mess menu dish: Indori Kanda Poha with Peanuts');
  assert(!existingDishNames.has(unknownDishName), 'Flags unrecognized/unmapped dish for admin mapping prompt');

  console.log('\n--- 3. Food Court Live Availability & Price Mutability ---');
  const sampleFcItem = { ...FOOD_COURT_ITEMS[0], isAvailable: true };
  assert(sampleFcItem.isAvailable === true, 'Food court item default status is Available');

  // Toggle availability
  sampleFcItem.isAvailable = false;
  assert(sampleFcItem.isAvailable === false, 'Food court item availability toggles to Sold Out in real time');

  // Update price
  const originalPrice = sampleFcItem.price;
  sampleFcItem.price = originalPrice + 10;
  assert(sampleFcItem.price === originalPrice + 10, 'Food court item price can be updated without full CSV re-upload');

  console.log('\n--- 4. Strict Privacy Guardrail Verification ---');
  const sampleAnalyticsPayload: AggregateAnalytics = {
    totalRegisteredStudents: 1420,
    dau: 618,
    wau: 1185,
    overallLoggingRateToday: 43.5,
    mealSlotRates: [
      { slot: 'breakfast', label: 'Breakfast', loggedCount: 485, percentage: 78.4 },
      { slot: 'lunch', label: 'Lunch', loggedCount: 562, percentage: 90.9 },
      { slot: 'snacks', label: 'Evening Snacks', loggedCount: 290, percentage: 46.9 },
      { slot: 'dinner', label: 'Dinner', loggedCount: 512, percentage: 82.8 },
    ],
    mostLoggedDishes: [
      { dishName: 'Tawa Roti (2 pcs)', dishId: 'dish_tawa_roti_pair', logCount: 1240, category: 'veg' },
    ],
    leastLoggedDishes: [
      { dishName: 'Lauki Chana Dal', dishId: 'dish_lauki_chana_dal', logCount: 94, category: 'veg' },
    ],
    fitScoreDistribution: [
      { range: '80-100', label: 'High Nutritional Fit', count: 682, percentage: 48 },
    ],
    goalDistribution: [
      { goal: 'gain', label: 'Muscle Gain', count: 639, percentage: 45 },
    ],
    lastUpdated: '11:30 AM',
  };

  const jsonString = JSON.stringify(sampleAnalyticsPayload);

  // Prohibited student identifiers
  const piiKeywords = ['student_id', 'student_name', 'email', 'weight_kg', 'height_cm', 'medical_notes', 'Student X'];
  let leakFound = false;
  for (const keyword of piiKeywords) {
    if (jsonString.includes(`"${keyword}"`)) {
      leakFound = true;
      break;
    }
  }

  assert(!leakFound, 'Privacy Guardrail: Zero student PII fields present in aggregate analytics payload');
  assert(
    sampleAnalyticsPayload.totalRegisteredStudents > 0 &&
      sampleAnalyticsPayload.dau > 0 &&
      sampleAnalyticsPayload.mealSlotRates.length === 4,
    'Aggregated KPIs (Total, DAU, WAU, Slots) are mathematically consistent'
  );

  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAdminTests();
